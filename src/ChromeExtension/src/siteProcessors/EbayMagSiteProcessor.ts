import { ISiteProcessor } from './ISiteProcessor';
import * as utils from "../infrastructure/Utils";
import {ClientsFactory} from "../clients/ClientsFactory";

export function tryGetEbayMagSiteProcessor() : ISiteProcessor | null {
    let currentPage = location.protocol + '//' + location.host + location.pathname

    if ((/^https:\/\/ebaymag\.com\/stock$/.test(currentPage)))
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

        const startBackground = async () => {
            while (true) {
                try {
                    await this.searchForDescription();
                }
                catch (e) {
                    console.error(e);
                }
                
                await utils.sleep(1000);
            }
        };

        let _ = startBackground()
    }

    private async searchForDescription() {
        let element = <HTMLDivElement>await utils.sleepElementLoaded('#productFormScrollarea', document);
        if (element.dataset.processed) return
        
        const textarea = <HTMLTextAreaElement>element.querySelector('textarea[placeholder^="Describe the item"]');

        const match = textarea?.value.match(/<!--\s*(.*?)\s*-->/);

        if (!match) return;
        
        const commentContent = match[1].trim(); // текст внутри <!-- -->
        
        const descDiv = [...document.querySelectorAll('div[role="presentation"]')].find(el => el.textContent === 'Description');

        const link = document.createElement('a');
        link.href = 'https://example.com';
        link.textContent = commentContent;
        link.style.display = 'block';
        descDiv.appendChild(link);
        
        element.dataset.processed = "true";
    }

}