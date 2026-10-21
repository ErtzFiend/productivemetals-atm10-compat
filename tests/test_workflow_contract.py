"""Stdlib-only guardrails for the shared publisher's workflow contract."""
from pathlib import Path
import re
import unittest

ROOT = Path(__file__).resolve().parents[1]


class WorkflowContractTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.workflow = (ROOT / '.github/workflows/curseforge.yml').read_text()

    def test_actions_pinned_to_recorded_official_commits(self):
        pins = {
            'actions/checkout': '11d5960a326750d5838078e36cf38b85af677262',
            'actions/setup-python': 'a26af69be951a213d495a4c3e4e4022e16d87065',
            'actions/setup-java': 'cf277c60eb25467037889841efdb72551f06f6c3',
            'actions/upload-artifact': 'ea165f8d65b6e75b540449e92b4886f43607fa02',
            'actions/cache/restore': '0057852bfaa89a56745cba8c7296529d2fc39830',
            'actions/cache/save': '0057852bfaa89a56745cba8c7296529d2fc39830',
            'gradle/actions/setup-gradle': 'ed408507eac070d1f99cc633dbcf757c94c7933a',
        }
        uses = re.findall(r'uses:\s+([^\s@]+)@([^\s]+)', self.workflow)
        self.assertTrue(uses)
        for repo, sha in uses:
            self.assertIn(repo, pins)
            self.assertEqual(sha, pins[repo])

    def test_shared_cli_and_real_tests_not_shell_uploader(self):
        for command in ('preflight', 'plan', 'upload'):
            self.assertIn('python scripts/curseforge_publish.py ' + command, self.workflow)
        self.assertIn('python -m unittest discover -s tests -v', self.workflow)
        self.assertIn('gradle --no-daemon build', self.workflow)
        self.assertNotIn('-x test', self.workflow)
        self.assertNotIn('curl ', self.workflow)
        self.assertNotIn('x-api-key', self.workflow.lower())

    def test_protection_and_persistence_gates(self):
        for requirement in ('cancel-in-progress: false', 'environment: curseforge-publish', 'github.ref_protected', 'test "$REF_TYPE" = tag', 'test "$REF_PROTECTED" = true', "github.event_name == 'workflow_dispatch' && inputs.publish", 'inputs.initialize_journal', '--confirm-no-existing-file', '.curseforge/journal.json', 'include-hidden-files: true', 'persist-credentials: false'):
            self.assertIn(requirement, self.workflow)
        self.assertLess(self.workflow.index('Require a protected version tag'), self.workflow.index('Publish once through the shared CLI'))
        self.assertIn('needs: publisher-tests', self.workflow)


if __name__ == '__main__':
    unittest.main()
