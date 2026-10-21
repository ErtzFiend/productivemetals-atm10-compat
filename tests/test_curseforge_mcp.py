import json
import os
import subprocess
import sys
import unittest
from pathlib import Path
import tempfile
import shutil


SCRIPT = Path('scripts/curseforge_mcp.py').resolve()


class MCPAdapterTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix='mcp-test-')
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        # Journal must be outside the repository
        self.journal = Path(self.temp.name + '_journal') / 'journal.json'
        self.journal.parent.mkdir(exist_ok=True)
        
        # Use the actual repo manifest as template
        repo_manifest = Path('curseforge-project.json')
        self.manifest_data = json.loads(repo_manifest.read_text())
        # Simplify game_versions to just strings for testing
        self.manifest_data['game_versions'] = ['1.21.1', 'NeoForge', 'Java 21', 'Server']
        self.manifest_path = self.root / 'curseforge-project.json'
        self.manifest_path.write_text(json.dumps(self.manifest_data))
        
        # Create required directories and dummy files
        (self.root / 'build').mkdir(exist_ok=True)
        (self.root / 'build' / 'libs').mkdir(exist_ok=True)
        (self.root / 'src' / 'main' / 'resources' / 'META-INF').mkdir(parents=True, exist_ok=True)
        
        # Create dummy artifact
        (self.root / 'build' / 'libs' / 'productivemetals-atm10-compat-1.10.0.jar').write_text('dummy')
        (self.root / 'src' / 'main' / 'resources' / 'META-INF' / 'neoforge.mods.toml').write_text('dummy')
        (self.root / 'build.gradle').write_text("version = '1.10.0'\n")
        
        # Dummy publisher script
        self.publisher = self.root / 'scripts/curseforge_publish.py'
        self.publisher.parent.mkdir(exist_ok=True)
        self.publisher.write_text(
            '#!/usr/bin/env python3\n'
            'import sys, json\n'
            'print(json.dumps({"state": "mock-success", "args": sys.argv[1:]}))\n'
        )
        os.chmod(self.publisher, 0o755)
    
    def run_mcp(self, args):
        cmd = [sys.executable, str(SCRIPT), '--root', str(self.root), '--manifest', 'curseforge-project.json', '--journal', str(self.journal)] + args
        return subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    
    def test_lifecycle_and_tools_list(self):
        proc = self.run_mcp([])
        try:
            init = {"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {"protocolVersion": "2025-11-25", "capabilities": {}, "clientInfo": {"name": "test", "version": "1"}}}
            proc.stdin.write(json.dumps(init) + '\n')
            proc.stdin.flush()
            
            out = json.loads(proc.stdout.readline())
            self.assertEqual(out['id'], 1)
            self.assertIn('result', out)
            
            proc.stdin.write('{"jsonrpc": "2.0", "method": "notifications/initialized"}\n')
            proc.stdin.flush()
            
            proc.stdin.write('{"jsonrpc": "2.0", "id": 2, "method": "tools/list"}\n')
            proc.stdin.flush()
            
            out = json.loads(proc.stdout.readline())
            self.assertEqual(out['id'], 2)
            self.assertTrue(len(out['result']['tools']) > 0)
        finally:
            proc.terminate()
            proc.wait()
    
    def test_tool_call_without_allow_write_refuses_mutation(self):
        proc = self.run_mcp([])
        try:
            init = {"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {"protocolVersion": "2025-11-25", "capabilities": {}, "clientInfo": {"name": "test", "version": "1"}}}
            proc.stdin.write(json.dumps(init) + '\n')
            proc.stdin.flush()
            proc.stdout.readline()
            
            proc.stdin.write('{"jsonrpc": "2.0", "method": "notifications/initialized"}\n')
            proc.stdin.flush()
            
            # Attempt upload without allow-write
            call = {
                "jsonrpc": "2.0",
                "id": 3,
                "method": "tools/call",
                "params": {
                    "name": "upload",
                    "arguments": {
                        "confirm_project_id": 1703803,
                        "confirm_sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                        "confirm_no_existing_file": True
                    }
                }
            }
            proc.stdin.write(json.dumps(call) + '\n')
            proc.stdin.flush()
            
            out = json.loads(proc.stdout.readline())
            self.assertEqual(out['id'], 3)
            self.assertTrue(out['result']['isError'])
        finally:
            proc.terminate()
            proc.wait()
    
    def test_project_info_tool(self):
        proc = self.run_mcp([])
        try:
            init = {"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {"protocolVersion": "2025-11-25", "capabilities": {}, "clientInfo": {"name": "test", "version": "1"}}}
            proc.stdin.write(json.dumps(init) + '\n')
            proc.stdin.flush()
            proc.stdout.readline()
            
            proc.stdin.write('{"jsonrpc": "2.0", "method": "notifications/initialized"}\n')
            proc.stdin.flush()
            
            # Call project_info
            call = {
                "jsonrpc": "2.0",
                "id": 4,
                "method": "tools/call",
                "params": {
                    "name": "project_info",
                    "arguments": {}
                }
            }
            proc.stdin.write(json.dumps(call) + '\n')
            proc.stdin.flush()
            
            out = json.loads(proc.stdout.readline())
            self.assertEqual(out['id'], 4)
            self.assertFalse(out['result']['isError'])
            result = json.loads(out['result']['content'][0]['text'])
            self.assertEqual(result['project_id'], 1703803)
            self.assertEqual(result['version'], '1.10.0')
            self.assertEqual(result['write_enabled'], False)
        finally:
            proc.terminate()
            proc.wait()
    
    def test_with_allow_write_flag(self):
        proc = self.run_mcp(['--allow-write'])
        try:
            init = {"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {"protocolVersion": "2025-11-25", "capabilities": {}, "clientInfo": {"name": "test", "version": "1"}}}
            proc.stdin.write(json.dumps(init) + '\n')
            proc.stdin.flush()
            proc.stdout.readline()
            
            proc.stdin.write('{"jsonrpc": "2.0", "method": "notifications/initialized"}\n')
            proc.stdin.flush()
            
            # Call project_info with allow-write
            call = {
                "jsonrpc": "2.0",
                "id": 4,
                "method": "tools/call",
                "params": {
                    "name": "project_info",
                    "arguments": {}
                }
            }
            proc.stdin.write(json.dumps(call) + '\n')
            proc.stdin.flush()
            
            out = json.loads(proc.stdout.readline())
            self.assertEqual(out['id'], 4)
            self.assertFalse(out['result']['isError'])
            result = json.loads(out['result']['content'][0]['text'])
            self.assertEqual(result['write_enabled'], True)
        finally:
            proc.terminate()
            proc.wait()
    
    def test_preflight_tool(self):
        proc = self.run_mcp([])
        try:
            init = {"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {"protocolVersion": "2025-11-25", "capabilities": {}, "clientInfo": {"name": "test", "version": "1"}}}
            proc.stdin.write(json.dumps(init) + '\n')
            proc.stdin.flush()
            proc.stdout.readline()
            
            proc.stdin.write('{"jsonrpc": "2.0", "method": "notifications/initialized"}\n')
            proc.stdin.flush()
            
            # Call preflight
            call = {
                "jsonrpc": "2.0",
                "id": 5,
                "method": "tools/call",
                "params": {
                    "name": "preflight",
                    "arguments": {}
                }
            }
            proc.stdin.write(json.dumps(call) + '\n')
            proc.stdin.flush()
            
            out = json.loads(proc.stdout.readline())
            self.assertEqual(out['id'], 5)
            self.assertFalse(out['result']['isError'])
            result = json.loads(out['result']['content'][0]['text'])
            self.assertEqual(result['state'], 'mock-success')
        finally:
            proc.terminate()
            proc.wait()
    
    def test_invalid_tool_refused(self):
        proc = self.run_mcp([])
        try:
            init = {"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {"protocolVersion": "2025-11-25", "capabilities": {}, "clientInfo": {"name": "test", "version": "1"}}}
            proc.stdin.write(json.dumps(init) + '\n')
            proc.stdin.flush()
            proc.stdout.readline()
            
            proc.stdin.write('{"jsonrpc": "2.0", "method": "notifications/initialized"}\n')
            proc.stdin.flush()
            
            # Call non-existent tool
            call = {
                "jsonrpc": "2.0",
                "id": 6,
                "method": "tools/call",
                "params": {
                    "name": "nonexistent_tool",
                    "arguments": {}
                }
            }
            proc.stdin.write(json.dumps(call) + '\n')
            proc.stdin.flush()
            
            out = json.loads(proc.stdout.readline())
            self.assertEqual(out['id'], 6)
            self.assertTrue(out['result']['isError'])
        finally:
            proc.terminate()
            proc.wait()
    
if __name__ == '__main__':
    unittest.main()