#!/usr/bin/env python3
"""Conservative, stdlib-only CurseForge author publisher. Python 3.11+, POSIX."""
import argparse
import contextlib
import fcntl
import hashlib
import io
import json
import os
from pathlib import Path
import re
import subprocess
import sys
import tempfile
import time
import tomllib
import urllib.error
import urllib.request
import uuid
import zipfile

HOST = 'https://minecraft.curseforge.com'
RELATIONS = {'embeddedLibrary', 'incompatible', 'optionalDependency', 'requiredDependency', 'tool'}
MAX_RESPONSE = 8 * 1024 * 1024


class Error(Exception):
    pass


def need(ok, message):
    if not ok:
        raise Error(message)


def positive(value):
    return type(value) is int and 0 < value < 2**63


def fields(obj, required, optional=()):
    need(type(obj) is dict and set(required) <= obj.keys() <= set(required) | set(optional), 'Invalid object fields')


def text(value):
    return type(value) is str and 0 < len(value) <= 100000 and '\x00' not in value


def load_json(path):
    def pairs(items):
        result = {}
        for key, value in items:
            need(key not in result, 'Duplicate JSON field')
            result[key] = value
        return result
    try:
        return json.loads(Path(path).read_text(), object_pairs_hook=pairs)
    except (OSError, ValueError):
        raise Error('Cannot read valid JSON') from None


def metadata_schema(obj, update=False):
    allowed = {'changelog', 'changelogType', 'displayName', 'gameVersions', 'releaseType', 'relations'}
    fields(obj, {'fileID'} if update else allowed, allowed if update else ())
    if update:
        need(positive(obj['fileID']) and len(obj) > 1, 'Update requires fileID and changed metadata')
    else:
        need('fileID' not in obj, 'fileID is update-only')
    for key in ('changelog', 'displayName'):
        if key in obj:
            need(text(obj[key]), 'Invalid metadata text')
    if 'changelogType' in obj:
        need(obj['changelogType'] in ('text', 'html', 'markdown'), 'Invalid changelog type')
    if 'releaseType' in obj:
        need(obj['releaseType'] in ('alpha', 'beta', 'release'), 'Invalid release type')
    if 'gameVersions' in obj:
        ids = obj['gameVersions']
        need(type(ids) is list and ids and all(positive(x) for x in ids) and len(ids) == len(set(ids)), 'gameVersions requires unique positive numeric IDs')
    if 'relations' in obj:
        fields(obj['relations'], {'projects'})
        projects = obj['relations']['projects']
        need(type(projects) is list, 'Invalid relations projects')
        seen = set()
        for item in projects:
            fields(item, {'slug', 'type'})
            need(type(item['slug']) is str and re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', item['slug']) and item['type'] in RELATIONS, 'Invalid relation')
            need(item['slug'] not in seen, 'Duplicate relation')
            seen.add(item['slug'])


def manifest(path):
    m = load_json(path)
    fields(m, {'schema', 'project_id', 'author_url', 'version', 'minecraft_version', 'version_file', 'artifact', 'descriptor', 'mod_id', 'display_name', 'release_type', 'game_versions', 'dependencies'})
    need(m['schema'] == 1 and type(m['schema']) is int and positive(m['project_id']), 'Invalid manifest policy')
    need(m['author_url'] == HOST, 'Only the allowlisted HTTPS author host is permitted')
    need(type(m['version']) is str and re.fullmatch(r'[0-9]+\.[0-9]+\.[0-9]+(?:[-+][A-Za-z0-9.-]+)?', m['version']), 'Invalid version')
    for key in ('version_file', 'artifact', 'descriptor', 'mod_id', 'display_name'):
        need(text(m[key]), 'Invalid manifest string')
    for key in ('version_file', 'artifact', 'descriptor'):
        p = Path(m[key])
        need(not p.is_absolute() and '..' not in p.parts and '\\' not in m[key], 'Manifest paths must be relative and contained')
    need('{version}' in m['artifact'] and m['artifact'].replace('{version}', '').find('{') == -1, 'Artifact requires only {version} placeholder')
    need(m['release_type'] in ('alpha', 'beta', 'release'), 'Invalid manifest release type')
    need(type(m['game_versions']) is list and m['game_versions'], 'Missing game version selectors')
    for selector in m['game_versions']:
        fields(selector, {'name'}, {'id', 'type_id'})
        need(text(selector['name']), 'Invalid version selector')
        for key in ('id', 'type_id'):
            if key in selector:
                need(positive(selector[key]), 'Invalid version selector ID')
    need(text(m['minecraft_version']) and any(s['name'] == m['minecraft_version'] for s in m['game_versions']), 'Minecraft version must match a game selector')
    need(type(m['dependencies']) is dict and m['dependencies'], 'Missing dependency map')
    for mod, slug in m['dependencies'].items():
        need(type(mod) is str and re.fullmatch(r'[a-z0-9_]+', mod) and type(slug) is str and re.fullmatch(r'[a-z0-9-]+', slug), 'Invalid dependency mapping')
    return m


def git(root, *args):
    p = subprocess.run(['git', '--no-optional-locks', '-C', str(root), *args], capture_output=True, text=True, timeout=15)
    need(p.returncode == 0, 'Git source/ref verification failed')
    return p.stdout.strip()


def source(root, m, tag):
    need(tag == 'v' + m['version'], 'Tag does not match manifest version')
    head = git(root, 'rev-parse', 'HEAD')
    need(git(root, 'rev-parse', '--verify', 'refs/tags/' + tag + '^{commit}') == head, 'Tag must resolve to checked-out HEAD')
    need(not git(root, 'status', '--porcelain', '--untracked-files=no'), 'Tracked working tree must be clean')
    value = (root / m['version_file']).read_text()
    versions = re.findall(r"(?m)^version\s*=\s*['\"]([^'\"]+)['\"]\s*$", value)
    need(versions == [m['version']], 'Source version does not match manifest')
    # Also parse the source descriptor, not just the ZIP supplied by the caller.
    descriptor(root / m['descriptor'], m, source_file=True)
    return head


def descriptor(value, m, source_file=False):
    data = value.read_bytes() if source_file else value
    try:
        doc = tomllib.loads(data.decode('utf-8'))
    except (ValueError, UnicodeError):
        raise Error('Invalid mod descriptor') from None
    mods = doc.get('mods', [])
    need(len(mods) == 1 and mods[0].get('modId') == m['mod_id'], 'Wrong mod/project descriptor')
    expected = '${file.jarVersion}' if source_file else m['version']
    need(mods[0].get('version') == expected, 'Descriptor version mismatch')
    deps = doc.get('dependencies', {}).get(m['mod_id'], [])
    minecraft = [d for d in deps if d.get('modId') == 'minecraft']
    need(len(minecraft) == 1 and minecraft[0].get('type') == 'required' and minecraft[0].get('versionRange') == '[' + m['minecraft_version'] + ']', 'Descriptor Minecraft version differs from manifest')
    required = {d.get('modId') for d in deps if d.get('type') == 'required'} - {'minecraft', 'neoforge'}
    need(required == set(m['dependencies']), 'Descriptor dependencies differ from manifest')


def artifact(root, m, expected=None):
    path = root / m['artifact'].format(version=m['version'])
    need(not path.is_symlink(), 'Release JAR must not be a symlink')
    try:
        real = path.resolve(strict=True)
    except OSError:
        raise Error('Expected release JAR missing') from None
    need(real.is_relative_to(root.resolve()), 'Release JAR resolves outside repository')
    path = real
    need(path.is_file() and path.suffix == '.jar', 'Expected release JAR missing')
    need(path.stat().st_size <= 128 * 1024 * 1024, 'JAR exceeds size limit')
    data = path.read_bytes()
    digest = hashlib.sha256(data).hexdigest()
    if expected is not None:
        need(re.fullmatch('[0-9a-f]{64}', expected) is not None and digest == expected, 'Artifact SHA-256 mismatch')
    try:
        with zipfile.ZipFile(io.BytesIO(data)) as z:
            names = z.namelist()
            need(len(names) == len(set(names)), 'Duplicate ZIP entries')
            need(all(not n.startswith('/') and '..' not in Path(n).parts and '\\' not in n for n in names), 'Unsafe ZIP member')
            need(sum(x.file_size for x in z.infolist()) <= 256 * 1024 * 1024, 'Expanded ZIP exceeds size limit')
            need(z.testzip() is None, 'JAR CRC failure')
            descriptor(z.read('META-INF/neoforge.mods.toml'), m)
    except (zipfile.BadZipFile, KeyError, RuntimeError):
        raise Error('Invalid release JAR') from None
    return path.name, data, digest


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


class Author:
    def __init__(self):
        # Do not route author credentials through environment-configured proxies.
        self.opener = urllib.request.build_opener(urllib.request.ProxyHandler({}), NoRedirect())

    def request(self, method, path, body=None, content_type=None):
        need(method in ('GET', 'POST') and re.fullmatch(r'/api/(game/versions|projects/[1-9][0-9]*/(?:upload-file|update-file))', path), 'Disallowed author operation')
        need((method == 'GET') == (path == '/api/game/versions'), 'Disallowed HTTP method')
        a, b = os.environ.get('CURSEFORGE_API_KEY'), os.environ.get('CF_API_KEY')
        need(not (a and b and a != b), 'Conflicting API token environment variables')
        token = a or b
        need(type(token) is str and token and not any(c.isspace() or ord(c) < 32 for c in token), 'Missing or invalid API token environment variable')
        headers = {'X-Api-Token': token, 'Accept': 'application/json'}
        if content_type:
            headers['Content-Type'] = content_type
        req = urllib.request.Request(HOST + path, data=body, headers=headers, method=method)
        try:
            with self.opener.open(req, timeout=45) as response:
                need(response.status == 200, 'Unexpected author HTTP response')
                raw = response.read(MAX_RESPONSE + 1)
                need(len(raw) <= MAX_RESPONSE, 'Author response exceeds limit')
                return json.loads(raw)
        except Exception:
            # Never echo upstream bodies, headers, URLs or exception text: servers may reflect tokens.
            raise Error('Author request failed or response invalid; no automatic retry') from None


def resolve(selectors, rows):
    need(type(rows) is list, 'Invalid game versions response')
    for row in rows:
        need(type(row) is dict and positive(row.get('id')) and text(row.get('name')) and positive(row.get('gameVersionTypeID')), 'Invalid game versions row')
    result = []
    for s in selectors:
        matches = [r for r in rows if r['name'] == s['name'] and ('id' not in s or r['id'] == s['id']) and ('type_id' not in s or r['gameVersionTypeID'] == s['type_id'])]
        need(len(matches) == 1, 'Unknown or ambiguous game version selector; pin id/type_id in manifest')
        result.append(matches[0]['id'])
    need(len(result) == len(set(result)), 'Duplicate resolved game version ID')
    return result


def multipart(metadata, filename=None, data=None):
    boundary = 'cf-' + uuid.uuid4().hex
    b = boundary.encode()
    chunks = [b'--' + b + b'\r\nContent-Disposition: form-data; name="metadata"\r\nContent-Type: application/json\r\n\r\n' + json.dumps(metadata, separators=(',', ':')).encode() + b'\r\n']
    if filename is not None:
        need(re.fullmatch(r'[A-Za-z0-9._+-]+\.jar', filename) is not None, 'Unsafe artifact filename')
        chunks.append(b'--' + b + b'\r\nContent-Disposition: form-data; name="file"; filename="' + filename.encode() + b'"\r\nContent-Type: application/java-archive\r\n\r\n' + data + b'\r\n')
    chunks.append(b'--' + b + b'--\r\n')
    return b''.join(chunks), 'multipart/form-data; boundary=' + boundary


def journal_path(path):
    # Canonical journal location: symlinked files are refused and the parent is resolved,
    # so aliases cannot split history or locks.
    path = Path(path).expanduser()
    need(not path.is_symlink(), 'Journal must not be a symlink')
    path = path.parent.resolve() / path.name
    need(path.name.endswith('.json') and not path.is_symlink(), 'Invalid journal path')
    return path


def read_journal(path):
    path = journal_path(path)
    if not path.exists():
        return {'schema': 1, 'operations': {}}
    j = load_json(path)
    fields(j, {'schema', 'operations'})
    need(type(j['schema']) is int and j['schema'] == 1 and type(j['operations']) is dict, 'Invalid journal')
    for key, entry in j['operations'].items():
        need(type(key) is str, 'Invalid journal key')
        fields(entry, {'state', 'project_id', 'version', 'fingerprint', 'started'}, {'id'})
        need(entry['state'] in ('pending', 'ambiguous', 'accepted') and positive(entry['project_id']) and text(entry['version']) and type(entry['fingerprint']) is str and re.fullmatch('[0-9a-f]{64}', entry['fingerprint']) and type(entry['started']) is int, 'Invalid journal entry')
        need(('id' not in entry or positive(entry['id'])) and (entry['state'] != 'accepted' or 'id' in entry), 'Invalid journal result ID')
    return j


def save_journal(path, j):
    # Atomic replacement plus directory fsync; must run while holding journal lock.
    path = journal_path(path)
    fd, name = tempfile.mkstemp(prefix='.cf-journal-', dir=path.parent)
    try:
        with os.fdopen(fd, 'w') as f:
            json.dump(j, f, sort_keys=True)
            f.flush()
            os.fsync(f.fileno())
        os.replace(name, path)
        directory = os.open(path.parent, os.O_RDONLY)
        try:
            os.fsync(directory)
        finally:
            os.close(directory)
    finally:
        if os.path.exists(name):
            os.unlink(name)


@contextlib.contextmanager
def locked(path):
    # Lock the journal's resolved directory inode: deleting or recreating a sibling
    # lock file cannot create a second lock, and directory aliases share one inode.
    path = Path(path).expanduser()
    path.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
    path = journal_path(path)
    fd = os.open(path.parent, os.O_RDONLY | os.O_DIRECTORY | os.O_NOFOLLOW)
    try:
        try:
            fcntl.flock(fd, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            raise Error('Publisher journal is locked by another process') from None
        yield path
    finally:
        os.close(fd)


def mutate(author, journal_path, m, command, meta, filename=None, data=None, digest=None):
    metadata_schema(meta, command == 'update-file')
    payload, content_type = multipart(meta, filename, data)
    fingerprint = hashlib.sha256(json.dumps({'metadata': meta, 'sha256': digest}, sort_keys=True).encode()).hexdigest()
    # Upload slot deliberately ignores artifact hash: changing a JAR cannot bypass a version guard.
    key = f"{m['project_id']}:{m['version']}:upload" if command == 'upload' else f"{m['project_id']}:update:{meta['fileID']}:{fingerprint}"
    with locked(journal_path) as journal_path:
        journal = read_journal(journal_path)
        # An ambiguous update also blocks different metadata changes to the same target.
        if command == 'update-file':
            prefix = f"{m['project_id']}:update:{meta['fileID']}:"
            need(not any(k.startswith(prefix) and v['state'] != 'accepted' for k, v in journal['operations'].items()), 'Unresolved update outcome; manual verification required')
        prior = journal['operations'].get(key)
        if prior:
            need(prior['project_id'] == m['project_id'] and prior['version'] == m['version'], 'Journal entry policy mismatch')
            need(command != 'update-file' or prior.get('id') == meta['fileID'], 'Journal target ID mismatch')
            need(prior['state'] == 'accepted' and prior['fingerprint'] == fingerprint, 'Existing or ambiguous version/operation; manual verification required')
            return {'state': 'already-accepted', 'id': prior['id'], 'verification': 'verification-required'}
        entry = {'state': 'pending', 'project_id': m['project_id'], 'version': m['version'], 'fingerprint': fingerprint, 'started': int(time.time())}
        journal['operations'][key] = entry
        save_journal(journal_path, journal)  # Durable before transmitting any byte.
        try:
            result = author.request('POST', f"/api/projects/{m['project_id']}/{'upload-file' if command == 'upload' else 'update-file'}", payload, content_type)
            need(type(result) is dict and positive(result.get('id')), 'Author HTTP 200 without a valid result ID')
            if command == 'update-file':
                need(result['id'] == meta['fileID'], 'Author returned a different file ID')
        except Exception:
            entry['state'] = 'ambiguous'
            save_journal(journal_path, journal)
            raise Error('Publication outcome ambiguous; journal blocks retries; verify manually') from None
        entry.update(state='accepted', id=result['id'])
        save_journal(journal_path, journal)
        return {'state': 'accepted', 'id': result['id'], 'verification': 'verification-required'}


class SafeParser(argparse.ArgumentParser):
    def error(self, message):
        # argparse normally reflects unknown argv, which may contain misplaced credentials.
        raise Error('Invalid CLI arguments; use --help (credentials belong only in environment)')


def parser():
    p = SafeParser(description=__doc__)
    p.add_argument('command', choices=['preflight', 'plan', 'upload', 'update-file', 'status'])
    p.add_argument('--manifest', type=Path, default=Path('curseforge-project.json'))
    p.add_argument('--journal', type=Path, default=None, help='Default: $XDG_STATE_HOME or ~/.local/state /curseforge/<project>.json; CI passes an explicit workspace path')
    p.add_argument('--tag')
    p.add_argument('--project-id', type=int, help='Optional assertion, never overrides manifest')
    p.add_argument('--sha256', help='Assert expected artifact SHA-256')
    p.add_argument('--changelog-file', type=Path)
    p.add_argument('--metadata', type=Path, help='Strict metadata-only update JSON including fileID')
    p.add_argument('--confirm-target', help='Required update assertion: PROJECT_ID:FILE_ID')
    p.add_argument('--confirm-no-existing-file', action='store_true', help='Operator has checked remote project/version for duplicates')
    p.add_argument('--dry-run', action='store_true', help='GETs only; no journal, locks, directories or author writes')
    return p


def run(args, author=None):
    m = manifest(args.manifest)
    root = args.manifest.resolve().parent
    need(args.project_id is None or args.project_id == m['project_id'], 'Project ID differs from manifest policy')
    if args.journal is None:
        state = Path(os.environ.get('XDG_STATE_HOME') or Path.home() / '.local' / 'state')
        args.journal = state / 'curseforge' / f"{m['project_id']}.json"
    if args.command == 'status':
        j = read_journal(args.journal)
        entries = [v for v in j['operations'].values() if v['project_id'] == m['project_id'] and v['version'] == m['version']]
        return {'project_id': m['project_id'], 'version': m['version'], 'operations': entries, 'verification': 'verification-required', 'reason': 'Official upload API has no documented file-list/readback endpoint; journal is not remote truth'}
    need(args.tag is not None, '--tag is required')
    head = source(root, m, args.tag)
    name = data = digest = None
    if args.command != 'update-file':
        name, data, digest = artifact(root, m, args.sha256)
    if args.command == 'preflight':
        return {'state': 'preflight-ok', 'project_id': m['project_id'], 'version': m['version'], 'commit': head, 'artifact': name, 'sha256': digest}
    if args.command == 'update-file':
        need(args.metadata is not None, '--metadata is required for update-file')
        meta = load_json(args.metadata)
        metadata_schema(meta, True)
        need(args.confirm_target == f"{m['project_id']}:{meta['fileID']}", 'Explicit PROJECT_ID:FILE_ID target confirmation required')
    else:
        changelog = args.changelog_file.read_text() if args.changelog_file else 'Release ' + m['version']
        need(text(changelog), 'Invalid changelog text')
        meta = {'changelog': changelog, 'changelogType': 'markdown', 'displayName': m['display_name'] + ' ' + m['version'], 'releaseType': m['release_type'], 'relations': {'projects': [{'slug': slug, 'type': 'requiredDependency'} for slug in m['dependencies'].values()]}, 'gameVersions': []}
    author = author or Author()
    versions = author.request('GET', '/api/game/versions')
    ids = resolve(m['game_versions'], versions)
    if args.command == 'update-file':
        if 'gameVersions' in meta:
            need(set(meta['gameVersions']) == set(ids), 'Update gameVersions differ from manifest policy')
        if 'releaseType' in meta:
            need(meta['releaseType'] == m['release_type'], 'Update releaseType differs from manifest policy')
        if 'relations' in meta:
            wanted = {(slug, 'requiredDependency') for slug in m['dependencies'].values()}
            need({(r['slug'], r['type']) for r in meta['relations']['projects']} == wanted, 'Update relations differ from manifest policy')
    else:
        meta['gameVersions'] = ids
    metadata_schema(meta, args.command == 'update-file')
    result = {'state': 'planned', 'project_id': m['project_id'], 'version': m['version'], 'commit': head, 'artifact': name, 'sha256': digest, 'metadata': meta, 'verification': 'verification-required'}
    if args.command == 'plan' or args.dry_run:
        return result
    need(args.command == 'update-file' or args.confirm_no_existing_file, 'Upload requires explicit duplicate-check confirmation')
    # Validate credentials before journaling. Production Author resolves env in GET above.
    result = mutate(author, args.journal, m, args.command, meta, name, data, digest)
    return result


def sanitized(value):
    secrets = [os.environ.get(key) for key in ('CURSEFORGE_API_KEY', 'CF_API_KEY')]
    def scrub(item):
        if isinstance(item, str):
            for secret in secrets:
                if secret:
                    item = item.replace(secret, '[REDACTED]')
            return item
        if isinstance(item, dict):
            return {scrub(k): scrub(v) for k, v in item.items()}
        if isinstance(item, list):
            return [scrub(v) for v in item]
        return item
    return scrub(value)


def main(argv=None):
    # Only our own Error messages are safe diagnostics; never expose raw exceptions.
    try:
        result = run(parser().parse_args(argv))
        print(json.dumps(sanitized(result), sort_keys=True))
        return 0
    except Error as exc:
        print(f'Publisher refused: {sanitized(str(exc))}', file=sys.stderr)
        return 1
    except (OSError, ValueError, KeyError, TypeError, subprocess.TimeoutExpired):
        print('Publisher refused or failed; check validation, credentials and journal; never blindly retry an upload.', file=sys.stderr)
        return 1


if __name__ == '__main__':
    sys.exit(main())
