import { test } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { PageTelemetry } from '../src/infrastructure/telemetry/PageTelemetry.ts';
import { observeLongFrames, traceClicks } from '../src/infrastructure/telemetry/PageObservers.ts';
import type { LongFrameEntry } from '../src/infrastructure/telemetry/PageObservers.ts';
import type { SpanRecord, TelemetryBatchMessage } from '../src/infrastructure/telemetry/TelemetryTypes.ts';

const TimeOrigin = 1_700_000_000_000;
const ExtensionUrl = 'chrome-extension://mlebgdemjnpnfgcgbbncllpniiicffbm/';

function createPage() {
    let seed = 0;
    const sent: TelemetryBatchMessage[] = [];
    const telemetry = new PageTelemetry({
        randomBytes: (count: number) => new Uint8Array(count).map(() => (++seed) % 256),
        now: () => TimeOrigin + 5000,
        send: (message: TelemetryBatchMessage) => sent.push(message),
        schedule: () => {}
    });
    telemetry.activate();
    const root = telemetry.startPageSpan('page EbaySiteProcessor', TimeOrigin);
    return {
        telemetry,
        root,
        spans: (): SpanRecord[] => {
            telemetry.flush();
            return sent.flatMap(message => message.spans);
        }
    };
}

function frames(page: ReturnType<typeof createPage>, entries: LongFrameEntry[]): SpanRecord[] {
    observeLongFrames(page.telemetry, TimeOrigin, ExtensionUrl, onEntries => onEntries(entries));
    return page.spans().filter(span => span.name === 'long animation frame');
}

// [OpenSpecScenario("client-telemetry", "Extension slow frames and panel interactions are traced", "A long frame caused by the extension is recorded")]
test('a long frame in which an extension script ran is a span of the page trace marked as extension work', () => {
    const page = createPage();

    const [frame] = frames(page, [{
        startTime: 1200,
        duration: 180,
        blockingDuration: 130,
        scripts: [{ sourceURL: 'https://www.ebay.com/static/app.js' }, { sourceURL: `${ExtensionUrl}build/ebay.js` }]
    }]);

    assert.equal(frame.traceId, page.root.context.traceId);
    assert.equal(frame.startTime, TimeOrigin + 1200);
    assert.equal(frame.endTime, TimeOrigin + 1380);
    assert.equal(frame.attributes['frame.duration_ms'], 180);
    assert.equal(frame.attributes['frame.blocking_duration_ms'], 130);
    assert.equal(frame.attributes['extension.script'], true);
});

test('frames of 50 ms or less are not recorded and frames of the site alone are marked as such', () => {
    const page = createPage();

    const recorded = frames(page, [
        { startTime: 10, duration: 50, scripts: [{ sourceURL: `${ExtensionUrl}build/ebay.js` }] },
        { startTime: 100, duration: 90, scripts: [{ sourceURL: 'https://www.ebay.com/static/app.js' }] }
    ]);

    assert.equal(recorded.length, 1);
    assert.equal(recorded[0].attributes['extension.script'], false);
});

test('a long frame after the page root ended is a trace of its own linked to the page', () => {
    const page = createPage();
    page.root.end();

    const [frame] = frames(page, [{ startTime: 9000, duration: 80, scripts: [{ sourceURL: `${ExtensionUrl}build/ebay.js` }] }]);

    assert.notEqual(frame.traceId, page.root.context.traceId);
    assert.equal(frame.parentSpanId, undefined);
    assert.deepEqual(frame.links, [page.root.context]);
});

// [OpenSpecScenario("client-telemetry", "Extension slow frames and panel interactions are traced", "A frame of the site alone after the page was processed is not recorded")]
test('after the page root ended, frames in which no extension script ran are not recorded', () => {
    const page = createPage();
    page.root.end();

    const recorded = frames(page, [{ startTime: 9000, duration: 300, scripts: [{ sourceURL: 'https://www.ebay.com/static/app.js' }] }]);

    assert.equal(recorded.length, 0);
});

test('at most 60 long frames a minute are recorded', () => {
    const page = createPage();

    const recorded = frames(page, Array.from({ length: 70 }, (_, i) => ({ startTime: i * 100, duration: 60 })));

    assert.equal(recorded.length, 60);
});

// [OpenSpecScenario("client-telemetry", "Extension slow frames and panel interactions are traced", "A panel button click is a span without values")]
test('a click on a panel button is a span named after its id that carries no entered value', () => {
    const page = createPage();
    const dom = new JSDOM('<!doctype html><body><div id="panel"><input id="price"><input id="submit-lot" type="button"></div></body>');
    const document = dom.window.document;
    const panel = document.getElementById('panel')!;
    traceClicks(page.telemetry, panel);

    (document.getElementById('price') as HTMLInputElement).value = '1234.56';
    document.getElementById('submit-lot')!.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));

    const clicks = page.spans().filter(span => span.name.startsWith('click '));
    assert.deepEqual(clicks.map(span => span.name), ['click submit-lot']);
    assert.equal(JSON.stringify(clicks).includes('1234.56'), false);
});
