import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
    relayRequest,
    TelemetryExporter,
    usableAccessToken
} from '../src/infrastructure/telemetry/TelemetryExporter.ts';
import type { TelemetrySignal } from '../src/infrastructure/telemetry/TelemetryExporter.ts';
import type { LogRecord, SeverityNumber, SpanRecord, TelemetryBatchMessage } from '../src/infrastructure/telemetry/TelemetryTypes.ts';

const BackendUrl = 'https://backend.test/';
const Now = 1_700_000_000_000;

interface Posted {
    signal: TelemetrySignal;
    json: any;
}

function createExporter(accept: (signal: TelemetrySignal) => boolean = () => true, minSeverity: SeverityNumber = 5) {
    const posted: Posted[] = [];
    const exporter = new TelemetryExporter({
        serviceVersion: '2610.25.12.0000',
        now: () => Now,
        schedule: () => {},
        post: async (signal: TelemetrySignal, body: Uint8Array) => {
            posted.push({ signal, json: JSON.parse(new TextDecoder().decode(body)) });
            return accept(signal);
        },
        minSeverity: async () => minSeverity
    });
    return { exporter, posted };
}

function span(name: string, attributes: Record<string, string> = {}): SpanRecord {
    return {
        traceId: '0af7651916cd43dd8448eb211c80319c',
        spanId: 'b7ad6b7169203331',
        name,
        kind: 2,
        startTime: Now - 10,
        endTime: Now,
        attributes,
        events: [],
        links: [],
        status: 0
    };
}

function log(message: string, severity: SeverityNumber = 9): LogRecord {
    return { time: Now, severity, message, attributes: {}, traceId: '0af7651916cd43dd8448eb211c80319c', spanId: 'b7ad6b7169203331' };
}

function batch(spans: SpanRecord[], logs: LogRecord[], sessionId = 'tab-1'): TelemetryBatchMessage {
    return { kind: 'telemetry', sessionId, spans, logs };
}

function resourceAttributes(resource: any): Record<string, string> {
    return Object.fromEntries(resource.attributes.map((attribute: any) => [attribute.key, attribute.value.stringValue]));
}

function logMessages(posted: Posted[]): string[] {
    return posted.filter(p => p.signal === 'logs')
        .flatMap(p => p.json.resourceLogs.flatMap((r: any) => r.scopeLogs.flatMap((s: any) => s.logRecords.map((l: any) => l.body.stringValue))));
}

// [OpenSpecScenario("client-telemetry", "Clients identify themselves in telemetry", "Extension telemetry carries its identity")]
test('spans and log records of a tab carry service name, version and the tab session id', async () => {
    const { exporter, posted } = createExporter();

    exporter.accept(batch([span('GET')], [log('loaded')], 'tab-42'));
    await exporter.export();

    const traces = posted.find(p => p.signal === 'traces')!.json;
    const logs = posted.find(p => p.signal === 'logs')!.json;
    for (const resource of [traces.resourceSpans[0].resource, logs.resourceLogs[0].resource]) {
        assert.deepEqual(resourceAttributes(resource), {
            'service.name': 'ebay_chrome_extension',
            'service.version': '2610.25.12.0000',
            'session.id': 'tab-42'
        });
    }
    const exportedSpan = traces.resourceSpans[0].scopeSpans[0].spans[0];
    assert.equal(exportedSpan.traceId, '0af7651916cd43dd8448eb211c80319c');
    assert.equal(exportedSpan.kind, 3, 'client span (OTLP SPAN_KIND_CLIENT)');
    assert.equal(logs.resourceLogs[0].scopeLogs[0].logRecords[0].traceId, '0af7651916cd43dd8448eb211c80319c');
});

// [OpenSpecScenario("client-telemetry", "Telemetry export never disturbs the client", "Extension export without a token does not start a login")]
test('without a usable stored token there is no access token, so the batch is dropped', () => {
    const token = JSON.stringify({ accessToken: 'token', refreshToken: null, expiresAt: Now - 1 });

    assert.equal(usableAccessToken({}, BackendUrl, Now), undefined, 'nothing stored');
    assert.equal(usableAccessToken({ backend_url: 'https://other.test/', ebayToolTokenStore: token }, BackendUrl, Now), undefined,
        'token of another backend');
    assert.equal(usableAccessToken({ backend_url: BackendUrl, ebayToolTokenStore: token }, BackendUrl, Now), undefined, 'expired');
    assert.equal(
        usableAccessToken({ backend_url: BackendUrl, ebayToolTokenStore: JSON.stringify({ accessToken: 'ok', expiresAt: Now + 1 }) }, BackendUrl, Now),
        'ok');
});

// [OpenSpecScenario("client-telemetry", "Telemetry export never disturbs the client", "A failed extension export is dropped and counted")]
test('a rejected batch is not sent again and the next batch reports how much was dropped', async () => {
    let accept = false;
    const { exporter, posted } = createExporter(() => accept);

    exporter.accept(batch([span('first')], [log('first')]));
    await exporter.export();
    accept = true;
    exporter.accept(batch([span('second')], []));
    await exporter.export();

    const spanNames = posted.filter(p => p.signal === 'traces')
        .map(p => p.json.resourceSpans[0].scopeSpans[0].spans.map((s: any) => s.name));
    assert.deepEqual(spanNames, [['first'], ['second']], 'the failed span batch was posted once');
    assert.ok(logMessages(posted).includes('Telemetry dropped 1 spans and 1 log records'));
});

// [OpenSpecScenario("client-telemetry", "Telemetry export never disturbs the client", "Extension export calls carry no trace context")]
test('the relay request carries the token but no traceparent', () => {
    const request = relayRequest(BackendUrl, 'traces', new Uint8Array([1]), 'token');

    assert.equal(request.url, 'https://backend.test/api/telemetry/v1/traces');
    const headers = request.init.headers as Record<string, string>;
    assert.equal(headers['Authorization'], 'Bearer token');
    assert.equal(Object.keys(headers).some(name => name.toLowerCase() === 'traceparent'), false);
});

// [OpenSpecScenario("client-telemetry", "Client logs are exported at the served level", "Records below the served level are not exported")]
test('log records below the served level are not exported', async () => {
    const { exporter, posted } = createExporter(() => true, 9);

    exporter.accept(batch([], [log('debug details', 5), log('page processed', 9)]));
    await exporter.export();

    assert.deepEqual(logMessages(posted), ['page processed']);
});

test('more than 1 MiB of pending telemetry is posted as several batches below 1 MiB', async () => {
    const { exporter, posted } = createExporter();
    const spans = Array.from({ length: 40 }, (_, i) => span(`span ${i}`, { padding: 'x'.repeat(40_000) }));

    exporter.accept(batch(spans, []));
    await exporter.export();

    const traceBatches = posted.filter(p => p.signal === 'traces');
    assert.ok(traceBatches.length > 1);
    for (const traceBatch of traceBatches) {
        assert.ok(JSON.stringify(traceBatch.json).length < 1024 * 1024);
    }
    assert.equal(traceBatches.flatMap(p => p.json.resourceSpans[0].scopeSpans[0].spans).length, 40);
});
