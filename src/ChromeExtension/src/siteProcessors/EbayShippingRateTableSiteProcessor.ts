import { ISiteProcessor } from './ISiteProcessor';
import * as utils from "../infrastructure/Utils";
import {ClientsFactory} from "../clients/ClientsFactory";

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

        let clientsFactory = new ClientsFactory();
        let backendClient = await clientsFactory.getEbayToolBackendClient();
        
        let shippingTypes = await backendClient.getShippingRates();

        const zoneByCountryCode = new Map<string, number>();
        
        for (let shippingType of shippingTypes)
        {
            for (let shippingRate of shippingType.rates) {
                if (!shippingRate.postZone) {continue;}
                
                for (let counry of shippingRate.specifiedCountries) {
                    zoneByCountryCode.set(counry.threeLetterCode, shippingRate.postZone)
                }
            }
        }
        
        if (value === "CREATE_INTERNATIONAL_RATE_TABLE") {
            for (let countryCheckboxDiv of document.querySelectorAll<HTMLDivElement>('div #myModal .level2.checkbox')) {
                let label = countryCheckboxDiv.querySelector('label')
                let countryCode = label.getAttribute('for');
                
                if (zoneByCountryCode.has(countryCode)) {
                    label.innerText = label.innerText + " (" + zoneByCountryCode.get(countryCode) + ")";
                }
                else {
                    label.innerText = label.innerText + " (not found)";
                }
                
            }
        }
    }

}