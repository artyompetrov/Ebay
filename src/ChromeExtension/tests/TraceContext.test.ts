import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PageTraceContext } from '../src/infrastructure/TraceContext.ts';

const BackendUrl = 'https://backend.example.com/';
const TraceParentPattern = /^00-([0-9a-f]{32})-([0-9a-f]{16})-01$/;

interface TraceParent {
    traceId: string;
    parentSpanId: string;
}

function traceParentOf(init: RequestInit): TraceParent {
    const headers = init.headers as Record<string, string>;
    const match = TraceParentPattern.exec(headers['traceparent']);
    assert.ok(match, `not a valid sampled traceparent: ${headers['traceparent']}`);
    return { traceId: match[1], parentSpanId: match[2] };
}

// [OpenSpecScenario("observability-tracing", "Chrome extension calls from one page share a trace", "Backend calls from one page carry the same trace id")]
test('backend calls from one page carry the same trace id and different parent span ids', () => {
    const page = new PageTraceContext(BackendUrl);

    const first = traceParentOf(page.withTraceParent(`${BackendUrl}api/ebay/v1/products`, { method: 'GET' }));
    const second = traceParentOf(page.withTraceParent(`${BackendUrl}connect/token`, { method: 'POST', headers: { Authorization: 'Bearer token' } }));

    assert.equal(first.traceId, page.traceId);
    assert.equal(second.traceId, page.traceId);
    assert.notEqual(first.parentSpanId, second.parentSpanId);
});

// [OpenSpecScenario("observability-tracing", "Chrome extension calls from one page share a trace", "Another page load gets another trace id")]
test('another page load gets another trace id', () => {
    const firstPage = new PageTraceContext(BackendUrl);
    const secondPage = new PageTraceContext(BackendUrl);

    const first = traceParentOf(firstPage.withTraceParent(`${BackendUrl}api/ebay/v1/products`, {}));
    const second = traceParentOf(secondPage.withTraceParent(`${BackendUrl}api/ebay/v1/products`, {}));

    assert.notEqual(first.traceId, second.traceId);
});

// [OpenSpecScenario("observability-tracing", "Chrome extension calls from one page share a trace", "Calls to other hosts carry no trace context")]
test('calls to other hosts carry no traceparent header', () => {
    const page = new PageTraceContext(BackendUrl);
    const init: RequestInit = { method: 'GET', headers: { Authorization: 'Bearer ebay-token' } };

    const result = page.withTraceParent('https://api.ebay.com/buy/browse/v1/item_summary/search?q=tube', init);

    assert.equal(result, init);
    assert.deepEqual(result.headers, { Authorization: 'Bearer ebay-token' });
});

test('existing headers are kept, whatever form they are given in', () => {
    const page = new PageTraceContext(BackendUrl);

    const fromRecord = page.withTraceParent(BackendUrl, { headers: { Authorization: 'Bearer a' } }).headers as Record<string, string>;
    const fromHeaders = page.withTraceParent(BackendUrl, { headers: new Headers({ Authorization: 'Bearer b' }) }).headers as Record<string, string>;
    const fromPairs = page.withTraceParent(BackendUrl, { headers: [['Authorization', 'Bearer c']] }).headers as Record<string, string>;

    assert.equal(fromRecord['Authorization'], 'Bearer a');
    assert.equal(fromHeaders['authorization'], 'Bearer b');
    assert.equal(fromPairs['authorization'], 'Bearer c');
    for (const headers of [fromRecord, fromHeaders, fromPairs]) {
        assert.match(headers['traceparent'], TraceParentPattern);
    }
});

test('a request object is recognized by its url', () => {
    const page = new PageTraceContext(BackendUrl);

    assert.equal(page.isBackendCall(new Request(`${BackendUrl}api/health`)), true);
    assert.equal(page.isBackendCall(new Request('https://api.ebay.com/')), false);
});
