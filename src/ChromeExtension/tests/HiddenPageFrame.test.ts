import { test } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { PageTelemetry } from '../src/infrastructure/telemetry/PageTelemetry.ts';
import { Logger } from '../src/infrastructure/telemetry/Logger.ts';
import { loadHiddenPageFrame } from '../src/siteProcessors/ebay/HiddenPageFrame.ts';
import type { SpanRecord, TelemetryBatchMessage } from '../src/infrastructure/telemetry/TelemetryTypes.ts';

const quietConsole = { debug: () => {}, log: () => {}, warn: () => {}, error: () => {} };

function createPage() {
    let seed = 0;
    let clock = 1_700_000_000_000;
    const sent: TelemetryBatchMessage[] = [];
    const telemetry = new PageTelemetry({
        randomBytes: (count: number) => new Uint8Array(count).map(() => (++seed) % 256),
        now: () => clock,
        send: (message: TelemetryBatchMessage) => sent.push(message),
        schedule: () => {}
    });
    telemetry.activate();
    telemetry.startPageSpan('page EbaySiteProcessor', clock - 1000);
    return {
        telemetry,
        logger: new Logger(telemetry, quietConsole),
        advance: (ms: number) => { clock += ms; },
        now: () => clock,
        spans: (): SpanRecord[] => {
            telemetry.flush();
            return sent.flatMap(message => message.spans);
        }
    };
}

// [OpenSpecScenario("client-telemetry", "Extension waits and lookups are traced", "Loading a hidden eBay page is a span with its load time")]
test('a hidden eBay page is a span from creating its frame until it was read, with the load time as an event', async () => {
    const page = createPage();
    const document = new JSDOM('<!doctype html><body></body>').window.document;
    const createdAt = page.now();
    let readFinished: () => void = () => {};
    const read = new Promise<void>(resolve => { readFinished = resolve; });

    loadHiddenPageFrame(document, page.telemetry, page.logger, {
        id: 'PurchaseHistoryFrame',
        url: 'https://www.ebay.com/bin/purchaseHistory?item=336773590471',
        spanName: 'iframe purchase history',
        read: async () => {
            page.advance(300);
            readFinished();
        }
    });
    const iframe = document.getElementById('PurchaseHistoryFrame') as HTMLIFrameElement;
    page.advance(6500);
    const loadedAt = page.now();
    iframe.dispatchEvent(new document.defaultView!.Event('load'));
    await read;
    await new Promise(resolve => setImmediate(resolve));

    const span = page.spans().find(s => s.name === 'iframe purchase history')!;
    assert.equal(span.startTime, createdAt);
    assert.equal(span.endTime, loadedAt + 300);
    assert.deepEqual(span.events.map(event => [event.name, event.time]), [['load', loadedAt]]);
    assert.equal(span.attributes['url.path'], '/bin/purchaseHistory', 'the query string is not recorded');
});

test('a frame is created only once per page', () => {
    const page = createPage();
    const document = new JSDOM('<!doctype html><body></body>').window.document;
    const frame = { id: 'UpdateTitleDateFrame', url: 'https://www.ebay.com/rvh/1', spanName: 'iframe revision history', read: async () => {} };

    loadHiddenPageFrame(document, page.telemetry, page.logger, frame);
    loadHiddenPageFrame(document, page.telemetry, page.logger, frame);

    assert.equal(document.querySelectorAll('iframe').length, 1);
});
