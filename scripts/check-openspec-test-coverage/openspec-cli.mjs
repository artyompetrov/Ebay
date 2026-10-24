// Locates the npm-installed OpenSpec CLI on PATH and runs its entry script with the current Node.
// Node's child_process cannot execute npm's `openspec` / `openspec.cmd` shims on Windows (ENOENT
// without a shell), so the CLI is never spawned by name: the same code path works on Linux and Windows.

import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, readFileSync, realpathSync } from 'node:fs';
import path from 'node:path';

const PACKAGE_DIR = path.join('node_modules', '@fission-ai', 'openspec');

function pathEntries(env) {
  // A copied env object loses Windows' case-insensitive lookup, where the variable may be `Path`.
  const [, value = ''] = Object.entries(env).find(([key]) => key.toUpperCase() === 'PATH') ?? [];
  return value.split(path.delimiter).filter(Boolean);
}

function findPackageRoot(env) {
  for (const dir of pathEntries(env)) {
    // npm global prefix on Windows: <prefix>/openspec.cmd next to <prefix>/node_modules/@fission-ai/openspec.
    const sibling = path.join(dir, PACKAGE_DIR);
    if (existsSync(path.join(sibling, 'package.json'))) return sibling;
    // npm global prefix on Linux/macOS: <prefix>/bin/openspec -> ../lib/node_modules/@fission-ai/openspec/bin/openspec.js.
    const shim = path.join(dir, 'openspec');
    if (existsSync(shim)) {
      const target = realpathSync(shim);
      if (target.endsWith('.js')) return path.resolve(path.dirname(target), '..');
    }
  }
  throw new Error('openspec CLI not found on PATH; install it with npm (version in .openspec-version)');
}

/**
 * The OpenSpec package found on PATH: its root, its package.json, and how to run its CLI.
 */
export function resolveOpenSpecCli(env = process.env) {
  const packageRoot = findPackageRoot(env);
  const manifest = JSON.parse(readFileSync(path.join(packageRoot, 'package.json'), 'utf8'));
  const bin = typeof manifest.bin === 'string' ? manifest.bin : manifest.bin?.openspec;
  if (!bin) throw new Error(`${manifest.name}@${manifest.version} at ${packageRoot} declares no openspec bin`);
  const entry = path.join(packageRoot, bin);
  return {
    packageRoot,
    manifest,
    execSync: (args, options) => execFileSync(process.execPath, [entry, ...args], options),
    spawnSync: (args, options) => spawnSync(process.execPath, [entry, ...args], options),
  };
}
