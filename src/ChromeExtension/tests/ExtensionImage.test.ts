import { test } from 'node:test';
import assert from 'node:assert/strict';
import { compareVersions, resolveExtensionImage } from '../scripts/extensionImage.mjs';

const Image = 'ghcr.io/owner/ebay-chrome-extension:hash';
const Latest = 'ghcr.io/owner/ebay-chrome-extension:latest';

interface DockerResult {
    status: number;
    stdout: string;
    stderr: string;
}

type Docker = (args: string[]) => DockerResult;

// A registry with the given images (tag -> version label); `lookupError` makes every manifest lookup fail.
function registry(images: Record<string, string>, lookupError?: string): Docker {
    return (args: string[]): DockerResult => {
        const image = args[args.length - 1];
        const known = Object.hasOwn(images, image);
        switch (args[0]) {
            case 'manifest':
                if (lookupError) return { status: 1, stdout: '', stderr: lookupError };
                return known ? { status: 0, stdout: '{}', stderr: '' } : { status: 1, stdout: '', stderr: 'manifest unknown' };
            case 'pull':
                return { status: known ? 0 : 1, stdout: '', stderr: '' };
            case 'image':
                return { status: 0, stdout: `${images[image]}\n`, stderr: '' };
            default:
                throw new Error(`unexpected docker ${args.join(' ')}`);
        }
    };
}

// [OpenSpecScenario("chrome-extension-release", "Extension image is reused only while it is current", "Missing image is built")]
test('missing image is built', () => {
    assert.equal(resolveExtensionImage(registry({ [Latest]: '2610.24.13.4512' }), Image, Latest).action, 'build');
});

// [OpenSpecScenario("chrome-extension-release", "Extension image is reused only while it is current", "Image older than latest is rebuilt")]
test('image older than latest is rebuilt', () => {
    const docker = registry({ [Image]: '2609.30.23.5959', [Latest]: '2610.1.0.0' });
    assert.equal(resolveExtensionImage(docker, Image, Latest).action, 'build');
});

// [OpenSpecScenario("chrome-extension-release", "Extension image is reused only while it is current", "Image as new as latest is reused")]
test('image as new as latest is reused', () => {
    const docker = registry({ [Image]: '2610.24.13.4512', [Latest]: '2610.24.13.4512' });
    assert.equal(resolveExtensionImage(docker, Image, Latest).action, 'reuse');
});

test('image newer than latest is reused', () => {
    const docker = registry({ [Image]: '2610.24.13.4512', [Latest]: '2610.5.0.412' });
    assert.equal(resolveExtensionImage(docker, Image, Latest).action, 'reuse');
});

// [OpenSpecScenario("chrome-extension-release", "Extension image is reused only while it is current", "Image is reused when there is no latest")]
test('image is reused when there is no latest', () => {
    assert.equal(resolveExtensionImage(registry({ [Image]: '2610.24.13.4512' }), Image, Latest).action, 'reuse');
});

// [OpenSpecScenario("chrome-extension-release", "Extension image is reused only while it is current", "Image without a valid version label is rebuilt")]
test('image without a valid version label is rebuilt', () => {
    for (const label of ['', '<no value>']) {
        const docker = registry({ [Image]: label, [Latest]: '2610.24.13.4512' });
        assert.equal(resolveExtensionImage(docker, Image, Latest).action, 'build', `label "${label}"`);
    }
});

// [OpenSpecScenario("chrome-extension-release", "Extension image is reused only while it is current", "Latest without a valid version label fails")]
test('latest without a valid version label fails', () => {
    const docker = registry({ [Image]: '2610.24.13.4512', [Latest]: '' });
    assert.throws(() => resolveExtensionImage(docker, Image, Latest), /no valid version label/);
});

// [OpenSpecScenario("chrome-extension-release", "Extension image is reused only while it is current", "Registry lookup error fails")]
test('registry lookup error fails', () => {
    const docker = registry({ [Image]: '2610.24.13.4512' }, 'unauthorized: authentication required');
    assert.throws(() => resolveExtensionImage(docker, Image, Latest), /cannot look up .*unauthorized/);
});

test('a "no such manifest" answer means the image is missing', () => {
    const docker = registry({}, 'no such manifest: ghcr.io/owner/ebay-chrome-extension:hash');
    assert.equal(resolveExtensionImage(docker, Image, Latest).action, 'build');
});

test('versions are compared part by part as numbers', () => {
    assert.equal(compareVersions('2610.5.9.712', '2610.24.9.4512'), -1);
    assert.equal(compareVersions('2610.24.13.512', '2610.24.9.4512'), 1);
    assert.equal(compareVersions('2610.24.13.4512', '2610.24.13.4512'), 0);
});
