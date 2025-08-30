import { ISiteProcessor } from './ISiteProcessor';
import * as utils from "../infrastructure/Utils";
import {ClientsFactory} from "../clients/ClientsFactory";

export function tryGetEbayShippingRateTableSiteProcessor() : ISiteProcessor | null {
    let currentPage = location.protocol + '//' + location.host + location.pathname

    if (currentPage.startsWith("https://www.ebay.com/ship/rt/")) {

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

        for (let shippingType of shippingTypes) {
            for (let shippingRate of shippingType.rates) {
                if (!shippingRate.postZone) {
                    continue;
                }

                for (let counry of shippingRate.specifiedCountries) {
                    zoneByCountryCode.set(counry.threeLetterCode, shippingRate.postZone)
                }
            }
        }


        for (let countryCheckboxDiv of document.querySelectorAll<HTMLDivElement>('div #myModal .level2.checkbox')) {
            let label = countryCheckboxDiv.querySelector('label')
            let countryCode = label.getAttribute('for');

            if (zoneByCountryCode.has(countryCode)) {
                label.innerText = label.innerText + " (" + zoneByCountryCode.get(countryCode) + ")";
            } else {
                label.innerText = label.innerText + " (not found)";
            }

        }

        for (let region of document.querySelectorAll<HTMLTableCellElement>('td.regionsCellStyle')) {
            let foundRegions = new Set<number>
            for (var code of region.querySelector(':scope > span').textContent.split(',')) {
                if (zoneByCountryCode.has(code)) {
                    foundRegions.add(zoneByCountryCode.get(code))
                }
            }
            if (foundRegions.size > 0) {
                const br = document.createElement("br");
                const span = document.createElement("b");
                span.innerText = "Found regions: " + Array.from(foundRegions).join(", ");

                region.appendChild(br);
                region.appendChild(span);
            }
        }
    }

}