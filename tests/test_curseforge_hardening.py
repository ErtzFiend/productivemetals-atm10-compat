"""Regression tests for the 2026-10-21 review blockers (offline, no network)."""
import json
import os
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

from test_curseforge_publish import PublisherTests, cf


class HardeningTests(PublisherTests):
    def test_artifact_symlink_outside_repo_rejected(self):
        outside = tempfile.TemporaryDirectory(prefix='cf-outside-')
        self.addCleanup(outside.cleanup)
        target = Path(outside.name) / self.jar.name
        target.write_bytes(self.jar.read_bytes())
        self.jar.unlink()
        self.jar.symlink_to(target)
        with self.assertRaises(cf.Error):
            self.run_cf('preflight')
        self.reject()

    def test_artifact_symlinked_directory_outside_repo_rejected(self):
        outside = tempfile.TemporaryDirectory(prefix='cf-outside-')
        self.addCleanup(outside.cleanup)
        libs = self.jar.parent
        moved = Path(outside.name) / 'libs'
        libs.rename(moved)
        libs.symlink_to(moved, target_is_directory=True)
        self.reject()

    def test_lock_survives_sibling_lockfile_replacement(self):
        with cf.locked(self.journal):
            for stray in self.journal.parent.glob('*.lock'):
                stray.unlink()
            (self.journal.parent / 'journal.json.lock').write_text('')
            with self.assertRaises(cf.Error):
                with cf.locked(self.journal):
                    pass
        self.assertEqual(self.fake.posts, [])

    def test_lock_shared_through_directory_alias(self):
        self.journal.parent.mkdir(parents=True)
        alias = self.root / 'alias-dir'
        alias.symlink_to(self.journal.parent, target_is_directory=True)
        with cf.locked(self.journal):
            with self.assertRaises(cf.Error):
                with cf.locked(alias / self.journal.name):
                    pass

    def test_symlinked_journal_file_refused_without_post(self):
        self.journal.parent.mkdir(parents=True)
        canonical = self.journal.parent / 'canonical.json'
        canonical.write_text(json.dumps({'schema': 1, 'operations': {}}))
        self.journal.symlink_to(canonical)
        with self.assertRaises(cf.Error):
            self.run_cf()
        self.assertEqual(self.fake.posts, [])

    def test_journal_directory_alias_cannot_split_history(self):
        self.assertEqual(self.run_cf()['state'], 'accepted')
        alias = self.root / 'alias-dir'
        alias.symlink_to(self.journal.parent, target_is_directory=True)
        args = cf.parser().parse_args(['upload', '--manifest', str(self.manifest), '--journal', str(alias / self.journal.name), '--tag', 'v1.9.0', '--confirm-no-existing-file'])
        self.assertEqual(cf.run(args, self.fake)['state'], 'already-accepted')
        self.assertEqual(len(self.fake.posts), 1)

    def test_update_release_type_downgrade_rejected(self):
        meta = self.root / 'update.json'
        meta.write_text(json.dumps({'fileID': 444, 'releaseType': 'alpha'}))
        self.reject('--metadata', str(meta), '--confirm-target', '1703803:444', command='update-file')

    def test_update_relations_strip_rejected(self):
        meta = self.root / 'update.json'
        for projects in ([], [{'slug': 'kubejs', 'type': 'requiredDependency'}], [{'slug': 'kubejs', 'type': 'optionalDependency'}, {'slug': 'productive-metalworks', 'type': 'requiredDependency'}]):
            meta.write_text(json.dumps({'fileID': 444, 'relations': {'projects': projects}}))
            self.reject('--metadata', str(meta), '--confirm-target', '1703803:444', command='update-file')

    def test_update_matching_policy_allowed(self):
        meta = self.root / 'update.json'
        relations = [{'slug': s, 'type': 'requiredDependency'} for s in self.m['dependencies'].values()]
        meta.write_text(json.dumps({'fileID': 444, 'releaseType': 'release', 'relations': {'projects': relations}}))
        self.assertEqual(self.run_cf('update-file', '--metadata', str(meta), '--confirm-target', '1703803:444')['state'], 'accepted')
        self.assertEqual(len(self.fake.posts), 1)

    def test_upload_metadata_rejects_file_id(self):
        with self.assertRaises(cf.Error):
            cf.metadata_schema({'fileID': 1, 'changelog': 'x', 'changelogType': 'text', 'displayName': 'x', 'gameVersions': [1], 'releaseType': 'release', 'relations': {'projects': []}})

    def test_default_journal_is_outside_repository(self):
        state = tempfile.TemporaryDirectory(prefix='cf-state-')
        self.addCleanup(state.cleanup)
        args = cf.parser().parse_args(['upload', '--manifest', str(self.manifest), '--tag', 'v1.9.0', '--confirm-no-existing-file'])
        with patch.dict(os.environ, {'XDG_STATE_HOME': state.name}):
            self.assertEqual(cf.run(args, self.fake)['state'], 'accepted')
        expected = Path(state.name) / 'curseforge' / '1703803.json'
        self.assertTrue(expected.is_file())
        self.assertFalse((self.root / '.curseforge').exists())


def load_tests(loader, tests, pattern):
    # Reuse PublisherTests fixtures but run only the regression tests defined here.
    names = sorted(n for n in HardeningTests.__dict__ if n.startswith('test_'))
    return unittest.TestSuite(HardeningTests(n) for n in names)


if __name__ == '__main__':
    unittest.main()
