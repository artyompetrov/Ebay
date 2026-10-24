import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const script = path.join(path.dirname(fileURLToPath(import.meta.url)), 'chrome-extension-inputs-hash.mjs');
const generatedClient = 'src/ChromeExtension/src/clients/Generated/EbayToolWebApiClient.ts';

function git(cwd, ...args) {
  const result = spawnSync('git', args, { cwd, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
}

function tempDir(t) {
  const dir = mkdtempSync(path.join(os.tmpdir(), 'chrome-extension-inputs-hash-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  return dir;
}

function repository(t) {
  const root = tempDir(t);
  git(root, 'init', '-q');
  git(root, 'config', 'user.email', 'test@localhost');
  git(root, 'config', 'user.name', 'Test');
  git(root, 'config', 'core.autocrlf', 'false');
  const repo = {
    root,
    write(file, content) {
      const target = path.join(root, file);
      mkdirSync(path.dirname(target), { recursive: true });
      writeFileSync(target, content);
      return repo;
    },
    commit() {
      git(root, 'add', '-A');
      git(root, 'commit', '-q', '-m', 'change');
      return repo;
    },
    run(dir = root) {
      return spawnSync(process.execPath, [script, dir], { encoding: 'utf8' });
    },
    hash(dir = root) {
      const result = repo.run(dir);
      assert.equal(result.status, 0, result.stderr);
      return result.stdout.trim();
    },
  };
  return repo
    .write('.gitignore', '**/Generated/**\n')
    .write('src/ChromeExtension/src/background.ts', 'export const a = 1;\n')
    .write('src/ChromeExtension/package.json', '{}\n')
    .write('src/ChromeExtension/AGENTS.md', '# Extension\n')
    .write('src/ChromeExtension/src/README.md', '# Sources\n')
    .write('src/ChromeExtension/tests/background.test.ts', 'test();\n')
    .write('src/Ebay/Server/Program.cs', 'class Program {}\n')
    .write(generatedClient, 'export class EbayToolWebApiClient {}\n')
    .commit();
}

// [OpenSpecScenario("chrome-extension-release", "Extension inputs hash", "A change outside the inputs keeps the hash")]
test('a change outside the inputs keeps the hash', (t) => {
  const repo = repository(t);
  const before = repo.hash();
  repo.write('src/Ebay/Server/Program.cs', 'class Program { }\n').commit();
  assert.equal(repo.hash(), before);
});

// [OpenSpecScenario("chrome-extension-release", "Extension inputs hash", "A change to the extension sources changes the hash")]
test('a change to the extension sources changes the hash', (t) => {
  const repo = repository(t);
  const before = repo.hash();
  repo.write('src/ChromeExtension/src/background.ts', 'export const a = 2;\n').commit();
  assert.notEqual(repo.hash(), before);
});

// [OpenSpecScenario("chrome-extension-release", "Extension inputs hash", "A change to the generated API client changes the hash")]
test('a change to the generated API client changes the hash', (t) => {
  const repo = repository(t);
  const before = repo.hash();
  repo.write(generatedClient, 'export class EbayToolWebApiClient { get() {} }\n');
  assert.notEqual(repo.hash(), before);
});

// [OpenSpecScenario("chrome-extension-release", "Extension inputs hash", "An added input changes the hash")]
test('an added input changes the hash', (t) => {
  const repo = repository(t);
  const before = repo.hash();
  repo.write('src/ChromeExtension/src/worker.ts', 'export {};\n').commit();
  assert.notEqual(repo.hash(), before);
});

// [OpenSpecScenario("chrome-extension-release", "Extension inputs hash", "A change to extension tests or docs keeps the hash")]
test('a change to extension tests or docs keeps the hash', (t) => {
  const repo = repository(t);
  const before = repo.hash();
  repo
    .write('src/ChromeExtension/tests/background.test.ts', 'test(() => {});\n')
    .write('src/ChromeExtension/AGENTS.md', '# Chrome extension\n')
    .write('src/ChromeExtension/src/README.md', '# Extension sources\n')
    .commit();
  assert.equal(repo.hash(), before);
});

// [OpenSpecScenario("chrome-extension-release", "Extension inputs hash", "A renamed input changes the hash")]
test('a renamed input changes the hash', (t) => {
  const repo = repository(t);
  const before = repo.hash();
  renameSync(path.join(repo.root, 'src/ChromeExtension/src/background.ts'), path.join(repo.root, 'src/ChromeExtension/src/worker.ts'));
  repo.commit();
  assert.notEqual(repo.hash(), before);
});

// [OpenSpecScenario("chrome-extension-release", "Extension inputs hash", "An untracked file does not affect the hash")]
test('an untracked file does not affect the hash', (t) => {
  const repo = repository(t);
  const before = repo.hash();
  repo.write('src/ChromeExtension/src/scratch.ts', 'export {};\n');
  assert.equal(repo.hash(), before);
});

// [OpenSpecScenario("chrome-extension-release", "Extension inputs hash is reproducible", "Two clones give the same hash")]
test('two clones give the same hash', (t) => {
  const repo = repository(t);
  const clone = path.join(tempDir(t), 'clone');
  git(repo.root, 'clone', '-q', '--config', 'core.autocrlf=false', repo.root, clone);
  const cloneClient = path.join(clone, generatedClient);
  mkdirSync(path.dirname(cloneClient), { recursive: true });
  writeFileSync(cloneClient, 'export class EbayToolWebApiClient {}\n');

  const hash = repo.hash();
  assert.equal(repo.hash(clone), hash);
  assert.match(hash, /^[0-9a-f]+$/);
});

// [OpenSpecScenario("chrome-extension-release", "Extension inputs hash is reproducible", "Line endings of the generated client do not affect the hash")]
test('line endings of the generated client do not affect the hash', (t) => {
  const repo = repository(t);
  const before = repo.hash();
  repo.write(generatedClient, 'export class EbayToolWebApiClient {}\r\n');
  assert.equal(repo.hash(), before);
});

// [OpenSpecScenario("chrome-extension-release", "Hash cannot be computed without the generated client", "Missing generated client is rejected")]
test('missing generated client is rejected', (t) => {
  const repo = repository(t);
  rmSync(path.join(repo.root, generatedClient));
  const result = repo.run();
  assert.notEqual(result.status, 0);
  assert.equal(result.stdout, '');
  assert.ok(result.stderr.includes(generatedClient), result.stderr);
});

test('defaults to the repository containing the current directory', (t) => {
  const repo = repository(t);
  const result = spawnSync(process.execPath, [script], { cwd: path.join(repo.root, 'src/Ebay'), encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout.trim(), repo.hash());
});
