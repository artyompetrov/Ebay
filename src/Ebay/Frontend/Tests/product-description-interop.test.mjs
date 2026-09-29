import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const interopSourceUrl = new URL("../wwwroot/js/interop.js", import.meta.url);
const interopSource = await readFile(interopSourceUrl, "utf8");
const interopModuleSource = interopSource.replaceAll("export function", "function");

function createSandbox() {
    const headChildren = [];
    const container = { id: "editor" };
    const sandbox = {
        document: {
            head: {
                appendChild: element => headChildren.push(element)
            },
            createElement: tagName => ({ tagName }),
            getElementById: id => (id === "editor" ? container : null)
        }
    };

    return { sandbox, headChildren, container };
}

test("InitProductDescriptionEditor waits for the Quill script to finish loading before constructing the editor", async () => {
    const { runInNewContext } = await import("node:vm");
    const { sandbox, headChildren, container } = createSandbox();

    let constructedWith = null;
    class FakeQuill {
        constructor(target, options) {
            constructedWith = { target, options };
        }

        get clipboard() {
            return { dangerouslyPasteHTML: () => {} };
        }
    }

    runInNewContext(interopModuleSource, sandbox);

    const initPromise = sandbox.InitProductDescriptionEditor("editor", "");

    // The Quill script has not "loaded" yet - constructing the editor now would hit
    // a ReferenceError in a real browser, so nothing should be constructed yet.
    assert.equal(constructedWith, null);

    const scriptTag = headChildren.find(element => element.tagName === "script");
    assert.ok(scriptTag, "expected a <script> tag to have been appended");

    sandbox.Quill = FakeQuill;
    scriptTag.onload();

    await initPromise;

    assert.ok(constructedWith);
    assert.equal(constructedWith.target, container);
});

test("GetProductDescriptionEditorHtml returns an empty string for Quill's empty-document placeholder", async () => {
    const { runInNewContext } = await import("node:vm");
    const { sandbox } = createSandbox();

    class FakeEmptyQuill {
        constructor() {
            this.root = { innerHTML: "<p><br></p>" };
        }

        getLength() {
            return 1;
        }

        get clipboard() {
            return { dangerouslyPasteHTML: () => {} };
        }
    }
    sandbox.Quill = FakeEmptyQuill;

    runInNewContext(interopModuleSource, sandbox);
    await sandbox.InitProductDescriptionEditor("editor", "");

    assert.equal(sandbox.GetProductDescriptionEditorHtml("editor"), "");
});

test("GetProductDescriptionEditorHtml returns the editor's HTML when it holds real content", async () => {
    const { runInNewContext } = await import("node:vm");
    const { sandbox } = createSandbox();

    class FakeFilledQuill {
        constructor() {
            this.root = { innerHTML: "<p>Hello</p>" };
        }

        getLength() {
            return 6;
        }

        get clipboard() {
            return { dangerouslyPasteHTML: () => {} };
        }
    }
    sandbox.Quill = FakeFilledQuill;

    runInNewContext(interopModuleSource, sandbox);
    await sandbox.InitProductDescriptionEditor("editor", "");

    assert.equal(sandbox.GetProductDescriptionEditorHtml("editor"), "<p>Hello</p>");
});
