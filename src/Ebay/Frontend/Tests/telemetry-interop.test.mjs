import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const interopSourceUrl = new URL("../wwwroot/js/interop.js", import.meta.url);
const interopSource = await readFile(interopSourceUrl, "utf8");
const interopModuleUrl = `data:text/javascript;base64,${Buffer.from(interopSource).toString("base64")}`;
const { BootTimingOf, ClickTargetId, ErrorOf } = await import(interopModuleUrl);

function element(id, parent = null) {
    return {
        id,
        closest(selector) {
            assert.equal(selector, "[id]");
            for (let current = this; current; current = current.parent) {
                if (current.id) {
                    return current;
                }
            }
            return null;
        },
        parent
    };
}

test("ClickTargetId names a click after the nearest element with an id", () => {
    const button = element("save-lot", element("app"));
    const icon = { ...element("", button), parent: button };

    assert.equal(ClickTargetId(icon), "save-lot");
});

test("ClickTargetId ignores clicks that only reach the app root", () => {
    assert.equal(ClickTargetId(element("", element("app"))), null);
    assert.equal(ClickTargetId(null), null);
});

test("ErrorOf keeps the type, message and stack of an error and stringifies any other reason", () => {
    const error = new TypeError("bad value");

    assert.deepEqual(ErrorOf(error), { type: "TypeError", message: "bad value", stack: error.stack });
    assert.deepEqual(ErrorOf("plain reason"), { type: "string", message: "plain reason", stack: null });
});

test("BootTimingOf converts navigation and framework resource times to epoch milliseconds", () => {
    const timing = BootTimingOf(
        { responseEnd: 100, domContentLoadedEventEnd: 300 },
        [
            { name: "https://app/_framework/dotnet.js", startTime: 400, responseEnd: 500, transferSize: 10 },
            { name: "https://app/_framework/Frontend.wasm", startTime: 450, responseEnd: 900, transferSize: 0, encodedBodySize: 20 },
            { name: "https://app/css/app.css", startTime: 50, responseEnd: 2000, transferSize: 99 }
        ],
        1000);

    assert.deepEqual(timing, {
        responseEnd: 1100,
        domContentLoaded: 1300,
        frameworkResources: 2,
        frameworkBytes: 30,
        frameworkStart: 1400,
        frameworkEnd: 1900
    });
});

test("BootTimingOf leaves times the browser does not know yet empty", () => {
    assert.deepEqual(BootTimingOf(undefined, [], 1000), {
        responseEnd: null,
        domContentLoaded: null,
        frameworkResources: 0,
        frameworkBytes: 0,
        frameworkStart: null,
        frameworkEnd: null
    });
});
