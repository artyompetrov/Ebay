import * as UpdatesCheckerClient from "./clients/UpdatesCheckerClient";
import {tryGetEbaySiteProcessor} from "./siteProcessors/EbaySiteProcessor";
import {ISiteProcessor} from "./siteProcessors/ISiteProcessor";
import {tryGetAuthPageProcessor} from "./siteProcessors/AuthPageProcessor";
import {tryGetSearchSitesProcessor} from "./siteProcessors/SearchSitesProcessor";
import {tryGetAvitoSavedSearchesProcessor} from "./siteProcessors/AvitoSavedSearchesPageProcessor";
import {Mode} from './mode';
import {tryGetEbayShippingRateTableSiteProcessor} from "./siteProcessors/EbayShippingRateTableSiteProcessor";
import {tryGetEbayMagSiteProcessor} from "./siteProcessors/EbayMagSiteProcessor";

async function getMatchingSiteProcessors(): Promise<ISiteProcessor[]> {
    const {mode} = await chrome.storage.local.get(['mode']);
    let currentMode = mode as Mode;
    if (!currentMode) {
        currentMode = Mode.NotSelected
    }

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

export async function run() {
    const actualVersion = await UpdatesCheckerClient.checkForUpdates();
    if (!actualVersion) return;

    const processors = await getMatchingSiteProcessors();
    if (processors.length > 0) {
        for (const processor of processors) {
            await processor.run();

            if (processor.breakAfterSearchProcessor) {
                break;
            }
        }
    } else {
        console.log("No processors found for current page");
    }
}

run();