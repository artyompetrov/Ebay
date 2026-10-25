import { test } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { PageTelemetry } from '../src/infrastructure/telemetry/PageTelemetry.ts';
import { Logger, logUncaughtErrors, reportCaughtError } from '../src/infrastructure/telemetry/Logger.ts';
import type { ConsoleLike } from '../src/infrastructure/telemetry/Logger.ts';
import { finishClientCall, startClientCall } from '../src/infrastructure/telemetry/HttpClientSpans.ts';
import { TelemetryExporter } from '../src/infrastructure/telemetry/TelemetryExporter.ts';
import type { SeverityNumber, TelemetryBatchMessage } from '../src/infrastructure/telemetry/TelemetryTypes.ts';

const BackendUrl = 'https://backend.example.com/';
const ExtensionUrl = 'chrome-extension://mlebgdemjnpnfgcgbbncllpniiicffbm/';

/** A page whose records go through the real worker exporter at `minSeverity`; returns the exported JSON text. */
function createPage(minSeverity: SeverityNumber = 5) {
    let seed = 0;
    const consoleLines: string[] = [];
    const exported: string[] = [];
    const exporter = new TelemetryExporter({
        serviceVersion: '1.0',
        now: () => 1_700_000_000_000,
        schedule: () => {},
        post: async (_signal, body) => {
            exported.push(new TextDecoder().decode(body));
            return true;
        },
        minSeverity: async () => minSeverity
    });
    const telemetry = new PageTelemetry({
        randomBytes: (count: number) => new Uint8Array(count).map(() => (++seed) % 256),
        now: () => 1_700_000_000_000,
        send: (message: TelemetryBatchMessage) => exporter.accept(message),
        schedule: () => {}
    });
    const output: ConsoleLike = {
        debug: (...data: unknown[]) => consoleLines.push(data.map(String).join(' ')),
        log: (...data: unknown[]) => consoleLines.push(data.map(String).join(' ')),
        warn: (...data: unknown[]) => consoleLines.push(data.map(String).join(' ')),
        error: (...data: unknown[]) => consoleLines.push(data.map(String).join(' '))
    };
    telemetry.activate();
    const root = telemetry.startPageSpan('page EbaySiteProcessor', 1_700_000_000_000);
    const logger = new Logger(telemetry, output);
    return {
        telemetry,
        root,
        logger,
        consoleLines,
        exportAll: async (): Promise<string> => {
            telemetry.unload();
            await exporter.export();
            return exported.join('\n');
        },
        exportedLogs: async (): Promise<any[]> => {
            telemetry.unload();
            await exporter.export();
            return exported.map(text => JSON.parse(text))
                .flatMap(json => (json.resourceLogs ?? []).flatMap((r: any) => r.scopeLogs.flatMap((s: any) => s.logRecords)));
        }
    };
}

// [OpenSpecScenario("client-telemetry", "Client logs are exported at the served level", "An extension debug record is exported by default")]
test('a debug record written while processing a page is exported with its severity and the active span', async () => {
    const page = createPage();
    const processor = page.telemetry.startSpan('processor EbaySiteProcessor');

    await page.telemetry.withDefaultParent(processor, async () => page.logger.debug('productPage'));
    processor.end();

    const [record] = (await page.exportedLogs()).filter(log => log.body.stringValue === 'productPage');
    assert.equal(record.severityNumber, 5);
    assert.equal(record.traceId, processor.context.traceId);
    assert.equal(record.spanId, processor.context.spanId);
    assert.ok(page.consoleLines.includes('productPage'), 'the record also goes to the console');
});

// [OpenSpecScenario("client-telemetry", "Backend payloads are logged only at Trace level", "A backend response body is exported at Trace level")]
test('at Trace level the response body of a backend call is exported, cut to 4 KB', async () => {
    const page = createPage(1);
    const body = '{"lotId":1,"padding":"' + 'x'.repeat(5000) + '"}';

    page.logger.httpCall({ method: 'GET', url: `${BackendUrl}api/ebay/v1/lots/1/`, status: 200, isBackendCall: true, responseBody: body, span: page.root });

    const traceRecords = (await page.exportedLogs()).filter(log => log.severityNumber === 1);
    const response = traceRecords.find(log => log.body.stringValue.includes('response body'))!;
    assert.ok(response.body.stringValue.includes('{"lotId":1'));
    assert.ok(response.body.stringValue.length <= 4096);
});

// [OpenSpecScenario("client-telemetry", "Backend payloads are logged only at Trace level", "A backend body is not exported at Debug level")]
test('at Debug level no backend body is exported', async () => {
    const page = createPage(5);

    page.logger.httpCall({
        method: 'PUT', url: `${BackendUrl}api/ebay/v1/lots/1/`, status: 200, isBackendCall: true,
        requestBody: '{"title":"distinctive-request-value"}', responseBody: '{"distinctive-response-value":1}', span: page.root
    });

    const exported = await page.exportAll();
    assert.ok(exported.includes('/api/ebay/v1/lots/1/'), 'the call itself is logged at Debug');
    assert.equal(exported.includes('distinctive-request-value'), false);
    assert.equal(exported.includes('distinctive-response-value'), false);
});

// [OpenSpecScenario("client-telemetry", "Backend payloads are logged only at Trace level", "An eBay response body is never exported")]
test('even at Trace level the body of an eBay API response stays in the console', async () => {
    const page = createPage(1);

    page.logger.httpCall({
        method: 'GET', url: 'https://api.ebay.com/buy/browse/v1/item/v1|1|0', status: 200, isBackendCall: false,
        responseBody: '{"seller":"distinctive-ebay-value"}', span: page.root
    });

    assert.ok(page.consoleLines.some(line => line.includes('distinctive-ebay-value')));
    assert.equal((await page.exportAll()).includes('distinctive-ebay-value'), false);
});

// [OpenSpecScenario("client-telemetry", "Client telemetry contains no secrets or query strings", "A token and query string are not exported by the extension")]
test('neither the bearer token nor the query string of a backend call is exported, even at Trace level', async () => {
    const page = createPage(1);
    const url = `${BackendUrl}api/ebay/v1/lots/?distinctiveParam=distinctive-query-value`;
    const init = { method: 'GET', headers: { Authorization: 'Bearer distinctive-token-value' } };

    const call = startClientCall(page.telemetry, url, init, BackendUrl);
    finishClientCall(page.telemetry, call, { status: 200 });
    page.logger.httpCall({ method: 'GET', url, status: 200, isBackendCall: true, responseBody: `{"next":"${url}"}`, span: call.span });
    page.logger.info(`Loaded ${url} with Bearer distinctive-token-value`);

    const exported = await page.exportAll();
    for (const secret of ['distinctive-token-value', 'distinctive-query-value', 'distinctiveParam']) {
        assert.equal(exported.includes(secret), false, `${secret} was exported`);
    }
});

// [OpenSpecScenario("client-telemetry", "Client errors are logged and recorded on spans", "An extension processing error becomes an error log and an error span")]
test('an error caught by a processor is an Error record with type, message and stack, and fails the processor span', async () => {
    const page = createPage();
    const processor = page.telemetry.startSpan('processor EbaySiteProcessor');

    reportCaughtError(page.logger, 'Lot processing failed', new RangeError('price is negative'), processor);
    processor.end();

    const exported = await page.exportAll();
    const logs = (JSON.parse(exported.split('\n').find(text => text.includes('resourceLogs'))!) as any)
        .resourceLogs[0].scopeLogs[0].logRecords;
    const record = logs.find((log: any) => log.body.stringValue === 'Lot processing failed');
    assert.equal(record.severityNumber, 17);
    const attributes = Object.fromEntries(record.attributes.map((a: any) => [a.key, a.value.stringValue]));
    assert.equal(attributes['exception.type'], 'RangeError');
    assert.equal(attributes['exception.message'], 'price is negative');
    assert.ok(attributes['exception.stacktrace'].includes('RangeError'));
    const spans = (JSON.parse(exported.split('\n').find(text => text.includes('resourceSpans'))!) as any)
        .resourceSpans[0].scopeSpans[0].spans;
    const processorSpan = spans.find((span: any) => span.name === 'processor EbaySiteProcessor');
    assert.equal(processorSpan.status.code, 2);
    assert.equal(processorSpan.events[0].name, 'exception');
});

// [OpenSpecScenario("client-telemetry", "Client errors are logged and recorded on spans", "An unhandled rejection in the extension is logged")]
test('an unhandled rejection from extension code is logged, one from the host page is ignored', async () => {
    const page = createPage();
    const window = new JSDOM('<!doctype html><body></body>').window;
    logUncaughtErrors(window, page.logger, ExtensionUrl);

    for (const sourceUrl of [`${ExtensionUrl}build/ebay.js`, 'https://www.ebay.com/static/app.js']) {
        const reason = new Error(`rejected in ${sourceUrl}`);
        reason.stack = `Error: rejected\n    at run (${sourceUrl}:1:100)`;
        const event = new window.Event('unhandledrejection');
        Object.defineProperty(event, 'reason', { value: reason });
        window.dispatchEvent(event);
    }

    const errors = (await page.exportedLogs()).filter(log => log.severityNumber === 17);
    assert.equal(errors.length, 1);
    assert.equal(errors[0].body.stringValue, 'Unhandled promise rejection in the extension');
    assert.equal(errors[0].traceId, page.root.context.traceId);
});
