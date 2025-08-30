import { ISiteProcessor } from './ISiteProcessor';
import {ClientsFactory} from "../clients/ClientsFactory";
import {ProductWithId} from "../clients/Generated/EbayToolBackendClient";
import * as constants from '../constants';
import {Mode} from '../mode';

export function tryGetAvitoSavedSearchesProcessor(mode: Mode | undefined) : ISiteProcessor | null {
    if (mode !== Mode.Supplier) {
        return null;
    }
    
    const currentPage = location.protocol + '//' + location.host + location.pathname;

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
                    .sort((a, b) => b.productCalculationResult.revenueAvg - a.productCalculationResult.revenueAvg)
                    .map(x=> new ProductWithRegex(x, new RegExp(x.productRegex, "ig")))];
            
            let productsFoundInSearches = new Set<ProductWithId>();
            
            let elementCount = 1;
            for (let element of document.querySelectorAll<HTMLDivElement>('[data-marker="favorite-search/description"]')) {
                let splited = element.textContent.trim().split(',')
                
                let category = splited[0].trim().toLowerCase();
                let region = splited[1].trim().toLowerCase();
                let name = splited[2].trim().toLowerCase();

                let foundSmth = false;
                if (region === "все регионы" && category === "все категории") {
                    for (let interestingProduct of interestingProducts)
                    {
                        interestingProduct.regex.lastIndex = 0;
                        if (interestingProduct.regex.test(name)) {
                            productsFoundInSearches.add(interestingProduct.product)
                            foundSmth = true;

                            element.innerText += " " + Math.round(interestingProduct.product.productCalculationResult.revenueAvg)
                        }
                    }
                    if (!foundSmth) {
                        element.style.backgroundColor = "yellow";
                    }

                    element.innerText = elementCount + ". " + element.innerText
                }
                else
                {
                    element.style.backgroundColor = "pink";
                }

                elementCount ++;
            }
            
            let result = Array.from( interestingProducts
                .map(x=>x.product)
                .filter(x => !productsFoundInSearches.has(x)))
            
            if (result.length > 0)
            {
                const h1 = Array.from(document.querySelectorAll("h1"))
                    .find(el => el.textContent.trim() === "Избранное");
                
                let container = document.createElement("div");
                h1?.parentElement.prepend(container);
                const br = document.createElement("br");
                container?.append(br);

                const h2 = document.createElement("h1");
                h2.textContent = "Не найдено сохранненых поисков для:";
                container?.append(h2);
                                
                for (let product of result) {
                    const div = document.createElement("div");
                    let a = document.createElement("a");
                    a.textContent = product.name;
                    a.setAttribute("href", "https://www.avito.ru/all?q=" + product.name);
                    a.setAttribute("target", "_blank")
                    div.appendChild(a);
                    
                    for (let ruSearchQuery of product.ruSearchQueries) {
                        div.appendChild(document.createTextNode(" | "));
                        let a = document.createElement("a");
                        a.textContent = ruSearchQuery.query;
                        a.setAttribute("href", "https://www.avito.ru/all?q=" + encodeURIComponent(ruSearchQuery.query));
                        a.setAttribute("target", "_blank")
                        div.appendChild(a);
                    }
                    container?.append(div);

                    div.appendChild(document.createTextNode(" | " + Math.round(product.productCalculationResult.revenueAvg)));
                    
                    
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
