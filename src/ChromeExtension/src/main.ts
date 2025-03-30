import * as UpdatesCheckerClient from "./clients/UpdatesCheckerClient";
import {tryGetEbaySiteProcessor} from "./siteProcessors/EbaySiteProcessor";
import {ISiteProcessor} from "./siteProcessors/ISiteProcessor";
import {tryGetAuthPageProssor} from "./siteProcessors/AuthPageProcessor";

function getMatchingSiteProcessors(): ISiteProcessor[] {
    const processors = [
        tryGetAuthPageProssor(),
        tryGetEbaySiteProcessor()
    ];
    return processors.filter((processor) => processor !== null);
}

export async function run() {
    const processors = getMatchingSiteProcessors();
    
    if (processors.length == 1) {
        let _ = UpdatesCheckerClient.checkForUpdates();
        
        await processors[0].run();
    }
    else if (processors.length == 0)
    {
        console.log("No processors found for current page");
    }
    else {
        throw new Error("More than one processor found for current page")
    }
}

run();