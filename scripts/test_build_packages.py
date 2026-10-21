import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
import zipfile

SPEC = importlib.util.spec_from_file_location('build_packages', Path(__file__).with_name('build-packages.py'))
mod = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(mod)

class PackageTests(unittest.TestCase):
    def test_openai_existing_identity_and_no_hooks(self):
        version, files = mod.collect(mod.ROOT, 'openai')
        manifest = json.loads(files['plugin.json'])
        self.assertEqual(manifest['name'], 'app-6a90dc5bbc3c819199b4f1e44028fcbf')
        self.assertEqual(manifest['version'], version)
        self.assertEqual(manifest['extensions']['com.openai']['interface']['developerName'], 'JOEL SAMUEL HORWITZ')
        self.assertFalse(any(name.startswith(('scripts/', '.claude-plugin/', '.git/', 'hooks/')) for name in files))
        self.assertNotIn('.env', files)
        self.assertEqual(files['assets/logo.png'], (mod.ROOT / 'assets/logo.png').read_bytes())
        self.assertEqual(len([n for n in files if n.endswith('/SKILL.md')]), 56)

    def test_claude_identity_and_executable_present(self):
        _, files = mod.collect(mod.ROOT, 'claude')
        self.assertEqual(json.loads(files['.claude-plugin/plugin.json'])['name'], 'synter')
        self.assertIn('scripts/session-context.sh', files)
        self.assertNotIn('plugin.json', files)
        self.assertNotIn('mcp.json', files)

    def test_archive_readback_rejects_missing_or_corrupted_content(self):
        for files in ({'plugin.json': b'changed'}, {}):
            with tempfile.TemporaryDirectory() as tmp:
                path = Path(tmp) / 'test.zip'
                with zipfile.ZipFile(path, 'w') as archive:
                    for name, content in files.items():
                        archive.writestr(name, content)
                with self.assertRaises(ValueError):
                    mod.verify_archive(path, {'plugin.json': b'expected'}, 'claude')

if __name__ == '__main__':
    unittest.main()
