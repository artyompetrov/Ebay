import { ISiteProcessor } from './ISiteProcessor';
import * as utils from "../infrastructure/Utils";

export function tryGetEbayShippingRateTableSiteProcessor() : ISiteProcessor | null {
    let currentPage = location.protocol + '//' + location.host + location.pathname

    if (currentPage === "https://www.ebay.com/ship/rt") {

        return new EbayShippingRateTableSiteProcessor();
    }
    return null;
}

class EbayShippingRateTableSiteProcessor implements ISiteProcessor {
    breakAfterSearchProcessor: boolean = true;

    async run(): Promise<void> {
        let value = (<HTMLSelectElement>(await utils.sleepElementLoaded("#createRateTables", document))).value;
        
        if (value === "CREATE_INTERNATIONAL_RATE_TABLE") {
            for (let countryCheckboxDiv of document.querySelectorAll<HTMLDivElement>('div #myModal .level2.checkbox')) {
                let countryCode = countryCheckboxDiv.querySelector('label').getAttribute('for');
                countryCheckboxDiv.innerText = countryCheckboxDiv.innerText + " (" + countryCode + ")";
            }
        }
    }

}