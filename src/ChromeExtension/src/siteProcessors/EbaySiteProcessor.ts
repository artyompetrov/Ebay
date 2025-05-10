import * as EbayClient from "../clients/EbayClient"
import * as EbayToolBackendClient from "../clients/EbayToolBackendClient";
import * as utils from "../infrastructure/Utils";
import * as constants from '../constants';
import { ISiteProcessor } from './ISiteProcessor';
import {ClientsFactory} from "../clients/ClientsFactory";

const ebaySiteRegex: RegExp =  /(?:^|\.)ebay\.com$/i;

export function tryGetEbaySiteProcessor() : ISiteProcessor | null {
    let currentPage = location.protocol + '//' + location.host + location.pathname
    if (ebaySiteRegex.test(location.host) && currentPage !== constants.Urls.ebayAuthRedirectUrl) {
        
        return new EbaySiteProcessor();
    }
    return null;
}

class PurchaseInfoInner {
    constructor(quantity: number, date: Date, price?: Price | undefined) {
        this.quantity = quantity
        this.date = date
        this.price = price
    }

    quantity: number;
    price: Price | undefined;
    date: Date
}

class Price {
    constructor(price: number, currency: string) {

        this.currency = currency
        this.price = price
    }

    currency: string;
    price: number;
}


class ShippingParameters {
    constructor(regions: string[], zip: string | null) {
        this.regions = regions
        this.zip = zip
    }

    regions: string[];
    zip: string | null
}


class LotLink {
    constructor(id: number, link: HTMLAnchorElement, soldDate: Date) {
        this.id = id
        this.link = link
        this.soldDate = soldDate
        this.color = null
    }

    id: number;
    link: HTMLAnchorElement;
    soldDate: Date
    importantCount: number | null
    previousColor: string | null
    color: string | null
}


class EbaySiteProcessor implements ISiteProcessor {
    private readonly productFieldName = "productId";
    private readonly ignoreThatLotFormId = "ignoreThatLot"
    private readonly pcsFieldName = "pcs";
    private readonly autoPcsFieldName = "autoPcs";
    private readonly categoryPrefix = 'category_'
    private readonly panelClass = "panel-div";
    private readonly panelInputClass = "panel-input-div";
    private readonly formId = "product-form-id"
    private readonly errorElementId = "errorElement"
    private readonly submitId = "submitButton"
    private readonly marketplaceId = "EBAY_US"
    private readonly batchOpen = 5
    private readonly categoriesDiv = "categoriesDiv"
    private readonly ignoredLotDiv = "ignoredLotDiv"
    private readonly currentProductIdParamName = "tool_productId"
    private readonly lotNotSupported = false;
    private _lotInfo = new EbayToolBackendClient.LotInfo()
    private _purchaseHistory: EbayToolBackendClient.PurchaseInfo[] | null;
    private _titleChangeDate: string | null;
    private _serverLotInfo: EbayToolBackendClient.LotInfoWithProductId | undefined;
    private _allItemsCacheIdentifier = "ebayAllItems";
    private _needActualizationLotsIds: number[] = null
    private _serverAndEbayAreEqual = false;
    private _panel: HTMLDivElement;
    private _currentProductId: string
    private interestedInTopNItems = 10;
    private _ebayClient: EbayClient.EbayClient;
    private _ebayToolBackendClient: EbayToolBackendClient.EbayToolBackendClient;

    // Создадим эти классовые переменные
    private supportedShippingCountries = new Map<string, ShippingParameters>();
    private currencyMap = new Map<string, string>();

    constructor() {

        // Инициализация supportedShippingCountries
        this.supportedShippingCountries.set('DE', new ShippingParameters(['EUROPE', 'EUROPEAN_UNION'], null));
        this.supportedShippingCountries.set('IT', new ShippingParameters(['EUROPE', 'EUROPEAN_UNION'], null));
        this.supportedShippingCountries.set('FR', new ShippingParameters(['EUROPE', 'EUROPEAN_UNION'], null));
        this.supportedShippingCountries.set('GB', new ShippingParameters(['EUROPE'], "SW1W 0NY"));
        this.supportedShippingCountries.set('BG', new ShippingParameters(['EUROPE', 'EUROPEAN_UNION'], null));
        this.supportedShippingCountries.set('LT', new ShippingParameters(['EUROPE', 'EUROPEAN_UNION'], null));
        this.supportedShippingCountries.set('SK', new ShippingParameters(['EUROPE', 'EUROPEAN_UNION'], null));
        this.supportedShippingCountries.set('LV', new ShippingParameters(['EUROPE', 'EUROPEAN_UNION'], null));
        this.supportedShippingCountries.set('RO', new ShippingParameters(['EUROPE', 'EUROPEAN_UNION'], null));
        this.supportedShippingCountries.set('EE', new ShippingParameters(['EUROPE', 'EUROPEAN_UNION'], null));
        this.supportedShippingCountries.set('PL', new ShippingParameters(['EUROPE', 'EUROPEAN_UNION'], null));
        this.supportedShippingCountries.set('US', new ShippingParameters([], "40202"));
        this.supportedShippingCountries.set('AU', new ShippingParameters([], "3000–3999"));

        // Инициализация currencyMap
        this.currencyMap.set("USD", "US $");
        this.currencyMap.set("AUD", "AU $");
        this.currencyMap.set("CAD", "C $");
    }


    private extractPrice(price: string): Price {
        let priceTrimmed = price.trim()
        let matches = priceTrimmed.match(/^(\D+)(\d+(?:,\d+)?(?:[.]\d+)?\s*)([(\/].+|$)/)
        if (matches) {
            return new Price(parseFloat(matches[2].replace(',', '')), matches[1].trim())
        } else {
            let matches = priceTrimmed.match(/^(\d+(?:,\d+)?(?:[.]\d+)?)(\D+)([(\/].+|$)/)
            if (matches) {
                return new Price(parseFloat(matches[1].replace(',', '')), matches[2].trim())
            }
            throw new Error("unexpected price: '" + price + "'")
        }
    }
    
    private async createPanel(): Promise<HTMLDivElement> {
        let bodyElement = await utils.sleepElementLoaded('body', document);

        let panel = <HTMLDivElement>bodyElement.querySelector('div.' + this.panelClass)

        if (panel !== null && panel !== undefined) {
            panel.style.cssText = `background-color: white;`
            return panel;
        }

        let styles = `
    .${this.panelClass} {
      text-align: left;
      padding: 15px;
      border: 3px solid #0000cc;
      border-radius: 10px;
      color: #0000cc;
      position:fixed;
      z-index:100;
      left:1%;
      bottom:5%;
      background-color: white;
    }
    
    .${this.panelInputClass} label {
      font-weight: bold;
      display: block;
      width: 140px;
      float: left;
    }
    
    .${this.panelInputClass} input {
      width: 200px;
    }
    
    #${this.pcsFieldName} {
      width: 100px;
    }
    
    #${this.autoPcsFieldName} {
      width: 100px;
    }
    
    .${this.panelInputClass} select {
      width: 200px;
    }
    
    .${this.panelInputClass} label:after { content: ": " }
    
    #${this.categoriesDiv} label {
        padding-right: 10px;
    }
    
    #${this.submitId} {
        width: 350px;
        height: 30px;
    }
`

        let styleSheet = document.createElement("style")
        styleSheet.innerText = styles
        bodyElement.appendChild(styleSheet)

        let div = document.createElement('div');
        div.title = "Белый цвет - на сервере нет информации о лоте, желтый цвет - на сервере есть информация о лоте, но после последней актуализации были новые продажи, красный цвет - информация на сервере и в лоте не совпадает, требуется актуализация, зеленый цвет - информация на сервере актуальна."
        div.classList.add(this.panelClass);
        let itemId = location.pathname.match(/\/itm\/([0-9]+)/)[1];
        let domain = location.hostname;
        let historyButtonHref = `https://${domain}/bin/purchaseHistory?item=${itemId}`;
        let revisionsButtonHref = `https://${domain}/rvh/${itemId}`;
        div.innerHTML = `
     <a href="${historyButtonHref}" target="_blank">История продаж лота</a>
        <br><a href="${revisionsButtonHref}" target="_blank">История изменений лота</a>
        <br>Бэкенд: <a href="${constants.Urls.backendUrl}" target="_blank">${constants.Urls.backendUrl}</a>
        <br><br>
        <div id="${this.ignoredLotDiv}" style="color: red;" hidden="hidden">Лот в игноре</div>
    `

        let formIgnoreThatLot = document.createElement('form')
        formIgnoreThatLot.id = this.ignoreThatLotFormId
        div.appendChild(formIgnoreThatLot)

        formIgnoreThatLot.addEventListener("submit", async (event: SubmitEvent) => {
            await this.handleIgnoreThatLotSubmit(event)
        });

        let form = document.createElement('form')
        form.id = this.formId
        // language=HTML
        form.innerHTML = `
            <div class="${this.panelInputClass}">
                <label for="${this.productFieldName}">Товар</label>
                <select name="${this.productFieldName}" id="${this.productFieldName}">
                    <option value="">Выберите товар</option>
                </select>
                <br>
                <label for="${this.pcsFieldName}">PCS</label>
                <input id="${this.pcsFieldName}" type="number" name="${this.pcsFieldName}" title="Вручную введенное количество"/>
                <input id="${this.autoPcsFieldName}" type="text" name="${this.autoPcsFieldName}"
                       title="Автоматически определенное количество (красный цвет - невозможно автоматически определить количество, желтый цвет - есть подозрение на неточность, зеленый - все ОК)"
                       readonly/>
            </div>
            <br>
            <div id="${this.categoriesDiv}">
            </div>
            <div style="color: red;" id="${this.errorElementId}"></div>
            <br>
            <input id="${this.submitId}" type="submit" value="Save" disabled/>
        `;

        form.addEventListener("submit", async (event: SubmitEvent) => {
            await this.handleSubmit(event)
        });

        div.appendChild(form)
        bodyElement.appendChild(div);
        div.hidden = true
        this._panel = div;
    }

    async handleIgnoreThatLotSubmit(event: SubmitEvent) {
        event.preventDefault();
        await this.ignoreThatLot()
    }


    async  ignoreThatLot() {
        console.log("Ignoring lot " + this._lotInfo.lotId + " for product " + this._currentProductId)
        await this._ebayToolBackendClient.ignoreLots([this._lotInfo.lotId], this._currentProductId)
        this.showThatLotIsIgnored();
        window.close()
    }

    async createOpenMultipleButton(): Promise<HTMLDivElement> {
        let bodyElement = await utils.sleepElementLoaded('body', document);

        let panel = bodyElement.querySelector('div.' + this.panelClass)

        if (panel !== null && panel !== undefined) return <HTMLDivElement>panel;

        let styles = `
    .${this.panelClass} {
      text-align: left;
      padding: 15px;
      border: 3px solid #0000cc;
      border-radius: 10px;
      color: #0000cc;
      position:fixed;
      z-index:100;
      left:1%;
      bottom:5%;
      background-color: white;
    }
    
    #${this.submitId} {
        width: 120px;
        height: 30px;
    }
`

        let styleSheet = document.createElement("style")
        styleSheet.innerText = styles
        bodyElement.appendChild(styleSheet)

        let div = document.createElement('div');
        div.classList.add(this.panelClass);

        let form = document.createElement('form')
        form.id = this.formId

        // language=HTML
        form.innerHTML = `
            <input id="${this.submitId}" type="submit" value="Открыть ${this.batchOpen} лотов"/>
        `;

        form.addEventListener("submit", async (event: SubmitEvent) => {
            event.preventDefault()
            if (this._needActualizationLotsIds === null) return;
            if (this._needActualizationLotsIds.length === 0) {
                window.close()
            }

            let lastWindow: WindowProxy;

            for (let lotId of this._needActualizationLotsIds.slice(0, this.batchOpen)) {
                let url = "https://www.ebay.com/itm/" + lotId + "?" + this.currentProductIdParamName + "=" + this._currentProductId;
                lastWindow = window.open(url, '_blank');

                await utils.sleep(50);
            }

            lastWindow?.focus()
        });

        div.appendChild(form)
        bodyElement.appendChild(div);

        return div
    }


    private async handleSubmit(event: SubmitEvent): Promise<void> {
        try {
            event.preventDefault();
            let data = new FormData(<HTMLFormElement>event.target);


            let categories = [];
            data.forEach(function (value, key) {

                if (key.startsWith(this.categoryPrefix)) {
                    let category = key.replace(this.categoryPrefix, "")
                    categories.push(new EbayToolBackendClient.CategoryValue({type: category, value: value.toString()}))
                } else {
                    this._lotInfo[key] = value;
                }
            }, this);

            this._lotInfo.categories = categories;

            let productId = data.get('productId').toString();

            if (!productId) {
                // noinspection ExceptionCaughtLocallyJS
                throw new Error("Product id not set");
            }

            console.log("Sending to backend: " + JSON.stringify(this._lotInfo))
            await this._ebayToolBackendClient.upsertLotInfo(this._lotInfo, productId)

            await this.productPage()

            if (this._serverAndEbayAreEqual) {
                window.close()
            }
        } catch (error) {
            await this.showAndSaveError(error)
        }
    }


    private fillSoldItemsResult(fixedPriceRows: HTMLTableRowElement[], result: PurchaseInfoInner[]) {
        for (let fixedPriceRow of fixedPriceRows) {
            let columns = [...fixedPriceRow.querySelectorAll('td')]
                .map(function (item) {
                    return item.innerText;
                })

            let price = columns[1]

            if (price === "Expired" || price === "Declined" || price === "Pending") {
                continue
            }

            if (price !== "Sold as a special offer" && price !== "Counter-offered" && price !== "Accepted") {

                let priceExtracted = this.extractPrice(price)

                let lotInfoCurrency = this.currencyMap.has(this._lotInfo.currency) ? this.currencyMap.get(this._lotInfo.currency) : this._lotInfo.currency

                if (priceExtracted.currency !== lotInfoCurrency) {
                    throw new Error("currency doesn't match with lot currency lot currency " + lotInfoCurrency + " extracted currency " + priceExtracted.currency)
                }
                result.push(new PurchaseInfoInner(parseInt(columns[2]), this.parseDate(columns[3]), priceExtracted))
            } else {
                result.push(new PurchaseInfoInner(parseInt(columns[2]), this.parseDate(columns[3])))
            }
        }
    }


    private parseDate(dateString: string): Date {
        let matches = dateString.match(/(\d+\s[A-z]+\s\d+)\sat\s(\d+):(\d+):(\d+)(am|pm)\s([A-z]+)/)

        if (!matches) {
            matches = dateString.match(/([A-z]+\s\d+,\s\d+)\s(\d+):(\d+):(\d+)\s(PM|AM)\s([A-z]+)/)
        }

        if (!matches) throw new Error("Unable to parse time in " + dateString)

        let date = new Date(Date.parse(matches[1] + ' 00:00:00.000Z'))

        date.setUTCHours(parseInt(matches[2]));
        date.setUTCMinutes(parseInt(matches[3]));
        date.setUTCSeconds(parseInt(matches[4]));

        if (matches[5].toLowerCase() === "pm" && date.getUTCHours() !== 12) {
            date.setHours(date.getHours() + 12);
        }

        if (matches[5].toLowerCase() === "am" && date.getUTCHours() === 12) {
            date.setHours(date.getHours() - 12);
        }

        switch (matches[6].toUpperCase()) {
            case "MSK":
                date.setUTCHours(date.getUTCHours() - 3);
                break;
            case "PST":
                date.setUTCHours(date.getUTCHours() + 8);
                break;
            case "PDT":
                date.setUTCHours(date.getUTCHours() + 7);
                break;
            default:
                throw new Error("unknown timezone " + matches[6]);
        }

        return date
    }


    private hasShippingToCountry(country: string, shipsTo: Set<string>, excludes: Set<string>) {

        let countryParams = this.supportedShippingCountries.get(country);

        let shipsToRegionFound = false
        for (let region of countryParams.regions) {
            if (shipsTo.has(region)) {
                shipsToRegionFound = true
                break;
            }
        }

        let excludesRegionFound = false
        for (let region of countryParams.regions) {
            if (excludes.has(region)) {
                excludesRegionFound = true
                break;
            }
        }

        return (shipsTo.has('WORLDWIDE') || shipsToRegionFound || shipsTo.has(country)) && !excludesRegionFound && !excludes.has(country);
    }


    private showThatLotIsIgnored() {
        let ignoredLotDivElement = <HTMLDivElement>this._panel.querySelector('div#' + this.ignoredLotDiv);
        let ignoreThatLotFormElement = <HTMLDivElement>this._panel.querySelector('form#' + this.ignoreThatLotFormId);
        ignoredLotDivElement.hidden = false;
        ignoreThatLotFormElement.hidden = true;
    }


    private async fillIsIgnored() {
        let isIgnored = await this._ebayToolBackendClient.getIsLotIgnoredForProduct(this._currentProductId, this._lotInfo.lotId);
        if (!isIgnored) return
        this.showThatLotIsIgnored();
    }


    private fillPurchaseHistory() {
        let itemId = location.pathname.match(/\/itm\/([0-9]+)/)[1];
        let purchaseHistoryUrl = `https://${location.hostname}/bin/purchaseHistory?item=${itemId}`;
        let id = 'PurchaseHistoryFrame';
        if (document.getElementById(id)) return;
        const myIframe = document.createElement('iframe');
        myIframe.id = id;
        myIframe.src = purchaseHistoryUrl;

        // Можно задать стили или атрибуты:
        myIframe.width = '1920';
        myIframe.height = '1080';
        myIframe.style.border = '1px solid #ccc';

        document.body.appendChild(myIframe);

        myIframe.addEventListener('load', async () => {
            try {
                // Проверяем, можем ли мы получить доступ к содержимому
                const iframeDoc = myIframe.contentDocument;
                if (!iframeDoc) {
                    console.error('unable to get content inside iframe');
                    return;
                }
                await utils.sleepElementLoaded('footer', iframeDoc)

                console.log("fillPurchaseHistory")

                let result = new Array<PurchaseInfoInner>();
                let fixedPriceBlock = iframeDoc.querySelector('div.fixed-price tbody')
                if (fixedPriceBlock !== null) {
                    let fixedPriceRows = [...fixedPriceBlock.querySelectorAll('tr')]
                    this.fillSoldItemsResult(fixedPriceRows, result);
                }

                let offerBlock = iframeDoc.querySelector('div.offer tbody')
                if (offerBlock !== null) {
                    let offerRows = [...offerBlock.querySelectorAll('tr')]
                    this.fillSoldItemsResult(offerRows, result);
                }

                this._purchaseHistory = result.sort(function (a, b) {
                    return b.date.getTime() - a.date.getTime();
                }).map(function (x) {

                    return new EbayToolBackendClient.PurchaseInfo({
                        date: x.date.toISOString(), quantity: x.quantity, price: x.price?.price
                    })
                });

            } catch (error) {
                console.error(
                    'Нas no access to iframe due to Same-Origin Policy:',
                    error
                );
            }
        });
    }


    private fillUpdateTitleDate() {

        let itemId = location.pathname.match(/\/itm\/([0-9]+)/)[1];
        let url = `https://${location.hostname}/rvh/${itemId}`;
        let id = 'UpdateTitleDateFrame';
        if (document.getElementById(id)) return;
        const myIframe = document.createElement('iframe');
        myIframe.id = id;
        myIframe.src = url;

        // Можно задать стили или атрибуты:
        myIframe.width = '1920';
        myIframe.height = '1080';
        myIframe.style.border = '1px solid #ccc';

        document.body.appendChild(myIframe);

        myIframe.addEventListener('load', async () => {
            try {
                // Проверяем, можем ли мы получить доступ к содержимому
                const iframeDoc = myIframe.contentDocument;
                if (!iframeDoc) {
                    console.error('unable to get content inside iframe');
                    return;
                }
                await utils.sleepElementLoaded('footer', iframeDoc)

                console.log("parseRevisionSummary")

                let table = iframeDoc.querySelector('div#vi-revision-history-layout-container table')
                if (table) {
                    let rows = [...table.querySelectorAll('tr')]

                    for (let row of rows.reverse()) {
                        let columns = [...row.querySelectorAll('td')]
                        if (columns.length === 0) continue;
                        let changes = columns[2].innerText;
                        if (changes.includes('Title')) {
                            let date = columns[0].innerText
                            let time = columns[1].innerText

                            this._titleChangeDate = this.parseDate(date + " " + time).toISOString()
                            break;
                        }
                    }
                } else {
                    this._titleChangeDate = new Date(0).toISOString()
                }

            } catch (error) {
                console.error(
                    'Нas no access to iframe due to Same-Origin Policy:',
                    error
                );
            }
        });
    }


    private getCurrentProductIdParam(): string | undefined {
        let currentProductId = new URL(document.location.href).searchParams?.get(this.currentProductIdParamName)?.trim()?.toLowerCase()
        if (currentProductId) return currentProductId

        if (document.referrer) {

            let productId = new URL(document.referrer).searchParams?.get(this.currentProductIdParamName)?.trim()?.toLowerCase()
            if (productId) {
                let currentUrl = new URL(document.location.href);
                currentUrl.searchParams.set(this.currentProductIdParamName, productId);
                window.history.pushState({}, null, currentUrl.toString());
            }

            return productId;
        }
    }


    async fillProduct() {
        let productField = this._panel.querySelector('select#' + this.productFieldName);
        let ignoreThatLot = this._panel.querySelector("form#" + this.ignoreThatLotFormId)
        let productIdServer = this._serverLotInfo?.productId?.trim()?.toLowerCase()

        let products = await this.getAllProductsCached(this._currentProductId)
        for (let i = 0; i < products.length; i++) {
            let opt = document.createElement('option');
            opt.value = products[i].id;
            opt.innerHTML = products[i].name;

            if (productIdServer !== undefined) {
                if (productIdServer === products[i].id.trim().toLowerCase()) {
                    opt.selected = true
                }
            } else if (this._currentProductId === products[i].id.trim().toLowerCase()) {
                opt.selected = true
                ignoreThatLot.innerHTML = `<button>Игнорировать для ${products[i].name}</button><br><br>`
            }

            productField.appendChild(opt);
        }
    }

    async getAllProductsCached(productId: string | null) {
        let cached = await utils.getCachedDataOrFallback(this._allItemsCacheIdentifier, async () => {
                return await this._ebayToolBackendClient.getAllProducts();
            },
            60 * 60)

        productId = productId?.trim()?.toLowerCase()
        if (productId && !cached.some(p => p.id.trim().toLowerCase() === productId)) {
            console.log(`Product ID ${productId} not found in cache, refreshing cache, clearing cache...`);
            utils.removeFromCache(this._allItemsCacheIdentifier);

            return await utils.getCachedDataOrFallback(this._allItemsCacheIdentifier, async () => {
                    return await this._ebayToolBackendClient.getAllProducts();
                },
                60 * 60);
        }

        return cached;
    }

    async fillManualCondition(extractedDataByFieldName: {}) {
        let categoriesDivElement = this._panel.querySelector('div#' + this.categoriesDiv);
        categoriesDivElement.innerHTML = ""

        let serverCategories = this._serverLotInfo?.lotInfo?.categories?.reduce((dictionary, value) => {
            dictionary[value.type] = value.value;
            return dictionary;
        }, {});

        let categoryTypes = await this._ebayToolBackendClient.getCategories()

        for (let categoryType of categoryTypes) {
            let categoryDiv = document.createElement("div")

            let extractedData: EbayToolBackendClient.LotDataExtractedItem[] = extractedDataByFieldName[categoryType.type];

            let extractedDataCounts = extractedData?.reduce((dictionary, value) => {
                dictionary[value.value] = value.extractorInfo.length;
                return dictionary;
            }, {});

            let serverValue = serverCategories ? serverCategories[categoryType.type] : undefined

            let minMatchesCount = 0
            let inputToCheck: HTMLInputElement = undefined

            for (let categoryItem of categoryType.items) {
                let isInExtracted = extractedDataCounts && categoryItem.id in extractedDataCounts

                let input = <HTMLInputElement>document.createElement("input")
                let label = <HTMLLabelElement>document.createElement("label")
                let inputId = 'radio_' + categoryType.type + '_' + categoryItem.id
                input.type = 'radio'
                input.id = inputId
                input.name = this.categoryPrefix + categoryType.type
                input.value = categoryItem.id
                if (serverValue && serverValue === categoryItem.id) {
                    inputToCheck = input
                }

                if (isInExtracted) {
                    label.style.color = "green"
                    label.title = "Зеленый цвет - автоматически определенная категория"

                    if (!serverValue) {
                        let currentCount = extractedDataCounts[categoryItem.id]
                        if (currentCount > minMatchesCount) {
                            inputToCheck = input
                            minMatchesCount = currentCount
                        }
                    }
                }

                label.innerText = categoryItem.description
                label.htmlFor = inputId

                categoryDiv.appendChild(input)
                categoryDiv.appendChild(label)

                if (!inputToCheck && extractedDataCounts) {
                    inputToCheck = input
                }
            }

            if (inputToCheck) {
                inputToCheck.checked = true;
            }

            categoriesDivElement.appendChild(categoryDiv);
        }
    }


    async getServerLotInfo(): Promise<void> {
        try {

            this._serverLotInfo = await this._ebayToolBackendClient.getLotInfo(this._lotInfo.lotId);
        } catch (error) {
            if (error instanceof EbayToolBackendClient.NotFoundProblemDetailedInfo) {
                return;
            }

            throw error;
        }
    }


    async fillPcs(extractedDataByFieldName: {}) {
        let pcsField = <HTMLInputElement>this._panel.querySelector('input#' + this.pcsFieldName);
        let autoPcsField = <HTMLInputElement>this._panel.querySelector('input#' + this.autoPcsFieldName);

        let fillManualWithAutoValue : boolean
        let extractedData: EbayToolBackendClient.LotDataExtractedItem[] = extractedDataByFieldName["pcs"];

        if (extractedData.length > 0) {

            autoPcsField.value = extractedData[0].value;

            if (extractedData.length === 1) {
                autoPcsField.style.backgroundColor = constants.Colors.lightGreen;

                fillManualWithAutoValue = true
            } else {
                if (extractedData[0].extractorInfo.length > extractedData[1].extractorInfo.length) {
                    autoPcsField.style.backgroundColor = constants.Colors.lightYellow;

                    fillManualWithAutoValue = false
                } else {
                    autoPcsField.style.backgroundColor = constants.Colors.lightPink;
                    fillManualWithAutoValue = false
                }
            }

        } else {
            autoPcsField.value = "1"
            autoPcsField.style.backgroundColor = constants.Colors.lightYellow;

            fillManualWithAutoValue = false
        }

        let serverPcs = this._serverLotInfo?.lotInfo?.pcs
        if (serverPcs !== undefined) {
            pcsField.value = serverPcs.toString()
        } else if (fillManualWithAutoValue) {
            pcsField.value = autoPcsField.value
        }
    }


    async compareLotInfos(serverLotInfoWithProductId: EbayToolBackendClient.LotInfoWithProductId) {
        if (serverLotInfoWithProductId === undefined) return;

        let serverLotInfoJson = serverLotInfoWithProductId.lotInfo.toJSON()
        serverLotInfoJson["pcs"] = undefined
        serverLotInfoJson["categories"] = undefined
        serverLotInfoJson["description"] = undefined
        serverLotInfoJson["shortDescription"] = undefined
        serverLotInfoJson["seller"] = undefined
        serverLotInfoJson["purchaseHistory"] = undefined

        let lotInfoJson = this._lotInfo.toJSON()
        lotInfoJson["pcs"] = undefined
        lotInfoJson["categories"] = undefined
        lotInfoJson["description"] = undefined
        lotInfoJson["shortDescription"] = undefined
        lotInfoJson["seller"] = undefined
        lotInfoJson["purchaseHistory"] = undefined

        let serverLotInfoJsonString = JSON.stringify(serverLotInfoJson)
        let currentPageLotInfoJsonString = JSON.stringify(lotInfoJson)

        let panel = <HTMLDivElement>await utils.sleepElementLoaded('div.' + this.panelClass, document);
        if (serverLotInfoJsonString === currentPageLotInfoJsonString) {
            let serverMaxDate = utils.getMax(serverLotInfoWithProductId.lotInfo.purchaseHistory.map(x => {
                if (x.price !== undefined) {
                    return new Date(x.date).getTime()
                } else return 0;
            }))
            let ebayMaxDate = utils.getMax(this._lotInfo.purchaseHistory.map(x => {
                if (x.price !== undefined) {
                    return new Date(x.date).getTime();
                } else return 0;
            }))

            if (ebayMaxDate === 0 || serverMaxDate === ebayMaxDate) {
                panel.style.cssText = `background-color: ${constants.Colors.lightGreen};`
                this._serverAndEbayAreEqual = true;
            } else {
                panel.style.cssText = `background-color: ${constants.Colors.lightYellow};`
                console.log(`Update needed because last sale server ${serverMaxDate} and ebay last sale ${ebayMaxDate}`)
            }
        } else {
            panel.style.cssText = `background-color: ${constants.Colors.lightPink};`
            console.log(`Update needed because server and ebay lot info differs`)
        }

        console.log("Received from server: " + serverLotInfoJsonString)
        console.log("CurrentPage: " + currentPageLotInfoJsonString)
    }


    async extractManualFieldsData(): Promise<{}> {
        let extractedData = (await this._ebayToolBackendClient.extractData(new EbayToolBackendClient.LotDataToExtract({
            name: this._lotInfo.name,
            conditionDescription: this._lotInfo.conditionDescription,
            condition: this._lotInfo.condition,
            description: this._lotInfo.description
        }))).reduce((dictionary, value) => {
            dictionary[value.fieldName] = value.extractedData;
            return dictionary;
        }, {})

        console.log(JSON.stringify(extractedData))
        return extractedData
    }


    getShippingCountry(ebayItem: EbayClient.Item) {
        let shipsTo = ebayItem.shipToLocations.regionIncluded.reduce((set, value) => {
            set.add(value.regionId)
            return set
        }, new Set<string>());
        let excludes = ebayItem.shipToLocations.regionExcluded.reduce((set, value) => {
            set.add(value.regionId)
            return set
        }, new Set<string>());

        let currentCountry = ebayItem.itemLocation.country

        let supportedShippingCountriesArray = Array.from(this.supportedShippingCountries.keys())
        let position = -1
        while (!this.supportedShippingCountries.has(currentCountry) || !this.hasShippingToCountry(currentCountry, shipsTo, excludes)) {
            position++;
            if (position >= supportedShippingCountriesArray.length) throw new Error("Position is greater than supportedShippingCountriesArray length");
            currentCountry = supportedShippingCountriesArray[position]
        }
        return currentCountry;
    }


    async getEbayItem(): Promise<void> {
        let ebayItem = await this._ebayClient.getItemByLegacyId(
            undefined,
            this._lotInfo.lotId.toString(),
            undefined,
            undefined,
            undefined,
            this.marketplaceId);

        let shippingCountry = this.getShippingCountry(ebayItem);
        let zipCode = this.supportedShippingCountries.get(shippingCountry).zip ?? undefined

        let shippingHeader: string;
        if (zipCode) {
            shippingHeader = `contextualLocation=country%3D${shippingCountry}%2Czip%3D${zipCode}`;
        } else {
            shippingHeader = `contextualLocation=country%3D${shippingCountry}`;
        }

        let ebayItemWithShipping = await this._ebayClient.getItemByLegacyId(
            undefined,
            this._lotInfo.lotId.toString(),
            undefined,
            undefined,
            shippingHeader,
            this.marketplaceId);

        await this.fillLotInfo(ebayItemWithShipping, shippingCountry)
    }


    addShipping(ebayItem: EbayClient.Item) {
        let shipping = undefined;
        let shippingAdditional = undefined;
        for (let shippingOption of ebayItem.shippingOptions) {

            let shippingCurrencyValue = shippingOption.shippingCost.convertedFromCurrency ?? shippingOption.shippingCost.currency;
            let shippingValue = shippingOption.shippingCost.convertedFromValue ?? shippingOption.shippingCost.value;

            let shippingAdditionalCurrencyValue = undefined;
            let shippingAdditionalValue = undefined;
            
            if (shippingOption.additionalShippingCostPerUnit) {
                shippingAdditionalCurrencyValue = shippingOption.additionalShippingCostPerUnit.convertedFromCurrency ?? shippingOption.additionalShippingCostPerUnit.currency;
                shippingAdditionalValue = shippingOption.additionalShippingCostPerUnit.convertedFromValue ?? shippingOption.additionalShippingCostPerUnit.value;
            }

            if (shippingValue < shipping || shipping === undefined) {
                shipping = parseFloat(shippingValue);
                if (shippingAdditionalValue) {
                    shippingAdditional = parseFloat(shippingAdditionalValue);
                }

                if (this._lotInfo.currency != shippingCurrencyValue)
                    throw new Error("Shipping and lot currency mismatch lot + " + this._lotInfo.currency + " shipping " + shippingCurrencyValue);

                if (shippingAdditionalCurrencyValue && this._lotInfo.currency != shippingAdditionalCurrencyValue)
                    throw new Error("Shipping additional and lot currency mismatch lot + " + this._lotInfo.currency + " shipping " + shippingAdditionalCurrencyValue);
            }
        }

        this._lotInfo.shipping = shipping;
        this._lotInfo.shippingAdditional = shippingAdditional ?? 0.0;
    }


    async fillLotInfo(ebayItem: EbayClient.Item, shippingCountry: string) {
        console.log(JSON.stringify(ebayItem))

        if (ebayItem.price.convertedFromValue === undefined) {
            this._lotInfo.price = parseFloat(ebayItem.price.value)
            this._lotInfo.currency = ebayItem.price.currency
        } else {
            this._lotInfo.price = parseFloat(ebayItem.price.convertedFromValue)
            this._lotInfo.currency = ebayItem.price.convertedFromCurrency
        }

        this._lotInfo.name = ebayItem.title

        this._lotInfo.seller = ebayItem.seller.username

        this._lotInfo.condition = ebayItem.condition ?? "--"
        if (ebayItem.lotSize > 0) {
            this._lotInfo.lotSize = ebayItem.lotSize
        }

        this._lotInfo.conditionDescription = ebayItem.conditionDescription

        this._lotInfo.description = ebayItem.description

        this._lotInfo.locatedIn = ebayItem.itemLocation.country

        this._lotInfo.shortDescription = ebayItem.shortDescription

        this._lotInfo.shippingCountry = shippingCountry;
        this.addShipping(ebayItem);

        //todo categoryPath
    }


    async waitForPurchaseHistoryAndTitleDate() {
        let counter = 0;
        while (!this._purchaseHistory || !this._titleChangeDate) {
            await utils.sleep(100);
            console.log("retry " + counter)
            if (counter > 600) {
                throw new Error("waitForPurchaseHistoryAndTitleDate run out of retries")
            }
        }

        const titleChangeDate = new Date(this._titleChangeDate);
        this._lotInfo.purchaseHistory = this._purchaseHistory.filter(purchase =>
            new Date(purchase.date) >= titleChangeDate
        );
        this._lotInfo.titleChangeDate = this._titleChangeDate;
    }


    async getDataFromPage(): Promise<void> {
        let lotId = location.pathname.match(/\/itm\/([0-9]+)/)[1];
        this._lotInfo.lotId = parseInt(lotId)

        await Promise.all([
            this.fillProduct(),
            this.fillIsIgnored(),
            this.getEbayItem(),
            this.getServerLotInfo(),
        ]);

        let extractedDataByFieldName = await this.extractManualFieldsData();

        this.fillPurchaseHistory();
        this.fillUpdateTitleDate();

        await Promise.all([
            this.waitForPurchaseHistoryAndTitleDate(),
            this.fillManualCondition(extractedDataByFieldName),
            this.fillPcs(extractedDataByFieldName),
        ]);

        if (this.lotNotSupported) {
            await this.ignoreThatLot();
        }

        await this.compareLotInfos(this._serverLotInfo);
    }


    async showAndSaveError(error: Error) {

        let errorText: string
        if (error instanceof EbayToolBackendClient.ValidationProblemDetailedInfo) {
            let validationError = <EbayToolBackendClient.ValidationProblemDetailedInfo>error
            errorText = JSON.stringify(validationError.errors)
        } else {
            errorText = error.stack;
        }

        console.log("ERROR " + errorText + " " + JSON.stringify(error))

        let errorDiv = await utils.sleepElementLoaded('div.' + this.panelClass + ' #' + this.errorElementId, document)
        let span = document.createElement('span');

        span.innerHTML = errorText
        errorDiv.appendChild(span)
        errorDiv.appendChild(document.createElement('br'))
        await this.saveErrorToBackend(error);
    }


    async hideErrorsAndEnableSubmit() {
        let submitButton = <HTMLInputElement>(await utils.sleepElementLoaded('#' + this.submitId, document))
        submitButton.disabled = false;
        let errorDiv = await utils.sleepElementLoaded('div.' + this.panelClass + ' #' + this.errorElementId, document)
        errorDiv.innerHTML = ""
    }

    async productPage() {
        console.log("productPage")

        await this.createPanel()
        try {
            await this.getDataFromPage();
            await this.hideErrorsAndEnableSubmit()
        } catch (error) {
            await this.showAndSaveError(error);
        }
        this._panel.hidden = false;
    }

    async searchPage() {
        console.log("SearchPage")

        //только на странице проданные лоты
        if (new URL(document.location.href).searchParams?.get('LH_Sold')?.trim() !== "1") return;


        let searchResults = await utils.sleepElementLoaded('ul.srp-results', document)

        if (!document.querySelector("div.srp-save-null-search")) { // что-то найдено

            let links: LotLink[] = [];
            for (let li of [...searchResults.querySelectorAll('li')]) {
                if (li.classList.contains("srp-river-answer--REWRITE_START") && li.innerText === "Results matching fewer words") break
                if (li.classList.contains("s-item")) {
                    let link = <HTMLAnchorElement>li.querySelector('a.s-item__link')
                    let soldDate = new Date((<HTMLElement>li.querySelector('span.POSITIVE')).innerText.replace("Sold ", ""))
                    links.push(new LotLink(parseInt(link.href.match(/https:\/\/[^\/]+\/itm\/(\d+)/)[1]), link, soldDate));
                }
            }
            // noinspection JSUnusedLocalSymbols
            let _ = this.updateStatusInfinite(links);
        }

        await this.createOpenMultipleButton()
    }


    async updateStatusInfinite(links: LotLink[]) {
        let ids = links.map(function (x) {
            return x.id
        })
        // noinspection InfiniteLoopJS
        while (true) {
            try {
                //console.log("UpdatingLotStates")
                let getLotStatesAnswer = await this._ebayToolBackendClient.getLotStates(ids)
                let ignoredLots = new Set(await this._ebayToolBackendClient.getIgnoredLots(this._currentProductId))

                let knownLots = new Map(getLotStatesAnswer.map(p => [p.lotId, p]));

                let importantCount = 0;
                links.forEach(function (x) {
                    x.previousColor = x.color;

                    if (!ignoredLots.has(x.id)) {
                        if (knownLots.has(x.id)) {
                            let lotState = knownLots.get(x.id)

                            let diffInDays = Math.ceil((x.soldDate.getTime() - new Date(lotState.lastUpdate).getTime()) / (1000 * 60 * 60 * 24));
                            if (diffInDays > 0) {
                                x.color = constants.Colors.lightYellow
                            } else {
                                x.color = constants.Colors.lightGreen
                            }
                            importantCount++;
                        } else {
                            x.color = constants.Colors.lightPink
                            importantCount++;
                        }
                    } else {
                        x.color = constants.Colors.lightGray
                    }

                    x.importantCount = importantCount;
                })

                let filteredLinks = links.filter(item => item.importantCount <= this.interestedInTopNItems);

                filteredLinks.forEach(x => {
                    if (x.color !== null && x.previousColor !== x.color) {
                        x.link.style.cssText = `background-color: ${x.color};`
                    }
                });

                this._needActualizationLotsIds = filteredLinks
                    .filter(x => x.color === constants.Colors.lightYellow || x.color === constants.Colors.lightPink)
                    .map(x => x.id)
            } catch (error) {
                await this.saveErrorToBackend(error)
            }
            await utils.sleep(1000)
        }
    }


    public async run() {
        
        let clientsFactory = new ClientsFactory();
        this._ebayClient = await clientsFactory.getEbayClient();
        this._ebayToolBackendClient = await clientsFactory.getEbayToolBackendClient();
        
        await utils.sleepElementLoaded('footer', document)

        this._currentProductId = this.getCurrentProductIdParam();
        if (!this._currentProductId) {
            console.log("productId not found")
            return;
        }
        let currentPage = location.protocol + '//' + location.host + location.pathname

        try {
            if (currentPage.startsWith("https://www.ebay.com/itm/")) {
                await this.productPage();
            } else if (currentPage.startsWith("https://www.ebay.com/sch/")) {
                await this.searchPage();
            }
        } catch (error) {
            await this.saveErrorToBackend(error)
        }
    }


    async saveErrorToBackend(error: Error) {
        let errorText = JSON.stringify(error) + " " + error?.stack
        try {
            let errorText = JSON.stringify(error) + " " + error?.stack
            await this._ebayToolBackendClient.saveError(new EbayToolBackendClient.ClientErrorInfo({
                error: errorText,
                url: document.location.href
            }))
        } catch {
            console.log("Unable to save error to backend " + errorText)
        }
    }
}