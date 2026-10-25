// Runs the matched site processors of a page under the page root span (openspec/specs/client-telemetry).
// Nothing leaves the browser for a page no processor matched: no telemetry and no backend call, not even the update
// check. Depends only on what is passed in, so it is unit-tested directly.

import type {PageTelemetry, TelemetrySpan} from './infrastructure/telemetry/PageTelemetry';
import type {Attributes} from './infrastructure/telemetry/TelemetryTypes';
import type {ISiteProcessor} from './siteProcessors/ISiteProcessor';

/** Navigation milestones of the document, in milliseconds since navigation start (0 when not reached yet). */
export interface NavigationTiming {
    responseStart: number;
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
    /**
     * Calls back for each navigation milestone not known at start (`domContentLoaded`, `load`, and `responseStart`/
     * `responseEnd` when the navigation entry was still empty at document start) once it is, with its time in
     * milliseconds since the Unix epoch.
     */
    onLaterMilestone: (callback: (name: string, time: number) => void) => void;
    /** Attributes of the page root span (host, extension mode, visibility). */
    pageAttributes: Attributes;
    /** Path of the page, recorded only when every matched processor allows it. */
    pagePath: string;
    /** Resolves `false` when a newer extension version is available and the page must not be processed. */
    checkForUpdates: () => Promise<boolean>;
    /** Called once when no processor matched. */
    onNoProcessors: () => void;
    /** Called once when processors matched, to start the page observers (long frames). */
    onProcessorsMatched: () => void;
}

const NavigationEvents: (keyof NavigationTiming)[] = ['responseStart', 'responseEnd', 'domContentLoadedEventEnd', 'loadEventEnd'];
const NavigationEventNames: Record<keyof NavigationTiming, string> = {
    responseStart: 'responseStart',
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
    // A processor that runs on any site (search-site highlighting) must not turn the browsing history into traces.
    const pathAllowed = processors.every(processor => processor.recordsPagePath !== false);
    const root = telemetry.startPageSpan(`page ${names.join(', ')}`, environment.timeOrigin, {
        ...environment.pageAttributes,
        ...(pathAllowed ? {'url.path': environment.pagePath} : {}),
        'extension.processors': names.join(', ')
    });
    addNavigationEvents(root, environment);
    environment.onLaterMilestone((name, time) => root.addEvent(name, {}, time));
    root.addEvent('extension.script_start', {}, environment.scriptStart);
    root.addEvent('extension.handler_matched', {'extension.processors': names.join(', ')}, matchedAt);
    environment.onProcessorsMatched();

    try {
        const actualVersion = await telemetry.withSpan('update check', {}, span =>
            telemetry.withDefaultParent(span, () => environment.checkForUpdates()));
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
