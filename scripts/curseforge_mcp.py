#!/usr/bin/env python3
"""Narrow stdlib MCP 2025-11-25 stdio adapter; Python 3.11+, POSIX."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import selectors
import signal
import subprocess
import sys
import tempfile
import time

PROTOCOL = '2025-11-25'
MAX_MESSAGE = 65536
MAX_OUTPUT = 262144


class Refused(Exception):
    pass


def require(ok, message):
    if not ok:
        raise Refused(message)


def decode(raw):
    def pairs(items):
        result = {}
        for key, value in items:
            require(key not in result, 'Duplicate JSON fields are not accepted')
            result[key] = value
        return result
    return json.loads(raw, object_pairs_hook=pairs,
                      parse_constant=lambda _: (_ for _ in ()).throw(ValueError()))


def bounded_json(path):
    with path.open('rb') as stream:
        raw = stream.read(MAX_OUTPUT + 1)
    require(len(raw) <= MAX_OUTPUT, 'Configured JSON exceeds size limit')
    value = decode(raw)
    require(type(value) is dict, 'Configured JSON must be an object')
    return raw, value


def positive(value):
    return type(value) is int and 0 < value < 2**63


def digest(value):
    return type(value) is str and re.fullmatch('[0-9a-f]{64}', value) is not None


class Adapter:
    def __init__(self, args):
        self.root = args.root.resolve(strict=True)
        self.manifest = self.contained(args.manifest)
        require(self.manifest.parent == self.root, 'Manifest must be directly in configured root')
        self.publisher = self.contained(Path('scripts/curseforge_publish.py'))
        self.journal = args.journal.expanduser().resolve()
        require(not self.journal.is_relative_to(self.root), 'Journal must be outside repository')
        self.metadata = self.contained(args.update_metadata) if args.update_metadata else None
        self.allow_write = args.allow_write
        self.timeout = args.timeout
        self.policy()

    def contained(self, path):
        target = (self.root / path).resolve(strict=True)
        require(target.is_relative_to(self.root), 'Configured path must be contained in root')
        return target

    def policy(self):
        _, m = bounded_json(self.manifest)
        require(positive(m.get('project_id')), 'Manifest project_id must be positive')
        version = m.get('version')
        require(type(version) is str and re.fullmatch(r'[0-9]+\.[0-9]+\.[0-9]+(?:[-+][A-Za-z0-9.-]+)?', version), 'Invalid manifest version')
        for key in ('artifact', 'version_file', 'descriptor'):
            value = m.get(key)
            require(type(value) is str and not Path(value).is_absolute() and '..' not in Path(value).parts and '\\' not in value, 'Invalid manifest path')
            target = (self.root / value.replace('{version}', version)).resolve()
            require(target.is_relative_to(self.root), 'Manifest path escapes root')
        return m

    def tools(self):
        specs = [
            ('project_info', 'Read fixed project/version policy. No credentials or arbitrary file reads.', {}),
            ('preflight', 'Validate local source/tag/artifact; no network or author writes.', {}),
            ('status', 'Read local journal only, NOT remote publication status.', {}),
            ('plan', 'Resolve release metadata using authenticated author GET; no author or journal writes.', {}),
            ('upload_dry_run', 'Validate upload using author GET only; NEVER upload. No write gate needed.', {}),
        ]
        project = {'type': 'integer', 'minimum': 1, 'maximum': 2**63 - 1}
        sha = {'type': 'string', 'pattern': '^[0-9a-f]{64}$'}
        upload = {'confirm_project_id': project, 'confirm_sha256': sha,
                  'confirm_no_existing_file': {'type': 'boolean', 'const': True}}
        update = {'confirm_project_id': project, 'confirm_file_id': project,
                  'confirm_metadata_sha256': sha}
        if self.metadata:
            specs.append(('update_file_dry_run', 'Validate fixed metadata update via author GET only. Confirm project, target file, and SHA-256 of configured metadata bytes; no author writes.', update))
        if self.allow_write:
            specs.append(('upload', 'UPLOAD fixed artifact. Requires human project/hash and remote duplicate-check confirmations. Accepted is NOT verified or published; never blindly retry.', upload))
            if self.metadata:
                specs.append(('update_file', 'UPDATE fixed metadata target. Requires human project/file/metadata-hash confirmations. Accepted is NOT verified; never blindly retry.', update))
        return [{'name': name, 'description': description,
                 'inputSchema': {'type': 'object', 'properties': props, 'required': list(props), 'additionalProperties': False},
                 'annotations': {'readOnlyHint': name not in ('upload', 'update_file'),
                                 'destructiveHint': name in ('upload', 'update_file'),
                                 'openWorldHint': name not in ('project_info', 'preflight', 'status')}}
                for name, description, props in specs]

    def invoke(self, name, arguments):
        tools = {tool['name']: tool for tool in self.tools()}
        require(type(name) is str and name in tools, 'Unknown or disabled tool; mutations require --allow-write at launch')
        props = tools[name]['inputSchema']['properties']
        require(type(arguments) is dict and set(arguments) == set(props), 'Invalid tool arguments; only advertised confirmation fields accepted, never credentials or paths')
        m = self.policy()
        for key, value in arguments.items():
            if key in ('confirm_project_id', 'confirm_file_id'):
                require(positive(value), 'Confirmation ID must be a positive integer')
            elif key.endswith('sha256'):
                require(digest(value), 'Confirmation hash must be lowercase SHA-256')
            elif key == 'confirm_no_existing_file':
                require(value is True, 'Explicit remote duplicate-check confirmation required')
        if props:
            require(arguments['confirm_project_id'] == m['project_id'], 'Project confirmation differs from fixed manifest')
        if name == 'project_info':
            result = {'project_id': m['project_id'], 'version': m['version'], 'tag': 'v' + m['version'],
                      'write_enabled': self.allow_write, 'status_scope': 'local-journal-only'}
            if self.metadata:
                raw, meta = bounded_json(self.metadata)
                result.update(metadata_sha256=hashlib.sha256(raw).hexdigest(), file_id=meta.get('fileID'))
            return result
        command_map = {'upload_dry_run': 'upload', 'update_file_dry_run': 'update-file', 'update_file': 'update-file'}
        command = command_map.get(name, name)
        argv = [sys.executable, str(self.publisher), command, '--manifest', str(self.manifest),
                '--journal', str(self.journal), '--project-id', str(m['project_id'])]
        if name != 'status':
            argv += ['--tag', 'v' + m['version']]
        if name.endswith('_dry_run'):
            argv += ['--dry-run']
        if name == 'upload':
            argv += ['--sha256', arguments['confirm_sha256'], '--confirm-no-existing-file']
        if command == 'update-file':
            raw, meta = bounded_json(self.metadata)
            require(positive(meta.get('fileID')) and meta['fileID'] == arguments['confirm_file_id'], 'File confirmation differs from configured metadata')
            require(hashlib.sha256(raw).hexdigest() == arguments['confirm_metadata_sha256'], 'Metadata hash confirmation mismatch')
            # Snapshot the exact confirmed bytes; the CLI never reopens mutable original metadata.
            with tempfile.TemporaryDirectory(prefix='cf-mcp-') as directory:
                snapshot = Path(directory) / 'metadata.json'
                snapshot.write_bytes(raw)
                argv += ['--metadata', str(snapshot), '--confirm-target', f"{m['project_id']}:{meta['fileID']}"]
                return self.run(argv)
        return self.run(argv)

    def run(self, argv):
        # No shell, no user-selected executable, no credential arguments, no child stderr forwarding.
        process = subprocess.Popen(argv, cwd=self.root, stdin=subprocess.DEVNULL,
                                   stdout=subprocess.PIPE, stderr=subprocess.DEVNULL,
                                   start_new_session=True)
        output = bytearray()
        deadline = time.monotonic() + self.timeout
        try:
            fd = process.stdout.fileno()
            with selectors.DefaultSelector() as selector:
                selector.register(fd, selectors.EVENT_READ)
                while selector.get_map():
                    remaining = deadline - time.monotonic()
                    require(remaining > 0, 'Publisher timed out; outcome may be ambiguous. Check local journal and author UI; never blindly retry')
                    for key, _ in selector.select(min(remaining, 0.2)):
                        block = os.read(key.fileobj, min(65536, MAX_OUTPUT + 1 - len(output)))
                        if not block:
                            selector.unregister(key.fileobj)
                        else:
                            output.extend(block)
                            require(len(output) <= MAX_OUTPUT, 'Publisher output limit exceeded; outcome may be ambiguous. Verify manually')
            remaining = deadline - time.monotonic()
            require(remaining > 0, 'Publisher timed out; verify outcome manually')
            code = process.wait(timeout=remaining)
            require(code == 0, 'Publisher refused or failed. Check policy, credentials, artifact and local journal; never blindly retry')
            result = decode(output)
            require(type(result) is dict, 'Publisher returned invalid JSON object; verify outcome manually')
            return result
        finally:
            # Also kill descendants that might retain stdout after the direct child exits.
            try:
                os.killpg(process.pid, signal.SIGKILL)
            except ProcessLookupError:
                pass
            process.wait()
            if process.stdout:
                process.stdout.close()


def scrub(value):
    raw = json.dumps(value, ensure_ascii=True, allow_nan=False)
    for key in ('CURSEFORGE_API_KEY', 'CF_API_KEY'):
        secret = os.environ.get(key)
        if secret:
            raw = raw.replace(json.dumps(secret, ensure_ascii=True)[1:-1], '[REDACTED]')
    return raw


def serve(adapter, source, destination):
    initialized = ready = False
    def send(value):
        destination.write(scrub(value) + '\n')
        destination.flush()
    while True:
        raw = source.readline(MAX_MESSAGE + 1)
        if not raw:
            return
        if len(raw) > MAX_MESSAGE:
            send({'jsonrpc': '2.0', 'id': None, 'error': {'code': -32600, 'message': 'Message limit exceeded; closing transport'}})
            return
        request_id = None
        try:
            message = decode(raw)
            require(type(message) is dict and message.get('jsonrpc') == '2.0' and type(message.get('method')) is str, 'Invalid JSON-RPC request')
            request_id = message.get('id')
            require('id' not in message or type(request_id) in (int, str), 'Invalid JSON-RPC ID')
            method = message['method']
            params = message.get('params', {})
            require(type(params) is dict, 'Parameters must be an object')
            if 'id' not in message:
                if method == 'notifications/initialized' and initialized:
                    ready = True
                continue  # Never respond to notifications, including unknown notifications.
            if method == 'initialize':
                require(not initialized and type(params.get('protocolVersion')) is str and type(params.get('capabilities')) is dict and type(params.get('clientInfo')) is dict, 'Invalid initialization')
                initialized = True
                result = {'protocolVersion': PROTOCOL, 'capabilities': {'tools': {'listChanged': False}},
                          'serverInfo': {'name': 'curseforge-local-cli', 'version': '1.0.0'},
                          'instructions': 'Local scoped CLI. Status is journal only. Accepted is not published. Mutations require separate human approval.'}
            elif method == 'ping':
                result = {}
            elif not ready:
                raise Refused('Complete initialize and notifications/initialized first')
            elif method == 'tools/list':
                require(not params, 'No pagination cursor supported; all tools fit in one page')
                result = {'tools': adapter.tools()}
            elif method == 'tools/call':
                require(set(params) <= {'name', 'arguments', '_meta'} and 'name' in params, 'Invalid tools/call parameters')
                try:
                    value = adapter.invoke(params['name'], params.get('arguments', {}))
                    result = {'content': [{'type': 'text', 'text': json.dumps(value, ensure_ascii=True)}], 'isError': False}
                except (Refused, OSError, ValueError, KeyError, TypeError, subprocess.SubprocessError):
                    # Only adapter-authored messages are safe to return, never raw parser/OS/CLI output.
                    error = sys.exception()
                    text = str(error) if isinstance(error, Refused) else 'Local publisher failure; verify configuration and journal; never blindly retry'
                    result = {'content': [{'type': 'text', 'text': text}], 'isError': True}
            else:
                send({'jsonrpc': '2.0', 'id': request_id, 'error': {'code': -32601, 'message': 'Method not found'}})
                continue
            send({'jsonrpc': '2.0', 'id': request_id, 'result': result})
        except (Refused, ValueError, UnicodeError, TypeError, RecursionError):
            send({'jsonrpc': '2.0', 'id': request_id, 'error': {'code': -32600, 'message': 'Invalid request or lifecycle state'}})


class SafeParser(argparse.ArgumentParser):
    def error(self, message):
        raise Refused('Invalid launch options; credentials belong only in environment')


def main():
    try:
        parser = SafeParser(description=__doc__)
        parser.add_argument('--root', type=Path, required=True)
        parser.add_argument('--manifest', type=Path, default=Path('curseforge-project.json'))
        parser.add_argument('--journal', type=Path, default=Path('/root/.hermes/state/curseforge/journal.json'))
        parser.add_argument('--update-metadata', type=Path)
        parser.add_argument('--allow-write', action='store_true')
        parser.add_argument('--timeout', type=float, default=120)
        args = parser.parse_args()
        require(0 < args.timeout <= 180 and args.timeout == args.timeout, 'Timeout must be within 0..180 seconds')
        adapter = Adapter(args)
        serve(adapter, sys.stdin.buffer, sys.stdout)
        return 0
    except (Refused, OSError, ValueError, KeyError, TypeError, RecursionError):
        # Do not forward child/network/OS diagnostics to the client; the adapter owns safe errors.
        print('MCP launch/configuration failed; use --help. Credentials only in environment.', file=sys.stderr)
        return 1


if __name__ == '__main__':
    sys.exit(main())
