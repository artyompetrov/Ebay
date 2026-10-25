import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PageTelemetry } from '../src/infrastructure/telemetry/PageTelemetry.ts';
import { startBackgroundWork, tracedIdleScheduler } from '../src/infrastructure/telemetry/BackgroundWork.ts';
import type { IdleBudget } from '../src/siteProcessors/searchSites/ProductHighlighter.ts';
import type { SpanRecord, TelemetryBatchMessage } from '../src/infrastructure/telemetry/TelemetryTypes.ts';

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
    const root = telemetry.startPageSpan('page SearchSitesProcessor', clock - 1000);
    return {
        telemetry,
        root,
        advance: (ms: number) => { clock += ms; },
        spans: (): SpanRecord[] => {
            telemetry.flush();
            return sent.flatMap(message => message.spans);
        }
    };
}

const budget: IdleBudget = { timeRemaining: () => 10 };

// [OpenSpecScenario("client-telemetry", "Extension background work is traced as linked traces", "A polling iteration is its own linked trace")]
test('a polling iteration is the root of a new trace linked to the page root, and its calls are its children', () => {
    const page = createPage();
    page.root.end();

    const iteration = startBackgroundWork(page.telemetry, 'poll lot states');
    page.telemetry.startSpan('GET /api/ebay/v1/lot_state_requests/', { parent: iteration, kind: 2 }).end();
    iteration.end();

    const spans = page.spans();
    const poll = spans.find(span => span.name === 'poll lot states')!;
    assert.notEqual(poll.traceId, page.root.context.traceId);
    assert.equal(poll.parentSpanId, undefined);
    assert.deepEqual(poll.links, [page.root.context]);
    const call = spans.find(span => span.name.startsWith('GET'))!;
    assert.equal(call.traceId, poll.traceId);
    assert.equal(call.parentSpanId, poll.spanId);
});

// [OpenSpecScenario("client-telemetry", "Extension background work is traced as linked traces", "An idle highlighting pass is its own linked trace")]
test('an idle highlighting pass is a linked root span with the items processed and the time used', () => {
    const page = createPage();
    let processed = 0;
    const scheduler = tracedIdleScheduler(page.telemetry, 'product highlighting', callback => callback(budget), {
        processedCount: () => processed,
        hasPendingWork: () => true
    });

    scheduler(() => {
        processed += 12;
        page.advance(8);
    });

    const pass = page.spans().find(span => span.name === 'idle pass product highlighting')!;
    assert.equal(pass.parentSpanId, undefined);
    assert.deepEqual(pass.links, [page.root.context]);
    assert.equal(pass.attributes['idle.items_processed'], 12);
    assert.equal(pass.attributes['idle.yielded'], true);
    assert.equal(pass.attributes['idle.time_used_ms'], 8);
});

// [OpenSpecScenario("client-telemetry", "Extension background work is traced as linked traces", "Idle passes beyond the per-minute cap are counted")]
test('at most 60 idle passes a minute are recorded and the next recorded pass counts the skipped ones', () => {
    const page = createPage();
    const scheduler = tracedIdleScheduler(page.telemetry, 'product highlighting', callback => callback(budget), {
        processedCount: () => 0,
        hasPendingWork: () => false
    });

    for (let i = 0; i < 61; i++) {
        scheduler(() => {});
        page.advance(100);
    }
    page.advance(60_000);
    scheduler(() => {});

    const passes = page.spans().filter(span => span.name === 'idle pass product highlighting');
    assert.equal(passes.length, 61);
    assert.equal(passes[59].attributes['idle.skipped_passes'], 0);
    assert.equal(passes[60].attributes['idle.skipped_passes'], 1);
});
