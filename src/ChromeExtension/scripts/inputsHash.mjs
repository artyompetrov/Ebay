#!/usr/bin/env node
// Prints a hash of the Chrome extension's inputs, used as the tag of the extension Docker image:
// CI rebuilds the extension (and so gives it a new version) only when no image with this tag exists.
// See "Build and release" in src/ChromeExtension/AGENTS.md.
//
// Usage: npm run --silent inputs-hash [-- <repository root>]   (default: git top level of the current directory)

import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

// Tracked files the extension is built from. Tests and docs do not end up in the extension.
const INPUT_PATHSPECS = [
  'src/ChromeExtension',
  ':(exclude)src/ChromeExtension/tests',
  ':(exclude,glob)src/ChromeExtension/**/*.md',
];

// Git-ignored, written by NSwag when src/Ebay/Server.Client is built. Hashing the generated file instead of
// the OpenAPI contract and NSwag setup means only changes to the client the extension actually gets count.
const GENERATED_CLIENT = 'src/ChromeExtension/src/clients/Generated/EbayToolWebApiClient.ts';

function fail(message) {
  process.stderr.write(`inputs-hash: ${message}\n`);
  process.exit(1);
}

function git(cwd, args) {
  const result = spawnSync('git', ['-c', 'core.quotepath=off', ...args], { cwd, encoding: 'utf8' });
  if (result.error) fail(`cannot run git: ${result.error.message}`);
  if (result.status !== 0) fail(`git ${args.join(' ')} failed: ${result.stderr.trim()}`);
  return result.stdout;
}

const root = process.argv[2] ?? git(process.cwd(), ['rev-parse', '--show-toplevel']).trim();

if (!existsSync(path.join(root, GENERATED_CLIENT))) {
  fail(`${GENERATED_CLIENT} does not exist; build src/Ebay/Server.Client first to generate it`);
}

const trackedInputs = git(root, ['ls-files', '-z', '--', ...INPUT_PATHSPECS]).split('\0').filter(Boolean);
const inputs = [...new Set([...trackedInputs, GENERATED_CLIENT])]
  .sort((a, b) => Buffer.compare(Buffer.from(a), Buffer.from(b)));

// Line endings are normalized: NSwag writes the git-ignored generated client with the OS line endings, which
// .gitattributes (eol=lf) cannot normalize, and the hash must not depend on the OS it is computed on.
const hash = createHash('sha256');
for (const input of inputs) {
  const content = readFileSync(path.join(root, input), 'latin1').replaceAll('\r\n', '\n');
  hash.update(`${input}\0${createHash('sha256').update(content, 'latin1').digest('hex')}\n`);
}

process.stdout.write(`${hash.digest('hex')}\n`);
