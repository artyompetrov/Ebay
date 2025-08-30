import * as UpdatesCheckerClient from "./clients/UpdatesCheckerClient";
import {tryGetEbaySiteProcessor} from "./siteProcessors/EbaySiteProcessor";
import {ISiteProcessor} from "./siteProcessors/ISiteProcessor";
import {tryGetAuthPageProcessor} from "./siteProcessors/AuthPageProcessor";
import {tryGetSearchSitesProcessor} from "./siteProcessors/SearchSitesProcessor";
import {tryGetAvitoSavedSearchesProcessor} from "./siteProcessors/AvitoSavedSearchesPageProcessor";
import {Mode} from './mode';

async function getMatchingSiteProcessors(): Promise<ISiteProcessor[]> {
    const {mode} = await chrome.storage.local.get(['mode']);
    const currentMode = mode as Mode | undefined;
    const processors = [
        tryGetAvitoSavedSearchesProcessor(currentMode),
        tryGetAuthPageProcessor(),
        tryGetEbaySiteProcessor(currentMode),
        tryGetSearchSitesProcessor(currentMode)
    ];
    return processors.filter((processor) => processor !== null);
}

export async function run() {
    const processors = await getMatchingSiteProcessors();

    if (processors.length > 0) {
        const actualVersion = await UpdatesCheckerClient.checkForUpdates();

        if (actualVersion) {
            for (const processor of processors) {
                await processor.run();

                if (processor.breakAfterSearchProcessor) {
                    break;
                }
            }
        }
    } else {
        console.log("No processors found for current page");
    }
}

run();