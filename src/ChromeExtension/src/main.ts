import * as UpdatesCheckerClient from "./clients/UpdatesCheckerClient";
import {tryGetEbaySiteProcessor} from "./siteProcessors/EbaySiteProcessor";
import {ISiteProcessor} from "./siteProcessors/ISiteProcessor";
import {tryGetAuthPageProcessor} from "./siteProcessors/AuthPageProcessor";
import {tryGetSearchSitesProcessor} from "./siteProcessors/SearchSitesProcessor";

function getMatchingSiteProcessors(): ISiteProcessor[] {
    const processors = [
        tryGetAuthPageProcessor(),
        tryGetEbaySiteProcessor(),
        tryGetSearchSitesProcessor()
    ];
    return processors.filter((processor) => processor !== null);
}

export async function run() {
    const processors = getMatchingSiteProcessors();
    
    if (processors.length > 0) {
        let actualVersion= await UpdatesCheckerClient.checkForUpdates();

        if (actualVersion) {
            for (let processor of processors) {
                await processor.run()
            }
        }
    }
    else if (processors.length == 0)
    {
        console.log("No processors found for current page");
    }
}

run();