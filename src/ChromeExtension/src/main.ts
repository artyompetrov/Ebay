// First import: the telemetry module is evaluated before the others, so its start time is the script start.
import {logger, scriptStart, telemetry} from "./infrastructure/Telemetry";
import * as UpdatesCheckerClient from "./clients/UpdatesCheckerClient";
import {tryGetEbaySiteProcessor} from "./siteProcessors/EbaySiteProcessor";
import {ISiteProcessor} from "./siteProcessors/ISiteProcessor";
import {tryGetAuthPageProcessor} from "./siteProcessors/AuthPageProcessor";
import {tryGetSearchSitesProcessor} from "./siteProcessors/SearchSitesProcessor";
import {tryGetAvitoSavedSearchesProcessor} from "./siteProcessors/AvitoSavedSearchesPageProcessor";
import {Mode} from './mode';
import {tryGetEbayShippingRateTableSiteProcessor} from "./siteProcessors/EbayShippingRateTableSiteProcessor";
import {tryGetEbayMagSiteProcessor} from "./siteProcessors/EbayMagSiteProcessor";
import {NavigationTiming, runPage} from "./PageRun";
import {LongFrameEntry, observeLongFrames} from "./infrastructure/telemetry/PageObservers";

async function getCurrentMode(): Promise<Mode> {
    const {mode} = await chrome.storage.local.get(['mode']);
    return (mode as Mode) || Mode.NotSelected;
}

function getMatchingSiteProcessors(currentMode: Mode): ISiteProcessor[] {

    let processors: ISiteProcessor[]
    switch(currentMode) {
        case Mode.Supplier:
            processors = [
                tryGetAvitoSavedSearchesProcessor(),
                tryGetAuthPageProcessor(),
                tryGetEbaySiteProcessor(),
                tryGetSearchSitesProcessor(),
                tryGetEbayShippingRateTableSiteProcessor()
            ];
            break;
        case Mode.Seller:
            processors = [
                tryGetAuthPageProcessor(),
                tryGetEbayShippingRateTableSiteProcessor(),
                tryGetEbayMagSiteProcessor()
            ];
            break;
        case Mode.NotSelected:
            processors = [];
            break;
    }
    
    return processors.filter((processor) => processor !== null);
}

function getNavigationTiming(): NavigationTiming | undefined {
    const [entry] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    return entry === undefined
        ? undefined
        : {
            responseStart: entry.responseStart,
            responseEnd: entry.responseEnd,
            domContentLoadedEventEnd: entry.domContentLoadedEventEnd,
            loadEventEnd: entry.loadEventEnd
        };
}

const initialNavigationTiming = getNavigationTiming();

const LongFrameEntryType = 'long-animation-frame';
const LongTaskEntryType = 'longtask';

function observeSlowFrames(): void {
    observeLongFrames(telemetry, performance.timeOrigin, chrome.runtime.getURL(''), onEntries => {
        const supported = PerformanceObserver.supportedEntryTypes;
        const type = supported.indexOf(LongFrameEntryType) >= 0 ? LongFrameEntryType : LongTaskEntryType;
        if (supported.indexOf(type) < 0) {
            return;
        }

        new PerformanceObserver(list => onEntries(list.getEntries() as unknown as LongFrameEntry[]))
            .observe({type, buffered: true});
    });
}

function onLaterNavigationMilestone(callback: (name: string, time: number) => void): void {
    const reachedAt = (): number => telemetry.now();
    // At document_start the navigation entry is often still empty: then the response times are read on load.
    const responseKnownAtStart = (initialNavigationTiming?.responseEnd ?? 0) > 0;
    const addResponseTimes = (): void => {
        const timing = getNavigationTiming();
        if (responseKnownAtStart || timing === undefined) {
            return;
        }
        if (timing.responseStart > 0) {
            callback('responseStart', performance.timeOrigin + timing.responseStart);
        }
        if (timing.responseEnd > 0) {
            callback('responseEnd', performance.timeOrigin + timing.responseEnd);
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => callback('domContentLoaded', reachedAt()), {once: true});
    }
    if (document.readyState !== 'complete') {
        window.addEventListener('load', () => {
            addResponseTimes();
            callback('load', reachedAt());
        }, {once: true});
    } else {
        addResponseTimes();
    }
}

export async function run() {
    const mode = await getCurrentMode();
    await runPage(getMatchingSiteProcessors(mode), {
        telemetry,
        timeOrigin: performance.timeOrigin,
        scriptStart,
        navigationTiming: initialNavigationTiming,
        onLaterMilestone: onLaterNavigationMilestone,
        pagePath: location.pathname,
        pageAttributes: {
            'server.address': location.host,
            'extension.mode': mode,
            'page.visibility_state': document.visibilityState
        },
        checkForUpdates: UpdatesCheckerClient.checkForUpdates,
        onNoProcessors: () => logger.debug("No processors found for current page"),
        onProcessorsMatched: observeSlowFrames
    });
}

run();