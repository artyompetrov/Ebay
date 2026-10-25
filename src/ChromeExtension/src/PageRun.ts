// Runs the matched site processors of a page under the page root span (openspec/specs/client-telemetry).
// Nothing leaves the browser for a page no processor matched: no telemetry and no backend call, not even the update
// check. Depends only on what is passed in, so it is unit-tested directly.

import type {PageTelemetry, TelemetrySpan} from './infrastructure/telemetry/PageTelemetry';
import type {Attributes} from './infrastructure/telemetry/TelemetryTypes';
import type {ISiteProcessor} from './siteProcessors/ISiteProcessor';

/** Navigation milestones of the document, in milliseconds since navigation start (0 when not reached yet). */
export interface NavigationTiming {
    responseEnd: number;
    domContentLoadedEventEnd: number;
    loadEventEnd: number;
}

export interface PageRunEnvironment {
    telemetry: PageTelemetry;
    /** Navigation start, in milliseconds since the Unix epoch (`performance.timeOrigin`). */
    timeOrigin: number;
    /** When the content script started, in milliseconds since the Unix epoch. */
    scriptStart: number;
    navigationTiming: NavigationTiming | undefined;
    /** Attributes of the page root span (path and host without query, extension mode, visibility). */
    pageAttributes: Attributes;
    /** Resolves `false` when a newer extension version is available and the page must not be processed. */
    checkForUpdates: () => Promise<boolean>;
    /** Called once when no processor matched. */
    onNoProcessors: () => void;
    /** Called once when processors matched, to start the page observers (long frames). */
    onProcessorsMatched: () => void;
}

const NavigationEvents: (keyof NavigationTiming)[] = ['responseEnd', 'domContentLoadedEventEnd', 'loadEventEnd'];
const NavigationEventNames: Record<keyof NavigationTiming, string> = {
    responseEnd: 'responseEnd',
    domContentLoadedEventEnd: 'domContentLoaded',
    loadEventEnd: 'load'
};

function addNavigationEvents(root: TelemetrySpan, environment: PageRunEnvironment): void {
    const timing = environment.navigationTiming;
    if (timing === undefined) {
        return;
    }

    for (const milestone of NavigationEvents) {
        if (timing[milestone] > 0) {
            root.addEvent(NavigationEventNames[milestone], {}, environment.timeOrigin + timing[milestone]);
        }
    }
}

/** Runs `processors` (already matched for this page) and records the page's root span. */
export async function runPage(processors: ISiteProcessor[], environment: PageRunEnvironment): Promise<void> {
    const telemetry = environment.telemetry;
    if (processors.length === 0) {
        telemetry.discard();
        environment.onNoProcessors();
        return;
    }

    const names = processors.map(processor => processor.name);
    const matchedAt = telemetry.now();
    telemetry.activate();
    const root = telemetry.startPageSpan(`page ${names.join(', ')}`, environment.timeOrigin, {
        ...environment.pageAttributes,
        'extension.processors': names.join(', ')
    });
    addNavigationEvents(root, environment);
    root.addEvent('extension.script_start', {}, environment.scriptStart);
    root.addEvent('extension.handler_matched', {'extension.processors': names.join(', ')}, matchedAt);
    environment.onProcessorsMatched();

    try {
        const actualVersion = await telemetry.withSpan('update check', {}, () => environment.checkForUpdates());
        root.setAttribute('extension.update_available', !actualVersion);
        if (!actualVersion) {
            return;
        }

        for (const processor of processors) {
            await telemetry.withSpan(`processor ${processor.name}`, {}, span => telemetry.withDefaultParent(span, () => processor.run(span)));
            if (processor.breakAfterSearchProcessor) {
                break;
            }
        }
    } catch (error) {
        root.recordException(error);
        throw error;
    } finally {
        root.end();
    }
}
