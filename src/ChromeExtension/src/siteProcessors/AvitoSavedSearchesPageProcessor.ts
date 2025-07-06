import { ISiteProcessor } from './ISiteProcessor';
import {ClientsFactory} from "../clients/ClientsFactory";
import {ProductWithId} from "../clients/EbayToolBackendClient";
import * as constants from '../constants';

export function tryGetAvitoSavedSearchesProcessor() : ISiteProcessor | null {
    let currentPage = location.protocol + '//' + location.host + location.pathname

    if (currentPage === "https://www.avito.ru/autosearch") {

        return new AvitoSavedSearchesPageProcessor();
    }
    return null;
}


class AvitoSavedSearchesPageProcessor implements ISiteProcessor {
    breakAfterSearchProcessor: boolean = true;

    async run(): Promise<void> {
        window.onload = async function() {
            const ebayToolBackendClient = await new ClientsFactory().getEbayToolBackendClient();

            const interestingProducts = [...
                (await ebayToolBackendClient.getAllProducts())
                    .filter(x=> x.isInteresting)
                    .map(x=> new ProductWithRegex(x, new RegExp(x.productRegex, "ig")))];
            
            let productsFoundInSearches = new Set<ProductWithId>();
            for (let element of document.querySelectorAll<HTMLDivElement>('[data-marker="favorite-search/description"]')) {
                let splited = element.textContent.trim().split(',')
                
                let category = splited[0].trim().toLowerCase();
                let region = splited[1].trim().toLowerCase();
                let name = splited[2].trim().toLowerCase();

                if (region === "все регионы" && category === "все категории") {
                    for (let interestingProduct of interestingProducts)
                    {
                        interestingProduct.regex.lastIndex = 0;
                        if (interestingProduct.regex.test(name)) {
                            productsFoundInSearches.add(interestingProduct.product)
                        }
                    }
                }
                else
                {
                    element.style.backgroundColor = "yellow";
                }
            }
            
            let result = Array.from( interestingProducts
                .map(x=>x.product)
                .filter(x => !productsFoundInSearches.has(x)))
            
            if (result.length > 0)
            {
                const h1 = Array.from(document.querySelectorAll("h1"))
                    .find(el => el.textContent.trim() === "Избранное");

                const parent = h1?.parentElement;

                const br = document.createElement("br");
                parent?.append(br);

                const h2 = document.createElement("h2");
                h2.textContent = "Не найдено сохранненых поисков для:";
                parent?.append(h2);
                
                for (let product of result) {
                    const div = document.createElement("div");
                    let a = document.createElement("a");
                    a.textContent = product.name;
                    a.setAttribute("href", constants.Urls.backendUrl + "LotSales/" + product.id);
                    a.setAttribute("target", "_blank")
                    div.appendChild(a);
                    
                    for (let ruSearchQuery of product.ruSearchQueries) {
                        div.appendChild(document.createTextNode(" | "));
                        let a = document.createElement("a");
                        a.textContent = ruSearchQuery.query;
                        a.setAttribute("href", constants.Urls.backendUrl + "LotSales/" + product.id);
                        a.setAttribute("target", "_blank")
                        div.appendChild(a);
                    }
                    parent?.append(div);
                }
            }
        };
    }
}

class ProductWithRegex {
    product: ProductWithId;
    regex: RegExp;
    
    constructor(
        product: ProductWithId,
        regex: RegExp
    ) {
        this.product = product;
        this.regex = regex;
    }
}