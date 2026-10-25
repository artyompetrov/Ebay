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
        navigationTiming: { responseStart: 80, responseEnd: 120, domContentLoadedEventEnd: 0, loadEventEnd: 0 },
        onLaterMilestone: (callback: (name: string, time: number) => void) => {
            callback('domContentLoaded', TimeOrigin + 450);
        },
        pagePath: '/itm/158345271749',
        pageAttributes: { 'server.address': 'www.ebay.com' },
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

function processor(name: string, work: (span: TelemetrySpan) => void = () => {}, recordsPagePath?: boolean) {
    return { name, breakAfterSearchProcessor: false, recordsPagePath, run: async (span: TelemetrySpan) => work(span) };
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

// [OpenSpecScenario("client-telemetry", "Pages handled on any site record only their host", "A lot page keeps its path")]
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
    assert.equal(events.get('responseStart')!.time, TimeOrigin + 80);
    assert.equal(events.get('responseEnd')!.time, TimeOrigin + 120);
    assert.equal(events.get('domContentLoaded')!.time, TimeOrigin + 450, 'reached after the script started');
    assert.equal(events.has('load'), false, 'not reached yet');
    assert.equal(events.get('extension.script_start')!.time, TimeOrigin + 300);
    assert.equal(events.get('extension.handler_matched')!.attributes['extension.processors'], 'EbaySiteProcessor');
});

// [OpenSpecScenario("client-telemetry", "Pages handled on any site record only their host", "A page matched only by the search-site highlighting has no path")]
test('a page handled only by a processor that runs on any site records its host but not its path', async () => {
    const { telemetry, sent } = createTelemetry();

    await runPage([processor('SearchSitesProcessor', () => {}, false)], environment(telemetry));
    telemetry.flush();

    const root = sent.flatMap(message => message.spans).find(span => span.parentSpanId === undefined)!;
    assert.equal(root.attributes['server.address'], 'www.ebay.com');
    assert.equal('url.path' in root.attributes, false);
});

// [OpenSpecScenario("client-telemetry", "Extension page reaction is traced from navigation start", "Response times unknown at document start are added later")]
test('response times unknown at document start are added when they become known', async () => {
    const { telemetry, sent } = createTelemetry();

    await runPage([processor('EbaySiteProcessor')], environment(telemetry, {
        navigationTiming: undefined,
        onLaterMilestone: (callback: (name: string, time: number) => void) => {
            callback('responseStart', TimeOrigin + 900);
            callback('responseEnd', TimeOrigin + 1400);
            callback('load', TimeOrigin + 5000);
        }
    }));
    telemetry.flush();

    const root = sent.flatMap(message => message.spans).find(span => span.parentSpanId === undefined)!;
    assert.deepEqual(root.events.filter(event => event.name.startsWith('response') || event.name === 'load').map(event => [event.name, event.time]),
        [['responseStart', TimeOrigin + 900], ['responseEnd', TimeOrigin + 1400], ['load', TimeOrigin + 5000]]);
});

test('the HTTP call of the update check is a child of the update check span', async () => {
    const { telemetry, sent } = createTelemetry();

    await runPage([processor('EbaySiteProcessor')], environment(telemetry, {
        checkForUpdates: async () => {
            telemetry.startSpan('GET /chrome_extensions/x.xml', { kind: 2 }).end();
            return true;
        }
    }));
    telemetry.flush();

    const spans = sent.flatMap(message => message.spans);
    const check = spans.find(span => span.name === 'update check')!;
    assert.equal(spans.find(span => span.name.startsWith('GET'))!.parentSpanId, check.spanId);
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
