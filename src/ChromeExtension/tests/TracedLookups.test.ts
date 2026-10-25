import { test } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { PageTelemetry } from '../src/infrastructure/telemetry/PageTelemetry.ts';
import { cachedOrFallback, waitForElement } from '../src/infrastructure/telemetry/TracedLookups.ts';
import type { CachedData } from '../src/infrastructure/telemetry/TracedLookups.ts';
import { showLotPanel } from '../src/siteProcessors/ebay/LotPanel.ts';
import type { SpanRecord, TelemetryBatchMessage } from '../src/infrastructure/telemetry/TelemetryTypes.ts';

const Now = 1_700_000_000_000;

function createPage() {
    let seed = 0;
    const sent: TelemetryBatchMessage[] = [];
    const telemetry = new PageTelemetry({
        randomBytes: (count: number) => new Uint8Array(count).map(() => (++seed) % 256),
        now: () => Now,
        send: (message: TelemetryBatchMessage) => sent.push(message),
        schedule: () => {}
    });
    telemetry.activate();
    const root = telemetry.startPageSpan('page EbaySiteProcessor', Now - 1000);
    return {
        telemetry,
        root,
        spans: (): SpanRecord[] => {
            telemetry.flush();
            return sent.flatMap(message => message.spans);
        }
    };
}

// [OpenSpecScenario("client-telemetry", "Extension waits and lookups are traced", "Waiting for an element is a span")]
test('waiting for the footer is a span under the processor span with the selector and the attempts', async () => {
    const page = createPage();
    const document = new JSDOM('<!doctype html><body></body>').window.document;
    const processor = page.telemetry.startSpan('processor EbaySiteProcessor');
    let polls = 0;

    const footer = await page.telemetry.withDefaultParent(processor, () =>
        waitForElement(page.telemetry, 'footer', document, false, async () => {
            if (++polls === 2) {
                document.body.appendChild(document.createElement('footer'));
            }
        }));
    processor.end();

    assert.equal(footer.tagName, 'FOOTER');
    const wait = page.spans().find(span => span.name === 'wait footer')!;
    assert.equal(wait.parentSpanId, processor.context.spanId);
    assert.equal(wait.attributes['dom.selector'], 'footer');
    assert.equal(wait.attributes['dom.attempts'], 3);
});

test('a wait that never finds its element fails its span', async () => {
    const page = createPage();
    const document = new JSDOM('<!doctype html><body></body>').window.document;

    await assert.rejects(waitForElement(page.telemetry, '#missing', document, false, async () => {}), /unable to find element/);

    const wait = page.spans().find(span => span.name === 'wait #missing')!;
    assert.equal(wait.status, 2);
});

// [OpenSpecScenario("client-telemetry", "Extension waits and lookups are traced", "A cache lookup records the hit")]
test('a fresh cached value is returned from a cache span with cache.hit true', async () => {
    const page = createPage();
    const cached: CachedData<number> = { value: 42, expirationTime: Now + 1 };
    let fallbackCalls = 0;

    const value = await cachedOrFallback(page.telemetry, 'targetCurrency', {
        read: async () => cached,
        write: () => {}
    }, async () => { fallbackCalls++; return 0; }, 60, () => Now);

    assert.equal(value, 42);
    assert.equal(fallbackCalls, 0);
    const span = page.spans().find(s => s.name === 'cache targetCurrency')!;
    assert.equal(span.attributes['cache.hit'], true);
});

test('an expired cached value is produced again inside the cache span and stored', async () => {
    const page = createPage();
    const written: CachedData<number>[] = [];

    const value = await cachedOrFallback(page.telemetry, 'targetCurrency', {
        read: async () => ({ value: 1, expirationTime: Now - 1 }),
        write: (_key: string, data: CachedData<number>) => written.push(data)
    }, async () => {
        page.telemetry.startSpan('GET /api/ebay/v1/currencies').end();
        return 7;
    }, 60, () => Now);

    assert.equal(value, 7);
    assert.deepEqual(written, [{ value: 7, expirationTime: Now + 60_000 }]);
    const spans = page.spans();
    const cacheSpan = spans.find(s => s.name === 'cache targetCurrency')!;
    assert.equal(cacheSpan.attributes['cache.hit'], false);
});

// [OpenSpecScenario("client-telemetry", "Extension page reaction is traced from navigation start", "Showing the lot panel is a root span event")]
test('showing the lot panel adds one panel.shown event to the page root span', () => {
    const page = createPage();
    const document = new JSDOM('<!doctype html><body><div hidden></div></body>').window.document;
    const panel = document.querySelector('div') as HTMLElement;

    showLotPanel(panel, page.root);
    showLotPanel(panel, page.root);
    page.root.end();

    assert.equal(panel.hidden, false);
    const root = page.spans().find(span => span.name === 'page EbaySiteProcessor')!;
    assert.deepEqual(root.events.map(event => event.name), ['panel.shown']);
});
