import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const interopSourceUrl = new URL("../wwwroot/js/interop.js", import.meta.url);
const interopSource = await readFile(interopSourceUrl, "utf8");
const interopModuleUrl = `data:text/javascript;base64,${Buffer.from(interopSource).toString("base64")}`;
const {
    ApplyQrScannerOrientation,
    IsMobileClient
} = await import(interopModuleUrl);

test("IsMobileClient prefers a structured mobile result", () => {
    assert.equal(IsMobileClient({
        userAgentData: { mobile: true },
        userAgent: "Desktop"
    }), true);

    assert.equal(IsMobileClient({
        userAgentData: { mobile: false },
        userAgent: "iPhone Mobile"
    }), false);
});

test("IsMobileClient falls back to mobile user-agent identifiers", () => {
    assert.equal(IsMobileClient({
        userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) Mobile/15E148 Safari/604.1"
    }), true);

    assert.equal(IsMobileClient({
        userAgent: "Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 Chrome/138.0 Mobile Safari/537.36"
    }), true);
});

test("IsMobileClient fallback keeps desktop clients non-mobile", () => {
    assert.equal(IsMobileClient({
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/138.0 Safari/537.36"
    }), false);
});

test("ApplyQrScannerOrientation retains exactly one state across repeated calls", () => {
    const classes = new Set(["existing-reader-class"]);
    const reader = {
        classList: {
            add: (...classNames) => classNames.forEach(className => classes.add(className)),
            remove: (...classNames) => classNames.forEach(className => classes.delete(className))
        }
    };

    ApplyQrScannerOrientation(reader, true);
    assert.deepEqual([...classes].sort(), ["existing-reader-class", "qr-scanner-mobile"]);

    ApplyQrScannerOrientation(reader, false);
    assert.deepEqual([...classes].sort(), ["existing-reader-class", "qr-scanner-non-mobile"]);
});

// [OpenSpecScenario("measurement-photos", "Phone-based photo upload", "Rear-camera preview on a detected mobile client")]
// [OpenSpecScenario("measurement-photos", "Phone-based photo upload", "Scanner preview on a non-mobile client")]
// [OpenSpecScenario("measurement-photos", "Phone-based photo upload", "Mobile detection compatibility fallback")]
test("StartQrScanner classifies the client, requests the rear camera, and resolves the scanned barcode", async () => {
    const { runInNewContext } = await import("node:vm");
    for (const client of [
        { userAgentData: { mobile: true }, userAgent: "Desktop", expected: "qr-scanner-mobile" },
        { userAgentData: { mobile: false }, userAgent: "Mobile", expected: "qr-scanner-non-mobile" },
        { userAgent: "iPhone Mobile", expected: "qr-scanner-mobile" },
        { userAgent: "Desktop", expected: "qr-scanner-non-mobile" }
    ]) {
        const classes = new Set();
        let camera;
        let stopped = false;
        let cleared = false;
        const sandbox = {
            navigator: client,
            document: { getElementById: id => {
                assert.equal(id, "reader");
                return { classList: {
                    add: name => classes.add(name),
                    remove: (...names) => names.forEach(name => classes.delete(name))
                }};
            }},
            Html5Qrcode: class {
                constructor(id) { assert.equal(id, "reader"); }
                async start(constraints, config, decoded) {
                    camera = constraints.facingMode;
                    assert.ok(config.fps > 0);
                    decoded("MEA1234");
                }
                async stop() { stopped = true; }
                clear() { cleared = true; }
            }
        };
        runInNewContext(interopSource.replaceAll("export function", "function"), sandbox);
        assert.equal(await sandbox.StartQrScanner(), "MEA1234");
        assert.equal(camera, "environment");
        assert.deepEqual([...classes], [client.expected]);
        assert.equal(stopped, true);
        assert.equal(cleared, true);
    }
});

function createZoomTestSandbox({ zoomCapabilities = null, decodeImmediately = false } = {}) {
    const insertedElements = [];
    const createdSliders = [];
    let stopped = false;
    let cleared = false;
    let decodeCallback = null;

    const reader = {
        classList: {
            add: () => {},
            remove: () => {}
        },
        insertAdjacentElement: (position, element) => {
            insertedElements.push({ position, element });
        }
    };

    const sandbox = {
        navigator: { userAgent: "Desktop" },
        document: {
            getElementById: id => {
                assert.equal(id, "reader");
                return reader;
            },
            createElement: tagName => {
                assert.equal(tagName, "input");
                const slider = {
                    removed: false,
                    addEventListener(event, callback) {
                        this[`on${event}`] = callback;
                    },
                    remove() {
                        slider.removed = true;
                    }
                };
                createdSliders.push(slider);
                return slider;
            }
        },
        Html5Qrcode: class {
            constructor(id) { assert.equal(id, "reader"); }
            async start(constraints, config, decoded) {
                decodeCallback = decoded;
                if (decodeImmediately) {
                    decoded("MEA1234");
                }
            }
            async stop() { stopped = true; }
            clear() { cleared = true; }
            getRunningTrackCapabilities() {
                return zoomCapabilities ? { zoom: zoomCapabilities } : {};
            }
            applyVideoConstraints(constraints) {
                sandbox.appliedConstraints.push(constraints);
            }
        },
        appliedConstraints: []
    };

    return {
        sandbox,
        insertedElements,
        createdSliders,
        getStopped: () => stopped,
        getCleared: () => cleared,
        decode: value => decodeCallback(value)
    };
}

// [OpenSpecScenario("measurement-photos", "Phone-based photo upload", "Zoom control shown when the camera supports zoom")]
test("StartQrScanner shows a zoom slider bounded by the camera's reported zoom capability", async () => {
    const { runInNewContext } = await import("node:vm");
    const interopModuleSource = interopSource.replaceAll("export function", "function");
    const harness = createZoomTestSandbox({ zoomCapabilities: { min: 1, max: 5, step: 0.5 } });
    runInNewContext(interopModuleSource, harness.sandbox);

    harness.sandbox.StartQrScanner();
    await new Promise(resolve => setImmediate(resolve));

    assert.equal(harness.insertedElements.length, 1);
    assert.equal(harness.insertedElements[0].position, "afterend");
    const slider = harness.insertedElements[0].element;
    assert.equal(slider.min, 1);
    assert.equal(slider.max, 5);
    assert.equal(slider.step, 0.5);
    assert.equal(slider.value, 1);
});

// [OpenSpecScenario("measurement-photos", "Phone-based photo upload", "Zoom control absent when the camera does not support zoom")]
test("StartQrScanner shows no zoom slider when the camera reports no zoom capability, and scanning still resolves as before", async () => {
    const { runInNewContext } = await import("node:vm");
    const interopModuleSource = interopSource.replaceAll("export function", "function");
    const harness = createZoomTestSandbox({ zoomCapabilities: null, decodeImmediately: true });
    runInNewContext(interopModuleSource, harness.sandbox);

    const result = await harness.sandbox.StartQrScanner();

    assert.equal(result, "MEA1234");
    assert.equal(harness.getStopped(), true);
    assert.equal(harness.getCleared(), true);
    assert.equal(harness.insertedElements.length, 0);
});

// [OpenSpecScenario("measurement-photos", "Phone-based photo upload", "Adjusting the zoom control changes the live preview")]
test("Adjusting the zoom slider applies the corresponding zoom constraint to the running camera track", async () => {
    const { runInNewContext } = await import("node:vm");
    const interopModuleSource = interopSource.replaceAll("export function", "function");
    const harness = createZoomTestSandbox({ zoomCapabilities: { min: 1, max: 5, step: 0.5 } });
    runInNewContext(interopModuleSource, harness.sandbox);

    harness.sandbox.StartQrScanner();
    await new Promise(resolve => setImmediate(resolve));

    const slider = harness.createdSliders[0];
    slider.value = 3;
    slider.oninput();

    assert.equal(harness.sandbox.appliedConstraints.length, 1);
    assert.equal(harness.sandbox.appliedConstraints[0].advanced[0].zoom, 3);
});

test("StartQrScanner removes the zoom slider once a barcode is decoded", async () => {
    const { runInNewContext } = await import("node:vm");
    const interopModuleSource = interopSource.replaceAll("export function", "function");
    const harness = createZoomTestSandbox({ zoomCapabilities: { min: 1, max: 5, step: 0.5 } });
    runInNewContext(interopModuleSource, harness.sandbox);

    const scanPromise = harness.sandbox.StartQrScanner();
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(harness.createdSliders.length, 1);

    harness.decode("MEA5678");
    await scanPromise;

    assert.equal(harness.createdSliders[0].removed, true);
});
