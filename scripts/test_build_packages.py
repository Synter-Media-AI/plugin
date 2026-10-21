import importlib.util
import copy
import json
from pathlib import Path
import tempfile
import unittest
import zipfile
import hashlib
import shutil
import posixpath
import re

SPEC = importlib.util.spec_from_file_location('build_packages', Path(__file__).with_name('build-packages.py'))
mod = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(mod)

class PackageTests(unittest.TestCase):
    def test_directory_source_is_reproducible_and_has_only_static_runtime(self):
        files = mod.sync_claude_directory()
        self.assertEqual(files, mod.collect(mod.ROOT, 'claude-directory')[1])
        self.assertEqual(sum(name.endswith('/SKILL.md') for name in files), 56)
        self.assertEqual(sum(name.startswith('agents/') for name in files), 6)
        self.assertNotIn('hooks', json.loads(files['.claude-plugin/plugin.json']))
        self.assertEqual(files['assets/logo.png'], (mod.ROOT / 'assets/logo.png').read_bytes())
        self.assertNotIn(b'SessionStart shell hook', files['skills/help/SKILL.md'])
        for name in files:
            self.assertFalse((mod.ROOT / 'packages/claude-directory' / name).stat().st_mode & 0o111)
        self.assertIn('hooks', json.loads(mod.collect(mod.ROOT, 'claude')[1]['.claude-plugin/plugin.json']))

    def test_directory_rejects_local_execution_and_unknown_files(self):
        _, files = mod.collect(mod.ROOT, 'claude-directory')
        for name, value in [('scripts/run.sh', b'echo test'), ('.env', b'fake'),
                            ('skills/help/.hidden.md', b'hidden'),
                            ('skills/help/SKILL.md', b'!`echo test`'),
                            ('skills/help/SKILL.md', b'Run `curl https://example.com`'),
                            ('skills/help/SKILL.md', b'---\nallowed-tools: Bash\n---')]:
            with self.subTest(name=name, value=value), self.assertRaises(ValueError):
                mod.validate_claude_directory({**files, name: value})
        changed = dict(files)
        manifest = json.loads(files['.claude-plugin/plugin.json'])
        manifest['hooks'] = {}
        changed['.claude-plugin/plugin.json'] = mod.encoded(manifest)
        with self.assertRaises(ValueError):
            mod.validate_claude_directory(changed)
        for server in [{'command': 'node'}, {'type': 'http', 'url': 'https://other.example', 'description': 'test'},
                       {'type': 'http', 'url': 'https://mcp.synterai.com', 'description': 'test', 'headers': {'x-key': 'fake'}}]:
            with self.subTest(server=server), self.assertRaises(ValueError):
                mod.validate_claude_directory({**files, '.mcp.json': mod.encoded({'mcpServers': {'synter': server}})})

    def test_directory_relative_documentation_references_resolve_inside_folder(self):
        _, files = mod.collect(mod.ROOT, 'claude-directory')
        for name, content in files.items():
            if not name.endswith('.md'):
                continue
            text = content.decode()
            refs = re.findall(r'\]\(([^)#]+)(?:#[^)]*)?\)', text)
            refs += re.findall(r'`(\.\./[^`]+)`', text)
            for reference in refs:
                if reference.startswith(('https://', 'http://')):
                    continue
                target = posixpath.normpath(posixpath.join(posixpath.dirname(name), reference))
                self.assertIn(target, files, (name, reference))
            for reference in re.findall(r'\$\{CLAUDE_PLUGIN_ROOT\}/([^`]+)', text):
                self.assertIn(reference, files, (name, reference))

    def test_directory_generated_source_detects_drift_and_symlinks(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            for name in ['.claude-plugin', 'config', 'context', 'assets', 'tools', 'skills', 'agents', 'output-styles']:
                shutil.copytree(mod.ROOT / name, root / name)
            for name in ['LICENSE', '.mcp.json']:
                shutil.copyfile(mod.ROOT / name, root / name)
            mod.sync_claude_directory(root, check=False)
            mod.sync_claude_directory(root)
            readme = root / 'packages/claude-directory/README.md'
            readme.write_text('Changed')
            with self.assertRaises(ValueError):
                mod.sync_claude_directory(root)
            mod.sync_claude_directory(root, check=False)
            readme.unlink()
            readme.symlink_to(root / 'LICENSE')
            with self.assertRaises(ValueError):
                mod.sync_claude_directory(root)

    def test_existing_archives_remain_byte_identical(self):
        expected = {
            'claude': '2f0130c80845166173ee8d5b900711499470c11805aa26fecc5aa70772d1aad5',
            'openai': '08f82f52e85216ce6e343ec4f1354073113cc2d451fa799f8ec39f3a50ec2eca',
            'openai-new-draft': '40c2836cddc2c2d003bb0029e82da408d6db74bda342d901b9b792f713374b1a',
        }
        # Baseline943fd07: independent bytes, rather than self-comparing a new build.
        for target, digest in expected.items():
            _, files = mod.collect(mod.ROOT, target)
            with tempfile.TemporaryDirectory() as tmp:
                path = Path(tmp) / 'test.zip'
                with zipfile.ZipFile(path, 'w', compression=zipfile.ZIP_DEFLATED) as archive:
                    for name, content in sorted(files.items()):
                        info = zipfile.ZipInfo(name, date_time=(2026, 1, 1, 0, 0, 0))
                        info.compress_type = zipfile.ZIP_DEFLATED
                        info.external_attr = ((0o100000 | (0o755 if name.endswith('.sh') else 0o644)) << 16)
                        archive.writestr(info, content)
                self.assertEqual(hashlib.sha256(path.read_bytes()).hexdigest(), digest)

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

    def test_openai_auth_and_optional_new_draft(self):
        _, files = mod.collect(mod.ROOT, 'openai-new-draft')
        manifest = json.loads(files['plugin.json'])
        self.assertEqual(manifest['name'], 'synter')
        self.assertEqual(manifest['extensions']['com.openai']['interface']['developerName'], 'JOEL SAMUEL HORWITZ')
        mcp = json.loads(files['mcp.json'])
        self.assertEqual(mcp['mcpServers']['synter']['extensions']['com.openai']['auth'], {'type': 'oauth', 'client': {'mode': 'dcr'}})
        mod.validate_openai_mcp(mcp)
        for key, value in [('clientSecret', 'not-a-real-secret'), ('type', 'none'), ('client', {'mode': 'provided', 'clientId': 'wrong'})]:
            changed = copy.deepcopy(mcp)
            changed['mcpServers']['synter']['extensions']['com.openai']['auth'][key] = value
            with self.assertRaises(ValueError):
                mod.validate_openai_mcp(changed)
        self.assertNotIn('extensions', json.loads((mod.ROOT / 'mcp.json').read_text())['mcpServers']['synter'])

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
