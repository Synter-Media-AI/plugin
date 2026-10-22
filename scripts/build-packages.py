#!/usr/bin/env python3
"""Build isolated Claude and OpenAI ZIPs from an explicit runtime allowlist."""
import argparse
import hashlib
import json
from pathlib import Path
import re
import stat
import subprocess
import zipfile

ROOT = Path(__file__).resolve().parents[1]

# OpenAI's current documented vendor extension; the portable 1.0.0 MCP
# schema does not yet accept server extensions. Keep the base independent.
OPENAI_AUTH = {'type': 'oauth', 'client': {'mode': 'dcr'}}


def validate_openai_mcp(value):
    base = json.loads((ROOT / 'mcp.json').read_text())
    expected = json.loads(json.dumps(base))
    expected['mcpServers']['synter']['extensions'] = {'com.openai': {'auth': OPENAI_AUTH}}
    if value != expected:
        raise ValueError('OpenAI MCP configuration must match the portable base plus credential-free OAuth DCR')


def encoded(value):
    return (json.dumps(value, indent=2, ensure_ascii=False) + '\n').encode()


def collect(root, target):
    manifest = json.loads((root / '.claude-plugin/plugin.json').read_text())
    version = manifest['version']
    if not re.fullmatch(r'\d+\.\d+\.\d+(?:-[a-zA-Z0-9.-]+)?', version):
        raise ValueError('Invalid package version')
    files = {}
    def include(relative):
        source = root / relative
        relative_path = Path(relative)
        if any((root / part).is_symlink() for part in [relative_path, *relative_path.parents]) or not source.is_file():
            raise ValueError('Missing or unsafe package file: ' + relative)
        files[relative] = source.read_bytes()
    for relative in ['LICENSE', 'assets/logo.png', 'context/brand-and-safety.md', 'tools/directory-tools.json']:
        include(relative)
    for relative in ['skills'] + (['agents', 'output-styles'] if target in ['claude', 'claude-directory'] else []):
        for source in sorted((root / relative).rglob('*')):
            if source.is_symlink():
                raise ValueError('Symlinks are not allowed in package sources')
            if source.is_file():
                if source.suffix != '.md':
                    raise ValueError('Unreviewed runtime asset: ' + str(source.relative_to(root)))
                include(source.relative_to(root).as_posix())
    if target == 'claude':
        include('.claude-plugin/plugin.json')
        include('.mcp.json')
        include('scripts/session-context.sh')
    elif target == 'claude-directory':
        manifest.pop('hooks', None)
        files['.claude-plugin/plugin.json'] = encoded(manifest)
        include('.mcp.json')
        overrides = ['agents/media-buyer.md', 'agents/creative-director.md',
                     'skills/ad-copy-generation/SKILL.md', 'skills/campaign-preflight/SKILL.md']
        for source, destination in ([('README.md', 'README.md'), ('help.md', 'skills/help/SKILL.md')]
                                    + [('overrides/' + name, name) for name in overrides]):
            path = root / 'config/claude-directory' / source
            relative_path = path.relative_to(root)
            if any((root / part).is_symlink() for part in [relative_path, *relative_path.parents]) or not path.is_file():
                raise ValueError('Missing or unsafe directory documentation')
            files[destination] = path.read_bytes()
        validate_claude_directory(files)
    elif target in ['openai', 'openai-new-draft']:
        mcp = json.loads((root / 'mcp.json').read_text())
        mcp['mcpServers']['synter']['extensions'] = {'com.openai': {'auth': OPENAI_AUTH}}
        validate_openai_mcp(mcp)
        files['mcp.json'] = encoded(mcp)
        portable = json.loads((root / 'plugin.json').read_text())
        submission = json.loads((root / 'config/openai-submission.json').read_text())
        if not re.fullmatch(r'app-[a-z0-9]+', submission['packageName']):
            raise ValueError('Expected existing OpenAI package identity')
        if target == 'openai':
            portable['name'] = submission['packageName']
        listing = portable['extensions']['com.openai']['interface']
        if target == 'openai':
            listing['displayName'] = submission['displayName']
        listing['developerName'] = submission['developerName']
        files['plugin.json'] = encoded(portable)
    else:
        raise ValueError('Unknown build target')
    return version, files


def validate_claude_directory(files):
    """Reject local execution capabilities in the directory-specific payload."""
    exact = {'.claude-plugin/plugin.json', '.mcp.json', 'LICENSE', 'README.md',
             'assets/logo.png', 'tools/directory-tools.json', 'context/brand-and-safety.md'}
    for name, content in files.items():
        if name not in exact and not re.fullmatch(r'skills/[a-z0-9][a-z0-9_-]*/SKILL\.md|(?:agents|output-styles)/[a-z0-9][a-z0-9_-]*\.md', name):
            raise ValueError('Unapproved directory file: ' + name)
        if content.startswith(b'version https://git-lfs.github.com/spec/'):
            raise ValueError('Git LFS pointers are not package contents')
        if name.endswith('.md'):
            text = content.decode()
            if re.search(r'!`|```(?:bash|sh|shell|python|javascript|js)\b|\b(?:Bash|Shell)\s*\(|(?:^|\n|`)\s*(?:bash|sh|zsh|python\d*|node|npx|curl|wget|chmod)\b|(?:allowed-tools|tools):[^\n]*(?:Bash|Shell|Terminal)', text):
                raise ValueError('Local execution instruction in ' + name)
    manifest = json.loads(files['.claude-plugin/plugin.json'])
    if 'hooks' in manifest:
        raise ValueError('Directory manifest must not declare hooks')
    if set(manifest) - {'$schema', 'name', 'displayName', 'description', 'version', 'license',
                        'author', 'homepage', 'repository', 'keywords'}:
        raise ValueError('Unreviewed directory manifest capability')
    servers = json.loads(files['.mcp.json']).get('mcpServers', {})
    if (set(servers) != {'synter'} or set(servers['synter']) != {'type', 'url', 'description'}
            or servers['synter']['type'] != 'http'
            or servers['synter']['url'] != 'https://mcp.synterai.com'
            or not isinstance(servers['synter']['description'], str)):
        raise ValueError('Directory supports only the declared remote HTTPS MCP server')
    if len(files['README.md'].decode().split()) < 40:
        raise ValueError('Directory README must explain the product')


def sync_claude_directory(root=ROOT, check=True):
    """Materialize or verify the committed source folder without touching other packages."""
    _, files = collect(root, 'claude-directory')
    destination = root / 'packages/claude-directory'
    if destination.is_symlink() or (root / 'packages').is_symlink():
        raise ValueError('Directory destination must be a regular folder')
    existing = {}
    if destination.exists():
        for path in destination.rglob('*'):
            if path.is_symlink():
                raise ValueError('Directory package cannot contain symlinks')
            if path.is_file():
                if path.stat().st_mode & 0o111:
                    raise ValueError('Directory package cannot contain executable files')
                existing[path.relative_to(destination).as_posix()] = path.read_bytes()
    if check:
        if existing != files:
            raise ValueError('Stale directory source; run build-packages.py --write-claude-directory')
    else:
        # Never silently delete unexpected files from a checked-in source folder.
        if set(existing) - set(files):
            raise ValueError('Unexpected files in directory source; inspect before regenerating')
        for name, content in files.items():
            path = destination / name
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(content)
            path.chmod(0o644)
    return files


def verify_archive(path, expected, target):
    with zipfile.ZipFile(path) as archive:
        names = archive.namelist()
        if len(names) != len(set(names)) or set(names) != set(expected):
            raise ValueError('Archive inventory mismatch')
        for name in names:
            if name.startswith('/') or '..' in Path(name).parts:
                raise ValueError('Unsafe archive path')
            if archive.read(name) != expected[name]:
                raise ValueError('Archive content mismatch: ' + name)
        if target in ['openai', 'openai-new-draft']:
            validate_openai_mcp(json.loads(archive.read('mcp.json')))
            manifest = json.loads(archive.read('plugin.json'))
            extension = manifest['extensions']['com.openai']
            if extension.get('hooks') or extension.get('apps') or any(n.startswith(('.claude-plugin/', 'hooks/', 'scripts/')) for n in names):
                raise ValueError('OpenAI public package must not contain lifecycle hooks')
        if target == 'claude-directory':
            validate_claude_directory({name: archive.read(name) for name in names})
            if any((info.external_attr >> 16) & 0o111 for info in archive.infolist()):
                raise ValueError('Directory archive contains executable files')
        if archive.testzip() is not None:
            raise ValueError('Archive CRC mismatch')


def build(root=ROOT, include_new_draft=False):
    sync_claude_directory(root)
    subprocess.run(['node', str(root / 'scripts/validate-manifests.js')], cwd=root, check=True)
    subprocess.run(['node', str(root / 'scripts/check-directory-tools.js')], cwd=root, check=True)
    output = root / 'dist'
    output.mkdir(exist_ok=True)
    source_sha = subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=root, text=True).strip()
    dirty = bool(subprocess.check_output(['git', 'status', '--porcelain'], cwd=root, text=True).strip())
    results = []
    for target in ['claude', 'claude-directory', 'openai'] + (['openai-new-draft'] if include_new_draft else []):
        version, files = collect(root, target)
        filename = f'synter-{target}-plugin-{version}.zip'
        archive_path = output / filename
        with zipfile.ZipFile(archive_path, 'w', compression=zipfile.ZIP_DEFLATED) as archive:
            for name, content in sorted(files.items()):
                info = zipfile.ZipInfo(name, date_time=(2026, 1, 1, 0, 0, 0))
                info.compress_type = zipfile.ZIP_DEFLATED
                info.external_attr = ((stat.S_IFREG | (0o755 if name.endswith('.sh') else 0o644)) << 16)
                archive.writestr(info, content)
        verify_archive(archive_path, files, target)
        digest = hashlib.sha256(archive_path.read_bytes()).hexdigest()
        (output / (filename + '.sha256')).write_text(f'{digest}  {filename}\n')
        results.append({'target': target, 'path': str(archive_path), 'version': version, 'sha256': digest,
                        'sourceCommit': source_sha, 'workingTreeModified': dirty, 'files': len(files),
                        'skills': sum(name.endswith('/SKILL.md') for name in files)})
    (output / 'package-manifest.json').write_bytes(encoded(results))
    return results

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--include-new-draft', action='store_true', help='Also prepare a canonical synter OpenAI archive; does not register or upload a plugin')
    parser.add_argument('--write-claude-directory', action='store_true', help='Regenerate the checked-in hook-free directory source folder')
    parser.add_argument('--check-claude-directory', action='store_true', help='Verify the checked-in directory source without rebuilding archives')
    args = parser.parse_args()
    if args.write_claude_directory or args.check_claude_directory:
        files = sync_claude_directory(check=not args.write_claude_directory)
        print(f'Verified directory source: {len(files)} files')
    else:
        print(json.dumps(build(include_new_draft=args.include_new_draft), indent=2))
