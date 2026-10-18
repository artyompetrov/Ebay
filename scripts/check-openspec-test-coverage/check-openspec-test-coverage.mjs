#!/usr/bin/env node
// Cross-checks [OpenSpecScenario] test attributes against openspec/specs/**/spec.md scenarios.
// See scripts/check-openspec-test-coverage/README.md for the rules this enforces.

import { execFileSync } from 'node:child_process';
import { readFileSync, realpathSync, globSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const fallbackRoot = path.resolve(scriptDir, '..', '..');

const REQUIREMENT_HEADING = /^### Requirement: (.+)$/;
const SCENARIO_HEADING = /^#### Scenario: (.+)$/;
const NOT_COVERED_FLAG = /^- \*\*NOT COVERED BY TEST:\*\*\s*(.*)$/;
const ATTRIBUTE_USAGE = /\[OpenSpecScenario\(\s*"((?:[^"\\]|\\.)*)"\s*,\s*"((?:[^"\\]|\\.)*)"\s*,\s*"((?:[^"\\]|\\.)*)"\s*\)\]/g;

// Both C# and JS test source use the same double-quoted-string escaping for the small set of
// escapes we care about here, so one unescaper covers [OpenSpecScenario(...)] wherever it appears.
function unescapeAttributeString(value) {
  return value.replace(/\\(.)/g, (_, char) => (char === 'n' ? '\n' : char === 't' ? '\t' : char));
}

// Where [OpenSpecScenario(...)] is looked for in each test suite. C# has real attributes; the
// Node test runner (src/Ebay/Frontend/Tests, src/ChromeExtension/tests) does not, so JS/TS tests use the identical
// `[OpenSpecScenario("...", "...", "...")]` text in a `//` comment directly above the test() call.
const ATTRIBUTE_SOURCE_GLOBS = [
  'src/Ebay/Tests.*/**/*.cs',
  'src/Ebay/Frontend/Tests/**/*.mjs',
  'src/ChromeExtension/tests/**/*.test.ts',
];

function scenarioKey(specId, requirement, scenario) {
  return `${specId}\u0000${requirement}\u0000${scenario}`;
}

function requirementKey(specId, requirement) {
  return JSON.stringify([specId, requirement]);
}

// JSON omits requirement headings. Reuse the parser shipped with the npm CLI
// on PATH. These internal modules are version-pinned and covered by integration
// tests; loading/parsing errors must never silently disable coverage checks.
async function loadOpenSpecParsers() {
  const executable = realpathSync(execFileSync('which', ['openspec'], { encoding: 'utf8' }).trim());
  const packageRoot = path.resolve(path.dirname(executable), '..');
  const installed = JSON.parse(readFileSync(path.join(packageRoot, 'package.json'), 'utf8'));
  const expected = readFileSync(path.join(fallbackRoot, '.openspec-version'), 'utf8').trim();
  if (installed.name !== '@fission-ai/openspec' || installed.version !== expected) {
    throw new Error(`Expected npm-installed @fission-ai/openspec@${expected} on PATH; found ${installed.name}@${installed.version}`);
  }
  const [requirements, discovery] = await Promise.all([
    import(pathToFileURL(path.join(packageRoot, 'dist/core/parsers/requirement-blocks.js')).href),
    import(pathToFileURL(path.join(packageRoot, 'dist/utils/spec-discovery.js')).href),
  ]);
  return { parseDeltaSpec: requirements.parseDeltaSpec, discoverSpecFiles: discovery.discoverSpecFiles };
}

async function findStartedRequirements(rootDir) {
  const raw = execFileSync('openspec', ['list', '--json'], { cwd: rootDir, encoding: 'utf8' });
  const data = JSON.parse(raw);
  if (data.root.path !== rootDir) throw new Error('OpenSpec changes and specs resolved to different roots');
  const startedChanges = data.changes.filter((change) => {
    if (!Number.isInteger(change.completedTasks) || change.completedTasks < 0) {
      throw new Error(`Invalid completed-task count for change ${change.name}`);
    }
    return change.completedTasks > 0;
  });
  const requirements = new Map();
  if (startedChanges.length === 0) return requirements;
  const { parseDeltaSpec, discoverSpecFiles } = await loadOpenSpecParsers();
  for (const change of startedChanges) {
    const specsDir = path.join(rootDir, 'openspec', 'changes', change.name, 'specs');
    for (const { id: specId, specFile } of await discoverSpecFiles(specsDir)) {
      const delta = parseDeltaSpec(readFileSync(specFile, 'utf8'));
      const names = [
        ...delta.added.map((block) => block.name),
        ...delta.modified.map((block) => block.name),
        ...delta.removed,
        ...delta.renamed.flatMap(({ from, to }) => [from, to]),
      ];
      for (const requirement of names) {
        const key = requirementKey(specId, requirement);
        if (!requirements.has(key)) requirements.set(key, { specId, requirement, changes: new Set() });
        requirements.get(key).changes.add(change.name);
      }
    }
  }
  return requirements;
}

function listSpecIds(rootDir) {
  const raw = execFileSync('openspec', ['list', '--specs', '--json'], { cwd: rootDir, encoding: 'utf8' });
  const data = JSON.parse(raw);
  return { specIds: data.specs.map((spec) => spec.id), root: data.root.path };
}

// Only spec.md's own "### Requirement:"/"#### Scenario:" headings and our "NOT COVERED BY TEST"
// bullet are read directly, because `openspec show --json` does not expose scenario/requirement
// names (only body text) - see scripts/check-openspec-test-coverage/README.md. Everything else
// (which specs exist, that spec.md is well-formed) is delegated to the openspec CLI, which
// `openspec validate --all --strict` already checks as an earlier agent-check step.
function parseScenarios(specId, specFilePath) {
  const lines = readFileSync(specFilePath, 'utf8').split('\n');
  const scenarios = [];
  const malformed = [];
  let currentRequirement = null;
  let currentScenario = null;

  for (let i = 0; i < lines.length; i++) {
    const lineNumber = i + 1;
    const line = lines[i];

    const requirementMatch = line.match(REQUIREMENT_HEADING);
    if (requirementMatch) {
      currentRequirement = requirementMatch[1].trim();
      currentScenario = null;
      continue;
    }

    const scenarioMatch = line.match(SCENARIO_HEADING);
    if (scenarioMatch) {
      if (currentRequirement === null) {
        malformed.push({ specId, file: specFilePath, line: lineNumber, message: 'Scenario heading appears before any Requirement heading' });
        continue;
      }
      currentScenario = {
        specId,
        requirement: currentRequirement,
        scenario: scenarioMatch[1].trim(),
        notCoveredReason: null,
        file: specFilePath,
        line: lineNumber,
      };
      scenarios.push(currentScenario);
      continue;
    }

    const notCoveredMatch = line.match(NOT_COVERED_FLAG);
    if (notCoveredMatch) {
      if (currentScenario === null) {
        malformed.push({ specId, file: specFilePath, line: lineNumber, message: 'NOT COVERED BY TEST flag appears outside any Scenario' });
        continue;
      }
      if (currentScenario.notCoveredReason !== null) {
        malformed.push({ specId, file: specFilePath, line: lineNumber, message: `Scenario "${currentScenario.scenario}" has more than one NOT COVERED BY TEST flag` });
        continue;
      }
      const reason = notCoveredMatch[1].trim();
      if (reason.length === 0) {
        malformed.push({ specId, file: specFilePath, line: lineNumber, message: `Scenario "${currentScenario.scenario}" is flagged NOT COVERED BY TEST without a justification` });
        continue;
      }
      currentScenario.notCoveredReason = reason;
    }
  }

  return { scenarios, malformed };
}

function findAttributeUsages(rootDir) {
  const files = ATTRIBUTE_SOURCE_GLOBS.flatMap((pattern) => globSync(pattern, { cwd: rootDir })).filter(
    (file) => !file.startsWith(`Tests.Shared${path.sep}`) && !file.startsWith('Tests.Shared/'),
  );

  const usages = [];
  for (const relativeFile of files) {
    const absoluteFile = path.join(rootDir, relativeFile);
    const content = readFileSync(absoluteFile, 'utf8');

    for (const match of content.matchAll(ATTRIBUTE_USAGE)) {
      const lineNumber = content.slice(0, match.index).split('\n').length;
      usages.push({
        file: relativeFile,
        line: lineNumber,
        specId: unescapeAttributeString(match[1]),
        requirement: unescapeAttributeString(match[2]),
        scenario: unescapeAttributeString(match[3]),
      });
    }
  }
  return usages;
}

async function main() {
  let specIds;
  let root;
  let startedRequirements;
  try {
    ({ specIds, root } = listSpecIds(fallbackRoot));
    startedRequirements = await findStartedRequirements(root);
  } catch (error) {
    console.error('Failed to load OpenSpec coverage scope. Check the pinned CLI installation and change specs.');
    console.error(error.message);
    process.exit(1);
  }

  const scenarioMap = new Map();
  const malformedIssues = [];
  const duplicateIssues = [];
  let deferredScenarios = 0;

  for (const { specId, requirement, changes } of startedRequirements.values()) {
    console.log(`Deferred coverage: ${specId} / ${requirement} (started changes: ${[...changes].sort().join(', ')})`);
  }

  for (const specId of specIds) {
    const specFilePath = path.join(root, 'openspec', 'specs', specId, 'spec.md');
    const { scenarios, malformed } = parseScenarios(specId, specFilePath);
    malformedIssues.push(...malformed);

    for (const scenario of scenarios) {
      const key = scenarioKey(scenario.specId, scenario.requirement, scenario.scenario);
      if (scenarioMap.has(key)) {
        duplicateIssues.push({
          specId,
          file: specFilePath,
          line: scenario.line,
          message: `Requirement "${scenario.requirement}" has two scenarios named "${scenario.scenario}" - the mapping key is not unique`,
        });
        continue;
      }
      scenarioMap.set(key, scenario);
    }
  }

  // Structural diagnostics stay strict; only mapping checks are deferred.
  for (const [key, scenario] of scenarioMap) {
    if (startedRequirements.has(requirementKey(scenario.specId, scenario.requirement))) {
      scenarioMap.delete(key);
      deferredScenarios++;
    }
  }

  const usages = findAttributeUsages(root);

  const missingIssues = [];
  const danglingIssues = [];
  const contradictoryIssues = [];
  const coveredKeys = new Set();
  let deferredUsages = 0;

  for (const usage of usages) {
    if (startedRequirements.has(requirementKey(usage.specId, usage.requirement))) {
      deferredUsages++;
      continue;
    }
    const key = scenarioKey(usage.specId, usage.requirement, usage.scenario);
    const scenario = scenarioMap.get(key);
    if (!scenario) {
      danglingIssues.push({
        file: usage.file,
        line: usage.line,
        message: `[OpenSpecScenario("${usage.specId}", "${usage.requirement}", "${usage.scenario}")] does not match any scenario in openspec/specs/**`,
      });
      continue;
    }
    if (scenario.notCoveredReason !== null) {
      contradictoryIssues.push({
        file: usage.file,
        line: usage.line,
        message: `[OpenSpecScenario("${usage.specId}", "${usage.requirement}", "${usage.scenario}")] maps to a scenario flagged NOT COVERED BY TEST ("${scenario.notCoveredReason}")`,
      });
      continue;
    }
    coveredKeys.add(key);
  }

  for (const [key, scenario] of scenarioMap) {
    if (scenario.notCoveredReason === null && !coveredKeys.has(key)) {
      missingIssues.push({
        file: scenario.file,
        line: scenario.line,
        message: `No test is tagged [OpenSpecScenario("${scenario.specId}", "${scenario.requirement}", "${scenario.scenario}")]`,
      });
    }
  }

  const allIssues = [...malformedIssues, ...duplicateIssues, ...danglingIssues, ...contradictoryIssues, ...missingIssues];

  if (allIssues.length > 0) {
    console.error(`OpenSpec scenario coverage: ${allIssues.length} issue(s) found.\n`);
    for (const issue of allIssues) {
      console.error(`${issue.file}:${issue.line}: ${issue.message}`);
    }
    console.error(
      '\nEach implemented scenario (openspec/specs/**) needs a test tagged [OpenSpecScenario(specId, requirement, scenario)] ' +
        '- a C# attribute (Tests.Shared) or a `//` comment with the same text above a Frontend/Tests or ChromeExtension/tests test() call - ' +
        'or a "- **NOT COVERED BY TEST:** <reason>" bullet inside the scenario. See the write-tests skill.',
    );
    process.exit(1);
  }

  const exemptCount = [...scenarioMap.values()].filter((scenario) => scenario.notCoveredReason !== null).length;
  console.log(
    `OpenSpec scenario coverage: ${scenarioMap.size} scenario(s) across ${specIds.length} spec(s), ` +
      `${coveredKeys.size} covered, ${exemptCount} exempted (NOT COVERED BY TEST); ` +
      `${startedRequirements.size} requirement(s), ${deferredScenarios} baseline scenario(s) and ` +
      `${deferredUsages} test mapping(s) deferred for started changes.`,
  );
}

await main();
