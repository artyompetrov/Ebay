// Background work of a page (polling iterations, idle-time passes) recorded as traces of their own, linked to the
// page's root span, so a long-open page never grows one trace without bound (openspec/specs/client-telemetry).
// Depends only on what is passed in, so it is unit-tested directly.

import type {PageTelemetry, StartSpanOptions, TelemetrySpan} from './PageTelemetry';
import type {IdleBudget, IdleScheduler} from '../../siteProcessors/searchSites/ProductHighlighter';

const MaxIdlePassesPerMinute = 60;
const MinuteMs = 60_000;

/** Progress of the idle-time work, read before and after each pass. */
export interface IdleWorkProgress {
    /** Items processed so far. */
    processedCount(): number;
    /** Whether work is left after the pass (the pass ran out of idle time). */
    hasPendingWork(): boolean;
}

/** Starts the root span of a new trace, linked to the page root span when there is one. */
export function startBackgroundWork(telemetry: PageTelemetry, name: string, options: Omit<StartSpanOptions, 'parent' | 'links'> = {}): TelemetrySpan {
    const page = telemetry.pageSpan;
    return telemetry.startSpan(name, {...options, parent: null, links: page === undefined ? [] : [page.context]});
}

/**
 * Wraps an idle scheduler so every pass is recorded as `idle pass <name>` with the items it processed, the idle
 * time it used and whether it yielded with work left; at most 60 passes a minute, the rest counted on the next one.
 */
export function tracedIdleScheduler(telemetry: PageTelemetry, name: string, schedule: IdleScheduler, progress: IdleWorkProgress): IdleScheduler {
    let windowStart = Number.NEGATIVE_INFINITY;
    let recordedInWindow = 0;
    let skipped = 0;

    return callback => schedule((budget: IdleBudget) => {
        const start = telemetry.now();
        if (start - windowStart >= MinuteMs) {
            windowStart = start;
            recordedInWindow = 0;
        }

        const processedBefore = progress.processedCount();
        callback(budget);
        if (recordedInWindow >= MaxIdlePassesPerMinute) {
            skipped++;
            return;
        }

        recordedInWindow++;
        const span = startBackgroundWork(telemetry, `idle pass ${name}`, {
            startTime: start,
            attributes: {
                'idle.items_processed': progress.processedCount() - processedBefore,
                'idle.yielded': progress.hasPendingWork(),
                'idle.skipped_passes': skipped
            }
        });
        skipped = 0;
        const end = telemetry.now();
        span.setAttribute('idle.time_used_ms', end - start);
        span.end(end);
    });
}
