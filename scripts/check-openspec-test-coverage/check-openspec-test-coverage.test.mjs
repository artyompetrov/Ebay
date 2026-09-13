import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '../..');

function fixture(t) {
  const root = mkdtempSync(path.join(os.tmpdir(), 'openspec-coverage-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  function write(file, content) {
    const target = path.join(root, file);
    mkdirSync(path.dirname(target), { recursive: true });
    writeFileSync(target, content);
  }
  write('openspec/config.yaml', 'schema: spec-driven\n');
  const runner = 'scripts/check-openspec-test-coverage/check-openspec-test-coverage.mjs';
  write(runner, readFileSync(path.join(scriptDir, path.basename(runner)), 'utf8'));
  copyFileSync(path.join(repoRoot, '.openspec-version'), path.join(root, '.openspec-version'));
  const env = { ...process.env, OPENSPEC_TELEMETRY: '0', XDG_CONFIG_HOME: path.join(root, 'config') };
  function run(command, args) {
    const result = spawnSync(command, args, { cwd: root, env, encoding: 'utf8' });
    assert.ifError(result.error);
    return { status: result.status, output: result.stdout + result.stderr };
  }
  function change(name, deltas, tasks = '- [x] Implement\n- [ ] Verify\n') {
    write(`openspec/changes/${name}/.openspec.yaml`, 'schema: spec-driven\n');
    write(`openspec/changes/${name}/proposal.md`, '# Change: Coverage fixture\n\n## Why\nExercise coverage lifecycle.\n\n## What Changes\nUpdate the fixture behavior.\n');
    if (tasks !== null) write(`openspec/changes/${name}/tasks.md`, tasks);
    for (const [id, content] of Object.entries(deltas)) write(`openspec/changes/${name}/specs/${id}/spec.md`, content);
  }
  return {
    root, write, change,
    spec: (id, requirements) => write(`openspec/specs/${id}/spec.md`, `# ${id}\n\n## Purpose\nDefine fixture behavior for scenario coverage testing.\n\n## Requirements\n${requirements}`),
    tags: (...values) => write('src/Ebay/Frontend/Tests/fixture.test.mjs', values.map(([id, requirement, scenario]) =>
      `// [OpenSpecScenario(${[id, requirement, scenario].map(JSON.stringify).join(', ')})]`).join('\n')),
    check: () => run(process.execPath, [runner]),
    archive: (name) => run('openspec', ['archive', name, '--yes']),
  };
}

function requirement(name, scenario = 'Works', extra = '') {
  return `\n### Requirement: ${name}\nThe system SHALL support ${name}.\n\n#### Scenario: ${scenario}\n- **WHEN** requested\n- **THEN** the expected result is returned\n${extra}\n`;
}

function expectPass(result) {
  assert.equal(result.status, 0, result.output);
}
function expectFailure(result, message) {
  assert.notEqual(result.status, 0, result.output);
  assert.match(result.output, message);
}

// These run the real pinned CLI and its parser, so an OpenSpec upgrade also
// verifies our integration boundary. Fixture tags exercise source matching only.
test('no completed task keeps missing coverage and new mappings strict', (t) => {
  const f = fixture(t);
  f.spec('catalog', requirement('Changed'));
  for (const tasks of [null, '- [ ] Implement\n', '- [~] Deliberately skipped\n']) {
    if (tasks === null) {
      f.change('update-catalog', { catalog: '## MODIFIED Requirements\n' + requirement('Changed') }, tasks);
    } else {
      f.write('openspec/changes/update-catalog/tasks.md', tasks);
    }
    f.tags(['catalog', 'Changed', 'New scenario']);
    const result = f.check();
    expectFailure(result, /No test is tagged/);
    assert.match(result.output, /does not match any scenario/);
    assert.doesNotMatch(result.output, /Deferred coverage:/);
  }
});

test('one completed task defers both directions for affected requirements only', (t) => {
  const f = fixture(t);
  f.spec('catalog', requirement('Changed') + requirement('Untouched'));
  f.spec('other', requirement('Changed'));
  f.change('update-catalog', { catalog: '## MODIFIED Requirements\n' + requirement('Changed') }, '  * [X] First step\r\n- [ ] Still working\r\n');
  f.tags(['catalog', 'Changed', 'Future scenario'], ['catalog', 'Untouched', 'Works'], ['other', 'Changed', 'Works']);
  expectPass(f.check());
  f.tags(['catalog', 'Changed', 'Future scenario'], ['catalog', 'Untouched', 'Typo']);
  const result = f.check();
  expectFailure(result, /No test is tagged .*Untouched/);
  assert.match(result.output, /No test is tagged .*other/);
  assert.match(result.output, /does not match any scenario/);
  assert.match(result.output, /Deferred coverage: catalog \/ Changed/);
});

test('added, removed, and both renamed names are deferred, including nested spec IDs', (t) => {
  const f = fixture(t);
  f.spec('area/catalog', requirement('Removed') + requirement('Old name'));
  f.change('update-catalog', { 'area/catalog':
    '## ADDED Requirements\n' + requirement('Added') +
    '\n## REMOVED Requirements\n### Requirement: Removed\n**Reason**: Retired.\n**Migration**: Use Added.\n' +
    '\n## RENAMED Requirements\n- FROM: `### Requirement: Old name`\n- TO: `### Requirement: New name`\n',
  });
  f.tags(['area/catalog', 'Added', 'Works'], ['area/catalog', 'Removed', 'Old scenario'],
    ['area/catalog', 'Old name', 'Works'], ['area/catalog', 'New name', 'Works']);
  const result = f.check();
  expectPass(result);
  assert.match(result.output, /4 requirement\(s\).*4 test mapping\(s\) deferred/);
});

test('unstarted proposals and fenced example requirements do not widen exemptions', (t) => {
  const f = fixture(t);
  f.spec('catalog', requirement('Changed') + requirement('Untouched'));
  f.change('started', { catalog: '## MODIFIED Requirements\n' + requirement('Changed') +
    '\n```markdown\n### Requirement: Untouched\n```\n' });
  f.change('proposal', { catalog: '## MODIFIED Requirements\n' + requirement('Untouched') }, '- [ ] Implement\n');
  expectFailure(f.check(), /No test is tagged .*Untouched/);
});

test('conflicting test/exemption mappings are deferred but malformed specs remain errors', (t) => {
  const f = fixture(t);
  f.spec('catalog', requirement('Changed', 'Works', '- **NOT COVERED BY TEST:** manual check'));
  f.change('started', { catalog: '## MODIFIED Requirements\n' + requirement('Changed') });
  f.tags(['catalog', 'Changed', 'Works']);
  expectPass(f.check());
  f.spec('catalog', requirement('Changed', 'Works', '- **NOT COVERED BY TEST:**'));
  expectFailure(f.check(), /without a justification/);
});

test('resetting task completion restores checks; completing every task does not archive a change', (t) => {
  const f = fixture(t);
  f.spec('catalog', requirement('Changed'));
  f.change('started', { catalog: '## MODIFIED Requirements\n' + requirement('Changed') }, '- [x] Done\n');
  expectPass(f.check());
  f.write('openspec/changes/started/tasks.md', '- [ ] Reopened\n');
  expectFailure(f.check(), /No test is tagged/);
});

test('real archive syncs deltas and restores missing, dangling, and contradictory mapping checks', (t) => {
  const f = fixture(t);
  f.spec('catalog', requirement('Changed') + requirement('Removed') + requirement('Old name'));
  f.change('finish-catalog', { catalog:
    '## MODIFIED Requirements\n' + requirement('Changed', 'Works', '- **NOT COVERED BY TEST:** manual check') +
    '\n## ADDED Requirements\n' + requirement('Added') +
    '\n## REMOVED Requirements\n### Requirement: Removed\n**Reason**: Retired.\n**Migration**: Use Added.\n' +
    '\n## RENAMED Requirements\n- FROM: `### Requirement: Old name`\n- TO: `### Requirement: New name`\n',
  }, '- [x] Implemented\n');
  f.tags(['catalog', 'Changed', 'Works'], ['catalog', 'Removed', 'Works'], ['catalog', 'Old name', 'Works']);
  expectPass(f.check());
  expectPass(f.archive('finish-catalog'));
  const result = f.check();
  expectFailure(result, /No test is tagged .*Added/);
  assert.match(result.output, /No test is tagged .*New name/);
  assert.match(result.output, /maps to a scenario flagged NOT COVERED BY TEST/);
  assert.match(result.output, /Removed.*does not match any scenario/);
  assert.match(result.output, /Old name.*does not match any scenario/);
  assert.doesNotMatch(result.output, /Deferred coverage:/);
  f.tags(['catalog', 'Added', 'Works'], ['catalog', 'New name', 'Works']);
  expectPass(f.check());
});

test('incompatible OpenSpec installation fails rather than skipping the affected scope', (t) => {
  const f = fixture(t);
  f.spec('catalog', requirement('Changed'));
  f.change('started', { catalog: '## MODIFIED Requirements\n' + requirement('Changed') });
  f.write('.openspec-version', '0.0.0\n');
  expectFailure(f.check(), /Expected npm-installed @fission-ai\/openspec@0.0.0/);
});

test('a new capability accepts tags during implementation and requires them after archive', (t) => {
  const f = fixture(t);
  f.change('add-capability', { 'area/new': '## ADDED Requirements\n' + requirement('New capability') }, '- [x] Implement\n');
  f.tags(['area/new', 'New capability', 'Future scenario']);
  expectPass(f.check());
  expectPass(f.archive('add-capability'));
  const result = f.check();
  expectFailure(result, /No test is tagged/);
  assert.match(result.output, /Future scenario.*does not match any scenario/);
});

test('overlapping changes defer a requirement until the last started change is archived', (t) => {
  const f = fixture(t);
  f.spec('catalog', requirement('Changed'));
  for (const name of ['first', 'second']) {
    f.change(name, { catalog: '## MODIFIED Requirements\n' + requirement('Changed') }, '- [x] Implement\n');
  }
  const initial = f.check();
  expectPass(initial);
  assert.match(initial.output, /started changes: first, second/);
  expectPass(f.archive('first'));
  const intermediate = f.check();
  expectPass(intermediate);
  assert.match(intermediate.output, /started changes: second/);
  expectPass(f.archive('second'));
  expectFailure(f.check(), /No test is tagged/);
});
