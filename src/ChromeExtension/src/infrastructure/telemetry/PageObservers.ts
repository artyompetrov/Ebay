// Observers of a processed page (openspec/specs/client-telemetry): long animation frames, which show whether the
// extension's scripts slow the host page down, and clicks on the extension's own panel controls.
// Depends only on what is passed in, so it is unit-tested directly.

import type {PageTelemetry} from './PageTelemetry';

const LongFrameThresholdMs = 50;
const MaxLongFramesPerMinute = 60;
const MinuteMs = 60_000;

/** The parts of a `long-animation-frame` (or `longtask`) performance entry that are recorded. */
export interface LongFrameEntry {
    startTime: number;
    duration: number;
    blockingDuration?: number;
    scripts?: {sourceURL?: string}[];
}

/** Starts observing; calls `onEntries` with the entries of each batch. */
export type FrameObserverFactory = (onEntries: (entries: LongFrameEntry[]) => void) => void;

/**
 * Records every animation frame longer than 50 ms as a `long animation frame` span in the page trace, with
 * `extension.script` telling whether a script of this extension ran in it; at most 60 a minute.
 */
export function observeLongFrames(telemetry: PageTelemetry, timeOrigin: number, extensionUrl: string, observe: FrameObserverFactory): void {
    let windowStart = Number.NEGATIVE_INFINITY;
    let recordedInWindow = 0;

    observe(entries => {
        for (const entry of entries) {
            if (entry.duration <= LongFrameThresholdMs) {
                continue;
            }

            const start = timeOrigin + entry.startTime;
            if (start - windowStart >= MinuteMs) {
                windowStart = start;
                recordedInWindow = 0;
            }
            if (recordedInWindow >= MaxLongFramesPerMinute) {
                continue;
            }

            recordedInWindow++;
            // Once the page root ended, a frame is a trace of its own linked to the page's, so a long-open page
            // never grows one trace without bound.
            const root = telemetry.pageSpan;
            const afterPage = root !== undefined && root.isEnded;
            const span = telemetry.startSpan('long animation frame', {
                parent: afterPage ? null : undefined,
                links: afterPage ? [root.context] : [],
                startTime: start,
                attributes: {
                    'frame.duration_ms': entry.duration,
                    'frame.blocking_duration_ms': entry.blockingDuration ?? entry.duration,
                    'extension.script': (entry.scripts ?? []).some(script => script.sourceURL?.startsWith(extensionUrl) === true)
                }
            });
            span.end(start + entry.duration);
        }
    });
}

/**
 * Records each click on an element with an id inside `container` (the extension's panel) as a `click <id>` span.
 * Only the id and the tag are recorded, never values the user entered.
 */
export function traceClicks(telemetry: PageTelemetry, container: Element): void {
    container.addEventListener('click', (event: Event) => {
        // No `instanceof Element`: the target may come from another realm (an iframe, or jsdom in tests).
        const clicked = event.target as Partial<Element> | null;
        const target = typeof clicked?.closest === 'function' ? clicked.closest('[id]') : null;
        if (target === null || !container.contains(target)) {
            return;
        }

        telemetry.startSpan(`click ${target.id}`, {attributes: {'ui.element_id': target.id, 'ui.element_tag': target.tagName.toLowerCase()}}).end();
    }, {capture: true});
}
