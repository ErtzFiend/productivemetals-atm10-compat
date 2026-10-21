"""Offline contract/security tests: no credentials, network or Gradle required."""
import contextlib
import copy
import hashlib
import importlib.util
import io
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import MagicMock, patch
from email.message import Message
import urllib.error
import zipfile

SCRIPT = Path(__file__).resolve().parents[1] / 'scripts/curseforge_publish.py'
spec = importlib.util.spec_from_file_location('publisher', SCRIPT)
assert spec is not None and spec.loader is not None
cf = importlib.util.module_from_spec(spec)
spec.loader.exec_module(cf)
REPO = SCRIPT.parents[1]
ROWS = [{'id': i + 100, 'name': name, 'gameVersionTypeID': i + 1} for i, name in enumerate(['1.21.1', 'NeoForge', 'Java 21', 'Server'])]


class FakeAuthor:
    def __init__(self, result=None, failure=None):
        self.calls = []
        self.result = {'id': 444} if result is None else result
        self.failure = failure

    def request(self, method, path, body=None, content_type=None):
        self.calls.append((method, path, body, content_type))
        if method == 'GET':
            return copy.deepcopy(ROWS)
        if self.failure:
            raise self.failure
        return self.result

    @property
    def posts(self):
        return [x for x in self.calls if x[0] == 'POST']


class PublisherTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix='cf-test-')
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.m = json.loads((REPO / 'curseforge-project.json').read_text())
        self.ver = self.m['version']
        self.manifest = self.root / 'curseforge-project.json'
        self.manifest.write_text(json.dumps(self.m))
        (self.root / 'build.gradle').write_text(f"version = '{self.ver}'\n")
        self.descriptor = (REPO / self.m['descriptor']).read_bytes()
        descpath = self.root / self.m['descriptor']
        descpath.parent.mkdir(parents=True)
        descpath.write_bytes(self.descriptor)
        self.jar = self.root / self.m['artifact'].format(version=self.ver)
        self.jar.parent.mkdir(parents=True)
        self.make_jar()
        self.git('init', '-q')
        self.git('config', 'user.email', 'test@example.invalid')
        self.git('config', 'user.name', 'Offline Test')
        # Do not track build output or journal; mirrors real .gitignore.
        (self.root / '.gitignore').write_text('build/\n.curseforge/\n')
        self.git('add', '.')
        self.git('commit', '-qm', 'fixture')
        self.git('tag', 'v' + self.ver)
        self.journal = self.root / '.curseforge/journal.json'
        self.fake = FakeAuthor()

    def git(self, *args):
        return subprocess.run(['git', '-C', str(self.root), *args], check=True, capture_output=True).stdout

    def make_jar(self, descriptor=None):
        with zipfile.ZipFile(self.jar, 'w') as z:
            z.writestr('META-INF/neoforge.mods.toml', descriptor or self.descriptor.replace(b'${file.jarVersion}', self.ver.encode()))
            z.writestr('kubejs/server_scripts/example.js', '// fixture')

    def args(self, command='upload', *extra):
        return cf.parser().parse_args([command, '--manifest', str(self.manifest), '--journal', str(self.journal), '--tag', 'v' + self.ver, '--confirm-no-existing-file', *extra])

    def run_cf(self, command='upload', *extra):
        return cf.run(self.args(command, *extra), self.fake)

    def reject(self, *extra, command='upload'):
        with self.assertRaises(cf.Error):
            self.run_cf(command, *extra)
        self.assertEqual(self.fake.posts, [])
        self.assertFalse(self.journal.parent.exists())

    def test_cli_executable_preflight_status_and_failure_exit(self):
        env = {'PATH': os.defpath, 'HOME': str(self.root)}
        base = [sys.executable, str(SCRIPT)]
        common = ['--manifest', str(self.manifest), '--journal', str(self.journal)]
        p = subprocess.run(base + ['preflight', *common, '--tag', 'v' + self.ver], env=env, capture_output=True, text=True)
        self.assertEqual(p.returncode, 0, p.stderr)
        self.assertEqual(json.loads(p.stdout)['state'], 'preflight-ok')
        p = subprocess.run(base + ['status', *common], env=env, capture_output=True, text=True)
        self.assertEqual(p.returncode, 0, p.stderr)
        self.assertEqual(json.loads(p.stdout)['verification'], 'verification-required')
        p = subprocess.run(base + ['preflight', *common, '--tag', 'v9.9.9'], env=env, capture_output=True, text=True)
        self.assertEqual(p.returncode, 1)
        self.assertEqual(p.stdout, '')
        self.assertFalse(self.journal.parent.exists())

    def test_preflight_offline(self):
        r = self.run_cf('preflight')
        self.assertEqual(r['version'], self.ver)
        self.assertEqual(r['sha256'], hashlib.sha256(self.jar.read_bytes()).hexdigest())
        self.assertEqual(self.fake.calls, [])
        self.assertFalse(self.journal.parent.exists())

    def test_plan_and_dry_run_read_only(self):
        for cmd in ('plan', 'upload'):
            result = self.run_cf(cmd, '--dry-run')
            self.assertEqual(result['metadata']['gameVersions'], [100, 101, 102, 103])
            self.assertEqual(result['metadata']['relations']['projects'][0]['type'], 'requiredDependency')
        self.assertEqual(self.fake.posts, [])
        self.assertFalse(self.journal.parent.exists())

    def test_upload_multipart_and_repeat_idempotency(self):
        self.assertEqual(self.run_cf()['id'], 444)
        call = self.fake.posts[0]
        self.assertEqual(call[1], '/api/projects/1703803/upload-file')
        self.assertIn(b'name="metadata"', call[2])
        self.assertIn(b'name="file"', call[2])
        self.assertIn(b'"gameVersions":[100,101,102,103]', call[2])
        self.assertIn(b'"relations":{"projects":', call[2])
        self.assertEqual(self.run_cf()['state'], 'already-accepted')
        self.assertEqual(len(self.fake.posts), 1)
        self.assertEqual(cf.read_journal(self.journal)['operations'][f'1703803:{self.ver}:upload']['state'], 'accepted')

    def test_wrong_project_no_write(self):
        self.reject('--project-id', '123')

    def test_wrong_tag_no_write(self):
        self.reject('--tag', 'v1.8.0')

    def test_hash_no_write(self):
        self.reject('--sha256', '0' * 64)

    def test_artifact_version_no_write(self):
        self.make_jar(self.descriptor.replace(b'${file.jarVersion}', b'1.8.0'))
        self.reject()

    def test_wrong_mod_no_write(self):
        self.make_jar(self.descriptor.replace(b'${file.jarVersion}', self.ver.encode()).replace(b'modId="productivemetalsatm10compat"', b'modId="wrongmod"'))
        self.reject()

    def test_dependency_mismatch_no_write(self):
        self.make_jar(self.descriptor.replace(b'${file.jarVersion}', self.ver.encode()).replace(b'modId="kubejs"', b'modId="wrongdep"'))
        self.reject()

    def test_wrong_minecraft_version_no_write(self):
        self.make_jar(self.descriptor.replace(b'${file.jarVersion}', self.ver.encode()).replace(b'[1.21.1]', b'[1.20.1]'))
        self.reject()

    def test_bad_zip_no_write(self):
        self.jar.write_bytes(b'not a jar')
        self.reject()

    def test_dirty_source_no_write(self):
        (self.root / 'build.gradle').write_text("version = '9.0.0'\n")
        self.reject()

    def test_clean_but_wrong_source_version_no_write(self):
        (self.root / 'build.gradle').write_text("version = '9.0.0'\n")
        self.git('add', 'build.gradle')
        self.git('commit', '-qm', 'wrong source')
        self.git('tag', '-f', 'v' + self.ver)
        self.reject()

    def test_tag_points_elsewhere_no_write(self):
        (self.root / 'another').write_text('new commit')
        self.git('add', 'another')
        self.git('commit', '-qm', 'ahead of tag')
        self.reject()

    def test_unknown_or_ambiguous_versions_no_write(self):
        for rows in (ROWS[:-1], ROWS + [ROWS[0]], [{'id': '100', 'name': '1.21.1', 'gameVersionTypeID': 1}]):
            with patch.object(self.fake, 'request', return_value=rows):
                self.reject()

    def test_version_id_and_type_selectors(self):
        rows = ROWS + [dict(ROWS[0], id=900, gameVersionTypeID=90)]
        self.assertEqual(cf.resolve([{'name': '1.21.1', 'id': 100, 'type_id': 1}], rows), [100])
        with self.assertRaises(cf.Error):
            cf.resolve([{'name': '1.21.1', 'id': 100, 'type_id': 90}], rows)

    def test_200_without_numeric_id_is_ambiguous_and_guarded(self):
        for result in ({}, {'id': '444'}, {'id': True}, {'id': 0}, {'id': -1}):
            with self.subTest(result=result):
                # Each response test gets an independent journal.
                self.journal = self.root / ('j-' + str(len(list(self.root.glob('j-*'))))) / 'journal.json'
                self.fake = FakeAuthor(result=result)
                with self.assertRaises(cf.Error):
                    self.run_cf()
                self.assertEqual(cf.read_journal(self.journal)['operations'][f'1703803:{self.ver}:upload']['state'], 'ambiguous')
                with self.assertRaises(cf.Error):
                    self.run_cf()
                self.assertEqual(len(self.fake.posts), 1)

    def test_timeout_ambiguous_no_retry(self):
        self.fake.failure = TimeoutError('private upstream error')
        with self.assertRaises(cf.Error):
            self.run_cf()
        self.fake.failure = None
        with self.assertRaises(cf.Error):
            self.run_cf()
        self.assertEqual(len(self.fake.posts), 1)

    def test_pending_durable_before_post(self):
        old = self.fake.request
        def request(method, *args):
            if method == 'POST':
                self.assertEqual(cf.read_journal(self.journal)['operations'][f'1703803:{self.ver}:upload']['state'], 'pending')
            return old(method, *args)
        with patch.object(self.fake, 'request', side_effect=request):
            self.run_cf()

    def test_different_artifact_cannot_bypass_guard(self):
        self.run_cf()
        with zipfile.ZipFile(self.jar, 'a') as z:
            z.writestr('other.txt', 'changed')
        with self.assertRaises(cf.Error):
            self.run_cf()
        self.assertEqual(len(self.fake.posts), 1)

    def test_nonblocking_lock(self):
        with cf.locked(self.journal):
            with self.assertRaises(cf.Error):
                self.run_cf()
        self.assertEqual(self.fake.posts, [])

    def test_update_metadata_only_and_result_id(self):
        meta = self.root / 'update.json'
        meta.write_text(json.dumps({'fileID': 444, 'displayName': 'Correct title'}))
        result = self.run_cf('update-file', '--metadata', str(meta), '--confirm-target', '1703803:444')
        self.assertEqual(result['id'], 444)
        self.assertEqual(self.fake.posts[0][1], '/api/projects/1703803/update-file')
        self.assertIn(b'"fileID":444', self.fake.posts[0][2])
        self.assertNotIn(b'name="file"', self.fake.posts[0][2])
        self.assertEqual(self.run_cf('update-file', '--metadata', str(meta), '--confirm-target', '1703803:444')['state'], 'already-accepted')
        self.assertEqual(len(self.fake.posts), 1)

    def test_update_wrong_id_blocks_other_changes(self):
        meta = self.root / 'update.json'
        meta.write_text(json.dumps({'fileID': 555, 'displayName': 'Correct title'}))
        with self.assertRaises(cf.Error):
            self.run_cf('update-file', '--metadata', str(meta), '--confirm-target', '1703803:555')
        meta.write_text(json.dumps({'fileID': 555, 'displayName': 'Different title'}))
        with self.assertRaises(cf.Error):
            self.run_cf('update-file', '--metadata', str(meta), '--confirm-target', '1703803:555')
        self.assertEqual(len(self.fake.posts), 1)

    def test_update_strict_schema_and_target_no_write(self):
        meta = self.root / 'update.json'
        for payload in ({'fileID': 444}, {'fileID': '444', 'displayName': 'x'}, {'fileID': 444, 'file': 'no'}, {'fileID': 444, 'gameVersions': ['1.21.1']}, {'fileID': 444, 'relations': []}, {'fileID': 444, 'relations': {'projects': [{'slug': 'kubejs', 'type': 3}]}}, {'fileID': 444, 'displayName': 'x', 'unknown': True}):
            meta.write_text(json.dumps(payload))
            self.reject('--metadata', str(meta), '--confirm-target', '1703803:444', command='update-file')
        meta.write_text(json.dumps({'fileID': 444, 'displayName': 'x'}))
        self.reject('--metadata', str(meta), '--confirm-target', '999:444', command='update-file')

    def test_update_wrong_version_ids_no_write(self):
        meta = self.root / 'update.json'
        meta.write_text(json.dumps({'fileID': 444, 'gameVersions': [999]}))
        self.reject('--metadata', str(meta), '--confirm-target', '1703803:444', command='update-file')

    def test_status_read_only_not_remote_truth(self):
        result = self.run_cf('status')
        self.assertEqual(result['verification'], 'verification-required')
        self.assertEqual(self.fake.calls, [])
        self.assertFalse(self.journal.parent.exists())

    def test_upload_requires_duplicate_check_assertion(self):
        args = self.args()
        args.confirm_no_existing_file = False
        with self.assertRaises(cf.Error):
            cf.run(args, self.fake)
        self.assertFalse(self.journal.parent.exists())
        self.assertEqual(self.fake.posts, [])

    def test_manifest_host_and_strict_fields(self):
        for field, value in [('author_url', 'https://evil.invalid'), ('project_id', '1703803'), ('unknown', 1), ('version_file', '../outside')]:
            modified = dict(self.m, **{field: value})
            self.manifest.write_text(json.dumps(modified))
            self.reject()

    def test_dry_run_does_not_change_existing_journal(self):
        self.run_cf()
        before = self.journal.read_bytes()
        self.run_cf('upload', '--dry-run')
        self.assertEqual(self.journal.read_bytes(), before)
        self.assertEqual(len(self.fake.posts), 1)

    def test_pending_crash_state_blocks_new_post(self):
        self.run_cf()
        j = cf.read_journal(self.journal)
        entry = j['operations'][f'1703803:{self.ver}:upload']
        entry['state'] = 'pending'
        entry.pop('id')
        cf.save_journal(self.journal, j)
        with self.assertRaises(cf.Error):
            self.run_cf()
        self.assertEqual(len(self.fake.posts), 1)

    def test_journal_policy_corruption_blocks_acceptance(self):
        self.run_cf()
        j = cf.read_journal(self.journal)
        j['operations'][f'1703803:{self.ver}:upload']['project_id'] = 999
        cf.save_journal(self.journal, j)
        with self.assertRaises(cf.Error):
            self.run_cf()
        self.assertEqual(len(self.fake.posts), 1)

    def test_journal_write_failure_sends_no_post(self):
        with patch.object(cf, 'save_journal', side_effect=OSError('disk unavailable')):
            with self.assertRaises(OSError):
                self.run_cf()
        self.assertEqual(self.fake.posts, [])

    def test_update_dry_run_does_not_write(self):
        meta = self.root / 'update.json'
        meta.write_text(json.dumps({'fileID': 444, 'displayName': 'reviewed'}))
        self.run_cf('update-file', '--metadata', str(meta), '--confirm-target', '1703803:444', '--dry-run')
        self.assertEqual(self.fake.posts, [])
        self.assertFalse(self.journal.parent.exists())

    def test_duplicate_json_rejected(self):
        self.manifest.write_text('{"schema":1,"schema":1}')
        self.reject()


class TransportTests(unittest.TestCase):
    def setUp(self):
        env = patch.dict(os.environ, {'CURSEFORGE_API_KEY': 'fake-test-token', 'CF_API_KEY': ''})
        env.start()
        self.addCleanup(env.stop)

    def test_header_only_timeout_no_proxy_and_allowed_path(self):
        author = cf.Author()
        response = MagicMock()
        response.__enter__.return_value = response
        response.status = 200
        response.read.return_value = b'[]'
        with patch.object(author.opener, 'open', return_value=response) as opened:
            self.assertEqual(author.request('GET', '/api/game/versions'), [])
            req = opened.call_args.args[0]
            self.assertEqual(req.full_url, cf.HOST + '/api/game/versions')
            self.assertEqual(req.get_header('X-api-token'), 'fake-test-token')
            self.assertIsNone(req.get_header('X-api-key'))
            self.assertEqual(opened.call_args.kwargs['timeout'], 45)
            for method, path in [('DELETE', '/api/projects/1/upload-file'), ('GET', '//evil.invalid'), ('POST', '/api/game/versions'), ('GET', '/api/projects/1/files')]:
                with self.assertRaises(cf.Error):
                    author.request(method, path)
            self.assertEqual(opened.call_count, 1)
        self.assertIsNone(cf.NoRedirect().redirect_request(None, None, 302, '', {}, 'https://evil.invalid'))

    def test_upstream_secret_reflection_never_exposed(self):
        author = cf.Author()
        for exc in [TimeoutError('fake-test-token'), urllib.error.HTTPError(cf.HOST, 403, 'fake-test-token', Message(), io.BytesIO(b'fake-test-token'))]:
            with patch.object(author.opener, 'open', side_effect=exc):
                with self.assertRaises(cf.Error) as caught:
                    author.request('GET', '/api/game/versions')
                self.assertNotIn('fake-test-token', str(caught.exception))
        stderr = io.StringIO()
        stdout = io.StringIO()
        with patch.dict(os.environ, {'CURSEFORGE_API_KEY': 'fake-test-token'}), patch.object(cf, 'run', return_value={'reflected': 'fake-test-token'}), contextlib.redirect_stdout(stdout):
            self.assertEqual(cf.main(['status']), 0)
        self.assertNotIn('fake-test-token', stdout.getvalue())
        with patch.object(cf, 'run', side_effect=cf.Error('fake-test-token')), contextlib.redirect_stderr(stderr):
            self.assertEqual(cf.main(['status']), 1)
        self.assertNotIn('fake-test-token', stderr.getvalue())

    def test_missing_conflicting_tokens_never_open(self):
        author = cf.Author()
        with patch.dict(os.environ, {}, clear=True), patch.object(author.opener, 'open') as opened:
            with self.assertRaises(cf.Error):
                author.request('GET', '/api/game/versions')
            opened.assert_not_called()
        with patch.dict(os.environ, {'CURSEFORGE_API_KEY': 'one', 'CF_API_KEY': 'two'}, clear=True), patch.object(author.opener, 'open') as opened:
            with self.assertRaises(cf.Error):
                author.request('GET', '/api/game/versions')
            opened.assert_not_called()

    def test_escaped_secret_and_unknown_cli_arguments_are_sanitized(self):
        token = 'synthetic-"quoted\\token'
        stdout = io.StringIO()
        with patch.dict(os.environ, {'CURSEFORGE_API_KEY': token}), patch.object(cf, 'run', return_value={'nested': [token]}), contextlib.redirect_stdout(stdout):
            self.assertEqual(cf.main(['status']), 0)
        self.assertEqual(json.loads(stdout.getvalue()), {'nested': ['[REDACTED]']})
        stderr = io.StringIO()
        with contextlib.redirect_stderr(stderr):
            self.assertEqual(cf.main(['status', '--api-key', 'fake-test-token']), 1)
        self.assertNotIn('fake-test-token', stderr.getvalue())

    def test_redirect_http_error_sanitized_no_retry(self):
        author = cf.Author()
        exc = urllib.error.HTTPError(cf.HOST, 302, 'redirect', Message(), None)
        with patch.object(author.opener, 'open', side_effect=exc) as opened:
            with self.assertRaises(cf.Error):
                author.request('GET', '/api/game/versions')
            self.assertEqual(opened.call_count, 1)


if __name__ == '__main__':
    unittest.main()
