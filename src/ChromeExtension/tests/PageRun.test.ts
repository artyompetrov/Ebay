import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PageTelemetry } from '../src/infrastructure/telemetry/PageTelemetry.ts';
import type { TelemetrySpan } from '../src/infrastructure/telemetry/PageTelemetry.ts';
import { runPage } from '../src/PageRun.ts';
import type { PageRunEnvironment } from '../src/PageRun.ts';
import type { TelemetryBatchMessage } from '../src/infrastructure/telemetry/TelemetryTypes.ts';

const TimeOrigin = 1_700_000_000_000;

function createTelemetry() {
    let counter = 0;
    let clock = TimeOrigin + 500;
    const sent: TelemetryBatchMessage[] = [];
    const telemetry = new PageTelemetry({
        randomBytes: (count: number) => new Uint8Array(count).map(() => (++counter) % 256),
        now: () => clock++,
        send: (message: TelemetryBatchMessage) => sent.push(message),
        schedule: () => {}
    });
    return { telemetry, sent };
}

function environment(telemetry: PageTelemetry, overrides: Partial<PageRunEnvironment> = {}): PageRunEnvironment & { updateChecks: number } {
    const env = {
        telemetry,
        timeOrigin: TimeOrigin,
        scriptStart: TimeOrigin + 300,
        navigationTiming: { responseEnd: 120, domContentLoadedEventEnd: 450, loadEventEnd: 0 },
        pageAttributes: { 'url.path': '/itm/158345271749', 'server.address': 'www.ebay.com' },
        updateChecks: 0,
        checkForUpdates: async () => {
            env.updateChecks++;
            return true;
        },
        onNoProcessors: () => {},
        onProcessorsMatched: () => {},
        ...overrides
    };
    return env;
}

function processor(name: string, work: (span: TelemetrySpan) => void = () => {}) {
    return { name, breakAfterSearchProcessor: false, run: async (span: TelemetrySpan) => work(span) };
}

// [OpenSpecScenario("client-telemetry", "Extension telemetry is gated on a matched page handler", "An unrelated page produces no telemetry and no backend call")]
test('a page without matching processors sends no telemetry and does not check for updates', async () => {
    const { telemetry, sent } = createTelemetry();
    const env = environment(telemetry);

    telemetry.log(9, 'written before matching');
    await runPage([], env);
    telemetry.unload();

    assert.equal(env.updateChecks, 0);
    assert.equal(sent.length, 0);
});

// [OpenSpecScenario("client-telemetry", "Extension page reaction is traced from navigation start", "The root span starts at navigation start")]
test('the page root span starts at navigation start and carries the navigation and match events', async () => {
    const { telemetry, sent } = createTelemetry();

    await runPage([processor('EbaySiteProcessor')], environment(telemetry));
    telemetry.flush();

    const spans = sent.flatMap(message => message.spans);
    const root = spans.find(span => span.parentSpanId === undefined)!;
    assert.equal(root.name, 'page EbaySiteProcessor');
    assert.equal(root.startTime, TimeOrigin);
    assert.equal(root.attributes['url.path'], '/itm/158345271749');
    const events = new Map(root.events.map(event => [event.name, event]));
    assert.equal(events.get('responseEnd')!.time, TimeOrigin + 120);
    assert.equal(events.get('domContentLoaded')!.time, TimeOrigin + 450);
    assert.equal(events.has('load'), false, 'not reached yet');
    assert.equal(events.get('extension.script_start')!.time, TimeOrigin + 300);
    assert.equal(events.get('extension.handler_matched')!.attributes['extension.processors'], 'EbaySiteProcessor');
});

test('the update check and every processor run are child spans of the page root', async () => {
    const { telemetry, sent } = createTelemetry();
    const env = environment(telemetry);

    await runPage([processor('EbaySiteProcessor'), processor('SearchSitesProcessor')], env);
    telemetry.flush();

    const spans = sent.flatMap(message => message.spans);
    const root = spans.find(span => span.parentSpanId === undefined)!;
    const children = spans.filter(span => span.parentSpanId === root.spanId).map(span => span.name);
    assert.deepEqual(children, ['update check', 'processor EbaySiteProcessor', 'processor SearchSitesProcessor']);
    assert.equal(env.updateChecks, 1);
});

test('processors do not run when a newer extension version is available', async () => {
    const { telemetry } = createTelemetry();
    let ran = false;

    await runPage([processor('EbaySiteProcessor', () => { ran = true; })], environment(telemetry, { checkForUpdates: async () => false }));

    assert.equal(ran, false);
});
