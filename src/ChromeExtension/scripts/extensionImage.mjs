#!/usr/bin/env node
// Decides whether CI reuses the extension image tagged with the current inputs hash or builds the extension.
// The image is reused when the registry has it and its version is not older than `latest`: after a revert the
// hash points to an image with an older version, and Chrome never downgrades, so it has to be rebuilt.
// See "Build and release" in src/ChromeExtension/AGENTS.md.
//
// Usage: node extensionImage.mjs <image:hash> <image:latest>
// Prints `reuse` or `build` (the reason goes to stderr); exits non-zero when the registry cannot be asked.

import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const VERSION_PATTERN = /^\d+(\.\d+){3}$/;

// How docker reports a tag or repository that does not exist: ghcr answers "manifest unknown", the docker CLI
// rewrites some registries' answers as "no such manifest". Anything else is an error, not a missing image.
const MISSING_MANIFEST_PATTERN = /manifest unknown|no such manifest/i;

export function compareVersions(left, right) {
  const leftParts = left.split('.').map(Number);
  const rightParts = right.split('.').map(Number);
  for (let i = 0; i < Math.max(leftParts.length, rightParts.length); i++) {
    const difference = (leftParts[i] ?? 0) - (rightParts[i] ?? 0);
    if (difference !== 0) return Math.sign(difference);
  }
  return 0;
}

function imageExists(docker, image) {
  const result = docker(['manifest', 'inspect', image]);
  if (result.status === 0) return true;
  const output = `${result.stdout}${result.stderr}`.trim();
  if (MISSING_MANIFEST_PATTERN.test(output)) return false;
  throw new Error(`cannot look up ${image}: ${output}`);
}

function pulledVersion(docker, image) {
  const pull = docker(['pull', '-q', image]);
  if (pull.status !== 0) throw new Error(`cannot pull ${image}: ${`${pull.stdout}${pull.stderr}`.trim()}`);
  const inspect = docker(['image', 'inspect', '--format', '{{ index .Config.Labels "version" }}', image]);
  if (inspect.status !== 0) throw new Error(`cannot inspect ${image}: ${inspect.stderr.trim()}`);
  return inspect.stdout.trim();
}

// `docker` runs the docker CLI with the given arguments and returns { status, stdout, stderr }.
export function resolveExtensionImage(docker, image, latestImage) {
  if (!imageExists(docker, image)) {
    return { action: 'build', reason: `no image for the current inputs: ${image}` };
  }
  const version = pulledVersion(docker, image);
  if (!VERSION_PATTERN.test(version)) {
    return { action: 'build', reason: `${image} has no valid version label ("${version}")` };
  }
  if (!imageExists(docker, latestImage)) {
    return { action: 'reuse', reason: `${image} has version ${version}, no ${latestImage} to compare with` };
  }
  const latestVersion = pulledVersion(docker, latestImage);
  if (!VERSION_PATTERN.test(latestVersion)) {
    throw new Error(`${latestImage} has no valid version label ("${latestVersion}")`);
  }
  if (compareVersions(version, latestVersion) < 0) {
    return {
      action: 'build',
      reason: `${image} has version ${version}, older than ${latestImage} ${latestVersion} (reverted inputs, or a branch behind main)`,
    };
  }
  return { action: 'reuse', reason: `${image} has version ${version}, not older than ${latestImage} ${latestVersion}` };
}

function runDocker(args) {
  const result = spawnSync('docker', args, { encoding: 'utf8' });
  if (result.error) throw new Error(`cannot run docker: ${result.error.message}`);
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [image, latestImage] = process.argv.slice(2);
  if (!image || !latestImage) {
    process.stderr.write('usage: extensionImage.mjs <image:hash> <image:latest>\n');
    process.exit(2);
  }
  try {
    const { action, reason } = resolveExtensionImage(runDocker, image, latestImage);
    process.stderr.write(`${reason}\n`);
    process.stdout.write(`${action}\n`);
  } catch (error) {
    process.stderr.write(`extensionImage: ${error.message}\n`);
    process.exit(1);
  }
}
