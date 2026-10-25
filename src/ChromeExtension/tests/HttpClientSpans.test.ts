import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PageTelemetry } from '../src/infrastructure/telemetry/PageTelemetry.ts';
import { finishClientCall, startClientCall } from '../src/infrastructure/telemetry/HttpClientSpans.ts';
import type { SpanRecord, TelemetryBatchMessage } from '../src/infrastructure/telemetry/TelemetryTypes.ts';

const BackendUrl = 'https://backend.example.com/';
const TraceParentPattern = /^00-([0-9a-f]{32})-([0-9a-f]{16})-01$/;

let seed = 0;

function createPage() {
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
        advance: (ms: number) => { clock += ms; },
        spans: (): SpanRecord[] => {
            telemetry.flush();
            return sent.flatMap(message => message.spans);
        }
    };
}

function traceParentOf(init: RequestInit): { traceId: string; parentSpanId: string } {
    const headers = init.headers as Record<string, string>;
    const match = TraceParentPattern.exec(headers['traceparent']);
    assert.ok(match, `not a valid sampled traceparent: ${headers['traceparent']}`);
    return { traceId: match[1], parentSpanId: match[2] };
}

// [OpenSpecScenario("client-telemetry", "Extension backend calls are client spans that parent backend spans", "The backend server span is a child of the extension call span")]
test('a backend call carries the page trace id and the id of its own exported client span', () => {
    const page = createPage();
    const root = page.telemetry.pageSpan!;

    const first = startClientCall(page.telemetry, `${BackendUrl}api/ebay/v1/lots/1?x=1`, { method: 'GET' }, BackendUrl);
    const second = startClientCall(page.telemetry, `${BackendUrl}connect/token`, { method: 'POST', headers: { Authorization: 'Bearer t' } }, BackendUrl);
    finishClientCall(page.telemetry, first, { status: 200 });
    finishClientCall(page.telemetry, second, { status: 200 });

    const firstParent = traceParentOf(first.init);
    const secondParent = traceParentOf(second.init);
    assert.equal(firstParent.traceId, root.context.traceId);
    assert.equal(secondParent.traceId, root.context.traceId);
    assert.notEqual(firstParent.parentSpanId, secondParent.parentSpanId);
    assert.equal((second.init.headers as Record<string, string>)['Authorization'], 'Bearer t', 'other headers are kept');

    const exported = page.spans().find(span => span.spanId === firstParent.parentSpanId)!;
    assert.equal(exported.kind, 2);
    assert.equal(exported.parentSpanId, root.context.spanId);
    assert.equal(exported.attributes['http.request.method'], 'GET');
    assert.equal(exported.attributes['url.path'], '/api/ebay/v1/lots/1');
    assert.equal(exported.attributes['http.response.status_code'], 200);
});

// [OpenSpecScenario("client-telemetry", "Extension backend calls are client spans that parent backend spans", "Calls of two page loads use different traces")]
test('calls of two page loads carry different trace ids', () => {
    const firstPage = createPage();
    const secondPage = createPage();

    const first = startClientCall(firstPage.telemetry, `${BackendUrl}api/ebay/v1/products`, {}, BackendUrl);
    const second = startClientCall(secondPage.telemetry, `${BackendUrl}api/ebay/v1/products`, {}, BackendUrl);

    assert.notEqual(traceParentOf(first.init).traceId, traceParentOf(second.init).traceId);
});

// [OpenSpecScenario("client-telemetry", "Extension backend calls are client spans that parent backend spans", "An extension call to another host carries no trace context")]
test('a call to the eBay API gets no traceparent but is still recorded as a client span', () => {
    const page = createPage();
    const init = { method: 'GET', headers: { Authorization: 'Bearer ebay' } };

    const call = startClientCall(page.telemetry, 'https://api.ebay.com/buy/browse/v1/item/v1|1|0', init, BackendUrl);
    finishClientCall(page.telemetry, call, { status: 200 });

    assert.equal(call.init, init);
    const exported = page.spans().find(span => span.spanId === call.span.context.spanId)!;
    assert.equal(exported.attributes['server.address'], 'api.ebay.com');
});

// [OpenSpecScenario("client-telemetry", "Extension backend calls are client spans that parent backend spans", "A failed extension backend call marks its span as an error")]
test('a backend call answered with 500 has an error span with the status code', () => {
    const page = createPage();

    const call = startClientCall(page.telemetry, `${BackendUrl}api/ebay/v1/lots`, {}, BackendUrl);
    finishClientCall(page.telemetry, call, { status: 500 });

    const exported = page.spans().find(span => span.spanId === call.span.context.spanId)!;
    assert.equal(exported.status, 2);
    assert.equal(exported.attributes['http.response.status_code'], 500);
});

test('a call that fails without a response records the error', () => {
    const page = createPage();

    const call = startClientCall(page.telemetry, `${BackendUrl}api/ebay/v1/lots`, {}, BackendUrl);
    finishClientCall(page.telemetry, call, { error: 'TypeError: Failed to fetch' });

    const exported = page.spans().find(span => span.spanId === call.span.context.spanId)!;
    assert.equal(exported.status, 2);
    assert.equal(exported.events[0].name, 'exception');
});

// [OpenSpecScenario("client-telemetry", "Extension call time is split by hop", "The worker fetch is a child of the call span")]
test('the worker fetch and both message hops are children of the call span and lie inside it', () => {
    const page = createPage();

    const call = startClientCall(page.telemetry, `${BackendUrl}api/ebay/v1/lots`, {}, BackendUrl);
    const sentAt = call.sentAt;
    page.advance(100);
    finishClientCall(page.telemetry, call, { status: 200, timing: { fetchStart: sentAt + 10, fetchEnd: sentAt + 90 } });

    const spans = page.spans();
    const callSpan = spans.find(span => span.spanId === call.span.context.spanId)!;
    const children = spans.filter(span => span.parentSpanId === callSpan.spanId);
    const byName = new Map(children.map(span => [span.name, span]));
    assert.deepEqual([...byName.keys()].sort(), ['message from worker', 'message to worker', 'worker fetch']);
    const workerFetch = byName.get('worker fetch')!;
    assert.equal(workerFetch.startTime, sentAt + 10);
    assert.equal(workerFetch.endTime, sentAt + 90);
    assert.ok(callSpan.startTime <= byName.get('message to worker')!.startTime);
    assert.ok(callSpan.endTime >= byName.get('message from worker')!.endTime);
});
