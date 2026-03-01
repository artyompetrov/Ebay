import { ISiteProcessor } from './ISiteProcessor';
import * as utils from "../infrastructure/Utils";
import {ClientsFactory} from "../clients/ClientsFactory";

export function tryGetEbayMagSiteProcessor() : ISiteProcessor | null {
    let currentPage = location.protocol + '//' + location.host + location.pathname

    if ((/^https:\/ebaymag\.com\/stock$/.test(currentPage)))
    {
        return new EbayMagSiteProcessor();
    }
    return null;
}

class EbayMagSiteProcessor implements ISiteProcessor {
    breakAfterSearchProcessor: boolean = true;

    async run(): Promise<void> {
        await utils.sleepElementLoaded('div[role="button"]', document);

        let clientsFactory = new ClientsFactory();
        let backendClient = await clientsFactory.getEbayToolWebApiClient()

        let lotsForSale = await backendClient.getLotForSales()
        
        let skus = Array.from(document.querySelectorAll<HTMLDivElement>('div[role="button"]'))
            .filter(el => el.textContent.trim().length === 7);

        const lotForSaleBySku = new Map(lotsForSale.map(x => [x.id, x]));

        for (const skusElement of skus)
        {
            if (lotForSaleBySku.has(skusElement.textContent.trim()))
            {
                skusElement.style.color = 'red';
            }
        }
    }

}