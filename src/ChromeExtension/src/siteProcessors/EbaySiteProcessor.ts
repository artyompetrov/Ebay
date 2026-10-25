import * as EbayClient from "../clients/EbayClient"
import * as EbayToolBackendClient from "../clients/Generated/EbayToolWebApiClient";
import * as utils from "../infrastructure/Utils";
import * as constants from '../constants';
import { ISiteProcessor } from './ISiteProcessor';
import type {TelemetrySpan} from '../infrastructure/telemetry/PageTelemetry';
import {logger, telemetry} from '../infrastructure/Telemetry';
import {showLotPanel} from './ebay/LotPanel';
import {startBackgroundWork} from '../infrastructure/telemetry/BackgroundWork';
import {traceClicks} from '../infrastructure/telemetry/PageObservers';
import {reportCaughtError} from '../infrastructure/telemetry/Logger';
import {ClientsFactory} from "../clients/ClientsFactory";
import {Mode} from '../mode';
import { getLotSyncStatus } from "./ebay/LotSyncStatus";
import { classifySoldResults, selectLotsToOpen, SoldResultStatus } from "./ebay/SoldSearchResults";

const soldResultColors: Record<SoldResultStatus, string> = {
    ignored: constants.Colors.lightGray,
    notStored: constants.Colors.lightPink,
    soldAfterRegistration: constants.Colors.lightYellow,
    registered: constants.Colors.lightGreen,
};

const ebaySiteRegex: RegExp =  /(?:^|\.)ebay\.com$/i;

export function tryGetEbaySiteProcessor() : ISiteProcessor | null {
    const currentPage = location.protocol + '//' + location.host + location.pathname;
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
    constructor(id: number, itemHtmlElement: HTMLElement, soldDate: Date) {
        this.id = id
        this.itemHtmlElement = itemHtmlElement
        this.soldDate = soldDate
        this.color = null
    }

    id: number;
    itemHtmlElement: HTMLElement;
    soldDate: Date
    previousColor: string | null
    color: string | null
}


class EbaySiteProcessor implements ISiteProcessor {
    readonly name = 'EbaySiteProcessor';

    breakAfterSearchProcessor: boolean = false;
    
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
    private _notFound = false;
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
    private _ebayToolBackendClient: EbayToolBackendClient.EbayToolWebApiClient;

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
        traceClicks(telemetry, div);
        this._panel = div;
    }

    async handleIgnoreThatLotSubmit(event: SubmitEvent) {
        event.preventDefault();
        await this.ignoreThatLot()
    }


    async  ignoreThatLot() {
        logger.info("Ignoring lot " + this._lotInfo.lotId + " for product " + this._currentProductId, {"ebay.lot_id": this._lotInfo.lotId, "product.id": this._currentProductId})
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

            for (let lotId of this._needActualizationLotsIds) {
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
        event.preventDefault();
        const submitSpan = startBackgroundWork(telemetry, 'submit lot');
        try {
            await telemetry.withDefaultParent(submitSpan, () => this.submitLot(event));
        } finally {
            submitSpan.end();
        }
    }

    private async submitLot(event: SubmitEvent): Promise<void> {
        try {
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

            logger.info("Sending lot " + this._lotInfo.lotId + " to the backend", {"ebay.lot_id": this._lotInfo.lotId, "product.id": productId})
            await this._ebayToolBackendClient.upsertLotInfo(this._lotInfo, productId)

            await this.productPage()

            if (this._serverAndEbayAreEqual) {
                window.close()
            }
        } catch (error) {
            await this.showError(error)
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
                    logger.warn('Unable to get the content inside the description iframe');
                    return;
                }
                await utils.sleepElementLoaded('footer', iframeDoc)

                logger.debug("fillPurchaseHistory")

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
                        date: x.date.toISOString(), quantity: x.quantity, price: x.price?.price, isRecent: true /*todo is recent игнорируется бекендом при сохранении*/
                    })
                });

            } catch (error) {
                logger.warn('No access to the iframe due to the Same-Origin Policy', {'exception.message': String(error)});
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
                    logger.warn('Unable to get the content inside the description iframe');
                    return;
                }
                await utils.sleepElementLoaded('footer', iframeDoc)

                logger.debug("parseRevisionSummary")

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
                logger.warn('No access to the iframe due to the Same-Origin Policy', {'exception.message': String(error)});
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
            logger.debug(`Product ID ${productId} not found in cache, refreshing the cache`);
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


    async compareLotInfos(serverLotInfoWithProductId: EbayToolBackendClient.LotInfoWithProductId | undefined) {
        let status = getLotSyncStatus(serverLotInfoWithProductId?.lotInfo, this._lotInfo)

        let panel = <HTMLDivElement>await utils.sleepElementLoaded('div.' + this.panelClass, document);
        switch (status) {
            case 'notStored':
                panel.style.cssText = `background-color: white;`
                return;
            case 'inSync':
                panel.style.cssText = `background-color: ${constants.Colors.lightGreen};`
                this._serverAndEbayAreEqual = true;
                break;
            case 'newSales':
                panel.style.cssText = `background-color: ${constants.Colors.lightYellow};`
                logger.debug(`Update needed because ebay has sales newer than the last stored sale`)
                break;
            case 'listingDiffers':
                panel.style.cssText = `background-color: ${constants.Colors.lightPink};`
                logger.debug(`Update needed because server and ebay lot info differs`)
                break;
        }

        logger.trace("Received from server: " + JSON.stringify(serverLotInfoWithProductId.lotInfo))
        logger.trace("CurrentPage: " + JSON.stringify(this._lotInfo))
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

        logger.trace("Extracted data: " + JSON.stringify(extractedData))
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
        let lotId = "v1|" + this._lotInfo.lotId.toString() + "|0";
        try {
            let item = await this._ebayClient.getItem(
                undefined,
                lotId,
                undefined,
                this.marketplaceId
            );

            let shippingCountry = this.getShippingCountry(item);
            let zipCode = this.supportedShippingCountries.get(shippingCountry).zip ?? undefined

            let shippingHeader: string;
            if (zipCode) {
                shippingHeader = `contextualLocation=country%3D${shippingCountry}%2Czip%3D${zipCode}`;
            } else {
                shippingHeader = `contextualLocation=country%3D${shippingCountry}`;
            }

            let ebayItemWithShipping = await this._ebayClient.getItem(
                undefined,
                lotId,
                shippingHeader,
                this.marketplaceId
            );

            await this.fillLotInfo(ebayItemWithShipping, shippingCountry)
        }
        catch (error)
        {
            if (error instanceof EbayClient.ApiException && error.message === "Not Found") {
                this._notFound = true;
                logger.warn("Multivariant lots are not supported")
            } else {
                throw error;
            }
        }
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
        logger.local("eBay item", ebayItem)

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
            logger.debug("retry " + counter)
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

        if (this._notFound) {
            return;
        }

        let extractedDataByFieldName = await this.extractManualFieldsData();

        this.fillPurchaseHistory();
        this.fillUpdateTitleDate();

        await Promise.all([
            this.waitForPurchaseHistoryAndTitleDate(),
            this.fillManualCondition(extractedDataByFieldName),
            this.fillPcs(extractedDataByFieldName),
        ]);
        
        await this.compareLotInfos(this._serverLotInfo);
        
        
    }

    /** Shows the error in the lot panel and reports it (see {@link reportError}). */
    async showError(error: Error) {
        const errorText = this.reportError(error);

        let errorDiv = await utils.sleepElementLoaded('div.' + this.panelClass + ' #' + this.errorElementId, document)
        let span = document.createElement('span');

        span.innerHTML = errorText
        errorDiv.appendChild(span)
        errorDiv.appendChild(document.createElement('br'))
    }


    async hideErrorsAndEnableSubmit() {
        let submitButton = <HTMLInputElement>(await utils.sleepElementLoaded('#' + this.submitId, document))
        submitButton.disabled = false;
        let errorDiv = await utils.sleepElementLoaded('div.' + this.panelClass + ' #' + this.errorElementId, document)
        errorDiv.innerHTML = ""
    }

    async productPage() {
        logger.debug("productPage")

        await this.createPanel()
        try {
            await this.getDataFromPage();
            this.openFullDescription();
            await this.hideErrorsAndEnableSubmit()
        } catch (error) {
            await this.showError(error);
        }
        showLotPanel(this._panel, telemetry.pageSpan);
    }


    openFullDescription() { 
        let button = <HTMLButtonElement>document.querySelector('div.x-item-condensed-card__message button');
        if (button) {
            button.click()
        }
    }

    async searchPage() {
        logger.debug("SearchPage")

        //только на странице проданные лоты
        if (new URL(document.location.href).searchParams?.get('LH_Sold')?.trim() !== "1") return;
        const linkRegex = /https:\/\/[^\/]+\/itm\/(\d+)/;
        const soldRegex = /Sold\s.+/;

        let searchResults = await utils.sleepElementLoaded('ul.srp-results', document)

        if (!document.querySelector("div.srp-save-null-search")) { // что-то найдено

            let links: LotLink[] = [];
            for (let li of [...searchResults.querySelectorAll('li')]) {
                if (li.classList.contains("srp-river-answer--REWRITE_START") && li.innerText === "Results matching fewer words") break
                if (li.classList.contains("s-item") || li.classList.contains("s-card")) {
                    
                    let linkMatch = Array.from(li.querySelectorAll('a')).map(link => link.href.match(linkRegex)).find(x=>x);
                    let soldMatch = Array.from(li.querySelectorAll('span')).map(span => span.innerText.match(soldRegex)).find(x=>x);
                        
                    let soldDate = new Date(soldMatch[0].replace("Sold ", ""))
                    let lotLink = new LotLink(parseInt(linkMatch[1]), li, soldDate);
                    links.push(lotLink);
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
        // Every iteration is a trace of its own, linked to the page's trace; the client's calls go under it.
        let pollSpan: TelemetrySpan | undefined;
        const pollingClient = await new ClientsFactory().getEbayToolBackendClient(() => pollSpan)
        // noinspection InfiniteLoopJS
        while (true) {
            pollSpan = startBackgroundWork(telemetry, 'poll lot states', {attributes: {'ebay.lots_count': ids.length}})
            try {
                let getLotStatesAnswer = await pollingClient.getLotStates(ids)
                let ignoredLots = new Set(await pollingClient.getIgnoredLots(this._currentProductId))

                let lastUpdates = new Map(getLotStatesAnswer.map(p => [p.lotId, p.lastUpdate]));

                let classified = classifySoldResults(links.map(x => ({lotId: x.id, soldDate: x.soldDate})), lastUpdates, ignoredLots, this.interestedInTopNItems)

                links.forEach((x, index) => {
                    x.previousColor = x.color;
                    x.color = soldResultColors[classified[index].status]
                    if (classified[index].shown && x.previousColor !== x.color) {
                        x.itemHtmlElement.style.cssText = `background-color: ${x.color};`
                    }
                });

                this._needActualizationLotsIds = selectLotsToOpen(classified, this.batchOpen)
            } catch (error) {
                this.reportError(error, pollSpan)
            } finally {
                pollSpan.end()
            }
            await utils.sleep(1000)
        }
    }


    public async run(span: TelemetrySpan) {
        
        let clientsFactory = new ClientsFactory();
        this._ebayClient = await clientsFactory.getEbayClient();
        this._ebayToolBackendClient = await clientsFactory.getEbayToolBackendClient();
        
        await utils.sleepElementLoaded('footer', document)

        this._currentProductId = this.getCurrentProductIdParam();
        if (!this._currentProductId) {
            logger.debug("productId not found")
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
            this.reportError(error)
        }
    }


    /**
     * Logs the error (exported with its type, message and stack trace) and marks the span it was caught in, by
     * default the current processor, submit or page span, as failed. Returns the text shown to the user.
     */
    reportError(error: Error, span: TelemetrySpan | undefined = telemetry.currentSpan): string {
        const isValidationError = error instanceof EbayToolBackendClient.ValidationProblemDetailedInfo;
        const errorText = isValidationError ? JSON.stringify(error.errors) : error?.stack ?? String(error);
        reportCaughtError(logger, "Lot processing failed", error, span, isValidationError ? {'validation.errors': errorText} : {});
        return errorText;
    }
}