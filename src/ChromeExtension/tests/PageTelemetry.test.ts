import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PageTelemetry, Severity, scrubText } from '../src/infrastructure/telemetry/PageTelemetry.ts';
import type { TelemetryBatchMessage } from '../src/infrastructure/telemetry/TelemetryTypes.ts';

interface Harness {
    telemetry: PageTelemetry;
    sent: TelemetryBatchMessage[];
    runScheduled: () => void;
    advance: (ms: number) => void;
}

function createHarness(): Harness {
    let counter = 0;
    let clock = 1_700_000_000_000;
    const sent: TelemetryBatchMessage[] = [];
    const scheduled: (() => void)[] = [];
    const telemetry = new PageTelemetry({
        randomBytes: (count: number) => new Uint8Array(count).map(() => (++counter) % 256),
        now: () => clock,
        send: (message: TelemetryBatchMessage) => sent.push(message),
        schedule: (callback: () => void) => scheduled.push(callback)
    });
    return {
        telemetry,
        sent,
        runScheduled: () => scheduled.splice(0).forEach(callback => callback()),
        advance: (ms: number) => { clock += ms; }
    };
}

// [OpenSpecScenario("client-telemetry", "Extension telemetry is gated on a matched page handler", "Early records are kept for a matched page")]
test('a log written before the handler matched is sent in the page trace after activation', () => {
    const { telemetry, sent, runScheduled } = createHarness();

    telemetry.log(Severity.Information, 'early record');
    runScheduled();
    assert.equal(sent.length, 0, 'nothing leaves the tab before a handler matched');

    telemetry.activate();
    const root = telemetry.startPageSpan('page EbaySiteProcessor', 1_699_999_999_000);
    root.end();
    runScheduled();

    const logs = sent.flatMap(message => message.logs);
    const spans = sent.flatMap(message => message.spans);
    assert.equal(logs.length, 1);
    assert.equal(logs[0].message, 'early record');
    assert.equal(spans.length, 1);
    assert.equal(logs[0].traceId, root.context.traceId);
});

test('records of a page no handler matched are discarded and never sent', () => {
    const { telemetry, sent, runScheduled } = createHarness();

    telemetry.log(Severity.Information, 'early record');
    telemetry.discard();
    telemetry.log(Severity.Error, 'later record');
    telemetry.flush();
    runScheduled();

    assert.equal(sent.length, 0);
});

// [OpenSpecScenario("client-telemetry", "Pending telemetry leaves the page when it is hidden", "Extension records leave the tab when it is hidden")]
test('flush on hide hands pending records over at once and keeps the root span open', () => {
    const { telemetry, sent } = createHarness();
    telemetry.activate();
    const root = telemetry.startPageSpan('page EbaySiteProcessor', 1_699_999_999_000);
    telemetry.startSpan('wait footer').end();

    telemetry.flush();

    assert.equal(sent.length, 1);
    assert.deepEqual(sent[0].spans.map(span => span.name), ['wait footer']);
    assert.equal(root.isEnded, false);
});

// [OpenSpecScenario("client-telemetry", "Pending telemetry leaves the page when it is hidden", "An unloaded page ends its root span")]
test('unload ends the open root span and hands it over at once', () => {
    const { telemetry, sent } = createHarness();
    telemetry.activate();
    telemetry.startPageSpan('page EbaySiteProcessor', 1_699_999_999_000);

    telemetry.unload();

    assert.equal(sent.length, 1);
    const [root] = sent[0].spans;
    assert.equal(root.name, 'page EbaySiteProcessor');
    assert.equal(root.attributes['page.unloaded'], true);
});

test('spans without an explicit parent join the page trace under the root span', () => {
    const { telemetry, sent } = createHarness();
    telemetry.activate();
    const root = telemetry.startPageSpan('page', 1);
    const child = telemetry.startSpan('processor');
    const grandChild = telemetry.startSpan('wait', { parent: child });
    const newTrace = telemetry.startSpan('poll', { parent: null, links: [root.context] });
    [grandChild, child, newTrace, root].forEach(span => span.end());

    telemetry.flush();

    const byName = new Map(sent[0].spans.map(span => [span.name, span]));
    assert.equal(byName.get('processor')!.traceId, root.context.traceId);
    assert.equal(byName.get('processor')!.parentSpanId, root.context.spanId);
    assert.equal(byName.get('wait')!.parentSpanId, child.context.spanId);
    assert.notEqual(byName.get('poll')!.traceId, root.context.traceId);
    assert.equal(byName.get('poll')!.parentSpanId, undefined);
    assert.deepEqual(byName.get('poll')!.links, [root.context]);
});

test('withSpan records a thrown error on the span and rethrows it', async () => {
    const { telemetry, sent } = createHarness();
    telemetry.activate();

    await assert.rejects(telemetry.withSpan('processor', { parent: null }, () => {
        throw new TypeError('boom');
    }), /boom/);
    telemetry.flush();

    const [span] = sent[0].spans;
    assert.equal(span.status, 2);
    assert.equal(span.events[0].name, 'exception');
    assert.equal(span.events[0].attributes['exception.type'], 'TypeError');
    assert.equal(span.events[0].attributes['exception.message'], 'boom');
});

test('records are sent once 50 are pending without waiting for the timer', () => {
    const { telemetry, sent } = createHarness();
    telemetry.activate();

    for (let i = 0; i < 50; i++) {
        telemetry.log(Severity.Debug, `record ${i}`);
    }

    assert.equal(sent.length, 1);
    assert.equal(sent[0].logs.length, 50);
});

test('traceparent names the given span as sampled parent', () => {
    const { telemetry } = createHarness();
    const span = telemetry.startSpan('GET', { parent: null });

    const [version, traceId, spanId, flags] = telemetry.traceParent(span).split('-');

    assert.equal(version, '00');
    assert.equal(traceId, span.context.traceId);
    assert.equal(spanId, span.context.spanId);
    assert.equal(flags, '01');
    assert.match(traceId, /^[0-9a-f]{32}$/);
    assert.match(spanId, /^[0-9a-f]{16}$/);
});

test('query strings, fragments and bearer tokens are removed from recorded text', () => {
    assert.equal(
        scrubText('GET https://backend.test/api/lots?code=secret-code#frag answered with Bearer abc.def-ghi'),
        'GET https://backend.test/api/lots answered with Bearer [redacted]');
});

test('OAuth codes and tokens are removed from form and JSON bodies', () => {
    assert.equal(
        scrubText('grant_type=authorization_code&code=SplxlOBe&code_verifier=dBjftJeZ&client_id=Ebay.ChromeExtension'),
        'grant_type=authorization_code&code=[redacted]&code_verifier=[redacted]&client_id=Ebay.ChromeExtension');
    assert.equal(
        scrubText('{"access_token":"eyJhbGci","token_type":"Bearer","refresh_token":"8xLOxBtZ","status_code":500}'),
        '{"access_token":"[redacted]","token_type":"Bearer","refresh_token":"[redacted]","status_code":500}');
});

test('work started after an interleaved default parent ended goes under the page root', async () => {
    const { telemetry } = createHarness();
    telemetry.activate();
    const root = telemetry.startPageSpan('page', 1);
    const submit = telemetry.startSpan('submit lot', { parent: null });

    let release: () => void = () => {};
    const running = telemetry.withDefaultParent(submit, () => new Promise<void>(resolve => { release = resolve; }));
    submit.end();

    assert.equal(telemetry.currentSpan, root);
    release();
    await running;
});

test('attribute values and messages are scrubbed and cut to 4096 characters', () => {
    const { telemetry, sent } = createHarness();
    telemetry.activate();

    telemetry.log(Severity.Information, 'x'.repeat(5000), { 'url.full': 'https://shop.test/search?q=6p14p' });
    telemetry.flush();

    const [log] = sent[0].logs;
    assert.equal(log.message.length, 4096);
    assert.equal(log.attributes['url.full'], 'https://shop.test/search');
});
