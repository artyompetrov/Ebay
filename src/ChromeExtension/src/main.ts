import * as Frappe from "./clients/FrappeClient"

import {
    CategoryValue,
    EbayToolBackendClient,
    ClientErrorInfo,
    LotDataExtractedItem,
    LotDataToExtract,
    LotInfo,
    LotInfoWithProductId,
    NotFoundProblemDetailedInfo,
    PurchaseInfo,
    ValidationProblemDetailedInfo, ProductWithoutId, SearchQuery, RuSearchQuery
} from "./clients/EbayToolBackendClient"
import {EbayClient, Item} from "./clients/EbayClient"
import {generateCodeVerifier, OAuth2Client} from '@badgateway/oauth2-client';
import {FetchWrapperCustom} from "./FetchWrapperCustom";
import {searchSitePages as searchSitePagesFunc} from "./searchSites";

const productFieldName = "productId";
const ignoreThatLotFormId = "ignoreThatLot"
const pcsFieldName = "pcs";
const autoPcsFieldName = "autoPcs";
const categoryPrefix = 'category_'
const panelClass = "panel-div";
const panelInputClass = "panel-input-div";
const formId = "product-form-id"
const errorElementId = "errorElement"
const submitId = "submitButton"
const backendUrl = `https://tubessale.ddns.net/`;
const baseApiUrl = `${backendUrl}api/ebay/v1`;
const frappeBaseApiUrl = "https://tubessale.ddns.net:8081"
const extensionAuthRedirectUrl = `${backendUrl}chrome_extensions/auth`;
const frappeAuthRedirectUrl = `${frappeBaseApiUrl}/api/method/ebay.api.chrome_extension_auth_page.auth`;
const ebayAuthRedirectUrl = `https://www.ebay.com/`;
//todo нужно как-то защитить данные авторизации на ebay
const ebayRedirectUriCode = "Artem_Petrov-ArtemPet-tubesS-dsrgu"
const ebayApiScope = "https://api.ebay.com/oauth/api_scope"
const backendApiScope = 'ServerAPI'
const frappeScope = 'all openid'
const lightGrayColor = "lightgray"
const lightGreenColor = "#ecffec"
const lightPinkColor = "lightpink"
const lightYellowColor = "#e0e07f"
const marketplaceId = "EBAY_US"
const batchOpen = 5
const categoriesDiv = "categoriesDiv"
const ignoredLotDiv = "ignoredLotDiv"
const currentProductIdParamName = "tool_productId"
let lotNotSupported = false;
let _lotInfo = new LotInfo()
let _purchaseHistory : PurchaseInfo[] | null;
let _titleChangeDate : string | null;
let _serverLotInfo: LotInfoWithProductId | undefined;
let _needActualizationLotsIds: number[] = null
let _serverAndEbayAreEqual = false;
let _panel: HTMLDivElement;
let _currentProductId: string
let interestedInTopNItems = 10;
let extendedLogging = true;
let _allItemsCacheIdentifier = "allProducts"


const ebaySiteRegex: RegExp =  /(?:^|\.)ebay\.com$/i;
const chipFindRegex: RegExp = /(?:^|\.)chipfind\.ru$/i
const avitoRegex: RegExp = /(?:^|\.)avito\.ru$/i

const searchOnSites: RegExp[] = [
    avitoRegex,
    chipFindRegex
]

const workOnSites: RegExp[] = [
    ...searchOnSites,
    ebaySiteRegex,
    /^localhost$/i,
    /^localhost:8080$/i,
    /^localhost:8081$/i,
    /^tubessale\.ddns\.net$/i,
    /^tubessale\.ddns\.net:8080$/i,
    /^tubessale\.ddns\.net:8081$/i
];

class ShippingParameters {
constructor(regions: string[], zip: string | null) {
    this.regions = regions
    this.zip = zip
}

regions: string[];
zip: string | null
}

const supportedShippingCountries = new Map<string, ShippingParameters>();
supportedShippingCountries.set('DE', new ShippingParameters(['EUROPE', 'EUROPEAN_UNION'], null))
supportedShippingCountries.set('IT', new ShippingParameters(['EUROPE', 'EUROPEAN_UNION'], null))
supportedShippingCountries.set('FR', new ShippingParameters(['EUROPE', 'EUROPEAN_UNION'], null))
supportedShippingCountries.set('GB', new ShippingParameters(['EUROPE'], "SW1W 0NY"))
supportedShippingCountries.set('BG', new ShippingParameters(['EUROPE', 'EUROPEAN_UNION'], null))
supportedShippingCountries.set('LT', new ShippingParameters(['EUROPE', 'EUROPEAN_UNION'], null))
supportedShippingCountries.set('SK', new ShippingParameters(['EUROPE', 'EUROPEAN_UNION'], null))
supportedShippingCountries.set('LV', new ShippingParameters(['EUROPE', 'EUROPEAN_UNION'], null))
supportedShippingCountries.set('RO', new ShippingParameters(['EUROPE', 'EUROPEAN_UNION'], null))
supportedShippingCountries.set('EE', new ShippingParameters(['EUROPE', 'EUROPEAN_UNION'], null))
supportedShippingCountries.set('PL', new ShippingParameters(['EUROPE', 'EUROPEAN_UNION'], null))
supportedShippingCountries.set('US', new ShippingParameters([], "40202"))
supportedShippingCountries.set('AU', new ShippingParameters([], "3000–3999"))

const currencyMap = new Map<string, string>()
currencyMap.set("USD", "US $")
currencyMap.set("AUD", "AU $")
currencyMap.set("CAD", "C $")

interface CachedData<T> {
    value: T;
    expirationTime: number;
}

function removeFromCache(key: string){
    chrome.storage.local.remove(key, () => {} );
}

function getCachedDataOrFallback<T>(
    key: string,
    fallbackLogic: () => Promise<T>,
    ttlInSeconds: number
): Promise<T | null> {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(key, async (result) => {
            const data: CachedData<T> | undefined = result[key];

            if (data && Date.now() <= data.expirationTime) {
                // Если данные валидны
                console.log(`${key} loaded from cache.`);
                resolve(data.value);
            } else {
                // Данные отсутствуют или устарели
                console.log(`${key} not in cache or expired. Fetching new data...`);
                try {
                    const newData = await fallbackLogic(); // Выполняем fallback логику
                    const expirationTime = Date.now() + ttlInSeconds * 1000;

                    // Сохраняем новые данные в кэш
                    const cachedData: CachedData<T> = { value: newData, expirationTime };
                    chrome.storage.local.set({ [key]: cachedData }, () => {
                        console.log(`${key} cached for ${ttlInSeconds} seconds.`);
                    });

                    resolve(newData); // Возвращаем данные из fallback логики
                } catch (error) {
                    console.error(`Failed to fetch data for ${key}:`, error);
                    reject(error);
                }
            }
        });
    });
}

// fetch через background script, по другому не работает
async function fetchResource(input: RequestInfo, init: RequestInit): Promise<Response> {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ input, init }, async messageResponse => {
            try {
                const [response, error] = messageResponse;
                let logEntry = "Request: " + JSON.stringify(input);
                if (extendedLogging) {
                    logEntry += "\n\nRequest body: \n" + JSON.stringify(init);
                }
                if (response === null) {
                    logEntry += "\n\nNo response"
                    console.log(logEntry);
                    reject(error);
                } else {
                    logEntry += "\n\nResponse " + response.status + " " + response.statusText;

                    if (extendedLogging) {
                        logEntry += "\n\nResponse headers:\n" + JSON.stringify(response.headers);
                    }

                    let body = new Blob([response.body]);
                    
                    if (extendedLogging) {
                        logEntry += "\n\nResponse body:\n";
                        try {
                            const loggedBody = await new Response(body).text();
                            logEntry += loggedBody;
                        } catch (logError) {
                            logEntry += "Failed to log response body: " + logError;
                        }
                    }
                    
                    console.log(logEntry);
                    resolve(new Response(body, {
                        headers: new Headers(response.headers),
                        status: response.status,
                        statusText: response.statusText
                    }));
                }
            } catch (error) {
                console.log("An error occurred while processing the response:", error);
                reject(error);
            }
        });
    });
}


function sleep(ms: number): Promise<number> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function extractPrice(price: string): Price {
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

class Price {
    constructor(price: number, currency: string) {

        this.currency = currency
        this.price = price
    }

    currency: string;
    price: number;
}

async function sleepElementLoaded(selector: string, elementToSearchIn: Document | Element): Promise<Element> {
    let retry = 0
    while (true) {
        retry++;
        if (retry > 200) throw new Error("unable to find element by selector " + selector)

        let element = elementToSearchIn.querySelector(selector)
        if (element !== null) return element
        await sleep(100);
    }
}


async function createPanel(backendClient: EbayToolBackendClient, ebayClient: EbayClient): Promise<HTMLDivElement> {
    let bodyElement = await sleepElementLoaded('body', document);

    let panel = <HTMLDivElement>bodyElement.querySelector('div.' + panelClass)

    if (panel !== null && panel !== undefined) {
        panel.style.cssText = `background-color: white;`
        return panel;
    }

    let styles = `
    .${panelClass} {
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
    
    .${panelInputClass} label {
      font-weight: bold;
      display: block;
      width: 140px;
      float: left;
    }
    
    .${panelInputClass} input {
      width: 200px;
    }
    
    #${pcsFieldName} {
      width: 100px;
    }
    
    #${autoPcsFieldName} {
      width: 100px;
    }
    
    .${panelInputClass} select {
      width: 200px;
    }
    
    .${panelInputClass} label:after { content: ": " }
    
    #${categoriesDiv} label {
        padding-right: 10px;
    }
    
    #${submitId} {
        width: 350px;
        height: 30px;
    }
`

    let styleSheet = document.createElement("style")
    styleSheet.innerText = styles
    bodyElement.appendChild(styleSheet)

    let div = document.createElement('div');
    div.title = "Белый цвет - на сервере нет информации о лоте, желтый цвет - на сервере есть информация о лоте, но после последней актуализации были новые продажи, красный цвет - информация на сервере и в лоте не совпадает, требуется актуализация, зеленый цвет - информация на сервере актуальна."
    div.classList.add(panelClass);
    let itemId = location.pathname.match(/\/itm\/([0-9]+)/)[1];
    let domain = location.hostname;
    let historyButtonHref = `https://${domain}/bin/purchaseHistory?item=${itemId}`;
    let revisionsButtonHref = `https://${domain}/rvh/${itemId}`;
    div.innerHTML = `
     <a href="${historyButtonHref}" target="_blank">История продаж лота</a>
        <br><a href="${revisionsButtonHref}" target="_blank">История изменений лота</a>
        <br>Бэкенд: <a href="${backendUrl}" target="_blank">${backendUrl}</a>
        <br><br>
        <div id="${ignoredLotDiv}" style="color: red;" hidden="hidden">Лот в игноре</div>
    `

    let formIgnoreThatLot = document.createElement('form')
    formIgnoreThatLot.id = ignoreThatLotFormId
    div.appendChild(formIgnoreThatLot)

    formIgnoreThatLot.addEventListener("submit", async function (event: SubmitEvent) {
        await handleIgnoreThatLotSubmit(event, backendClient)
    });

    let form = document.createElement('form')
    form.id = formId
    // language=HTML
    form.innerHTML = `
        <div class="${panelInputClass}">
            <label for="${productFieldName}">Товар</label>
            <select name="${productFieldName}" id="${productFieldName}">
                <option value="">Выберите товар</option>
            </select>
            <br>
            <label for="${pcsFieldName}">PCS</label>
            <input id="${pcsFieldName}" type="number" name="${pcsFieldName}" title="Вручную введенное количество"/>
            <input id="${autoPcsFieldName}" type="text" name="${autoPcsFieldName}" title="Автоматически определенное количество (красный цвет - невозможно автоматически определить количество, желтый цвет - есть подозрение на неточность, зеленый - все ОК)" readonly/>
        </div>
        <br>
        <div id="${categoriesDiv}">
        </div>
        <div style="color: red;" id="${errorElementId}"></div>
        <br>
        <input id="${submitId}" type="submit" value="Save" disabled/>
    `;

    form.addEventListener("submit", async function (event: SubmitEvent) {
        await handleSubmit(event, backendClient, ebayClient)
    });

    div.appendChild(form)
    bodyElement.appendChild(div);
    div.hidden = true
    _panel = div;
}

async function handleIgnoreThatLotSubmit(event: SubmitEvent, backendClient: EbayToolBackendClient) {
    event.preventDefault();
    await ignoreThatLot(backendClient)
}

async function ignoreThatLot(backendClient: EbayToolBackendClient) {
    console.log("Ignoring lot " + _lotInfo.lotId + " for product " + _currentProductId)
    await backendClient.ignoreLots([_lotInfo.lotId], _currentProductId)
    showThatLotIsIgnored();
    window.close()
}

async function createOpenMultipleButton(): Promise<HTMLDivElement> {
    let bodyElement = await sleepElementLoaded('body', document);

    let panel = bodyElement.querySelector('div.' + panelClass)

    if (panel !== null && panel !== undefined) return <HTMLDivElement>panel;

    let styles = `
    .${panelClass} {
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
    
    #${submitId} {
        width: 120px;
        height: 30px;
    }
`

    let styleSheet = document.createElement("style")
    styleSheet.innerText = styles
    bodyElement.appendChild(styleSheet)

    let div = document.createElement('div');
    div.classList.add(panelClass);

    let form = document.createElement('form')
    form.id = formId

    // language=HTML
    form.innerHTML = `
        <input id="${submitId}" type="submit" value="Окрыть ${batchOpen} лотов"/>
    `;

    form.addEventListener("submit", async function (event: SubmitEvent) {
        event.preventDefault()
        if (_needActualizationLotsIds === null) return;
        if (_needActualizationLotsIds.length === 0) {
            window.close()
        }

        let lastWindow: WindowProxy;

        for (let lotId of _needActualizationLotsIds.slice(0, batchOpen)) {
            let url = "https://www.ebay.com/itm/" + lotId + "?" + currentProductIdParamName + "=" + _currentProductId;
            lastWindow = window.open(url, '_blank');

            await sleep(50);
        }

        lastWindow?.focus()
    });

    div.appendChild(form)
    bodyElement.appendChild(div);

    return div
}

async function handleSubmit(event: SubmitEvent, backendClient: EbayToolBackendClient, ebayClient: EbayClient) {
    try {
        event.preventDefault();
        let data = new FormData(<HTMLFormElement>event.target);


        let categories = [];
        data.forEach(function (value, key) {

            if (key.startsWith(categoryPrefix)) {
                let category = key.replace(categoryPrefix, "")
                categories.push(new CategoryValue({type: category, value: value.toString()}))
            } else {
                _lotInfo[key] = value;
            }
        });

        _lotInfo.categories = categories;

        let productId = data.get('productId').toString();

        if (!productId) {
            // noinspection ExceptionCaughtLocallyJS
            throw new Error("Product id not set");
        }

        console.log("Sending to backend: " + JSON.stringify(_lotInfo))
        await backendClient.upsertLotInfo(_lotInfo, productId)

        await productPage(backendClient, ebayClient)

        if (_serverAndEbayAreEqual) {
            window.close()
        }
    } catch (error) {
        await showAndSaveError(error, backendClient)
    }
}

function fillSoldItemsResult(fixedPriceRows: HTMLTableRowElement[], result: PurchaseInfoInner[]) {
    for (let fixedPriceRow of fixedPriceRows) {
        let columns = [...fixedPriceRow.querySelectorAll('td')]
            .map(function (item) {
                return item.innerText;
            })

        let price = columns[1]

        if (price === "Expired" || price === "Declined") {
            continue
        }

        if (price !== "Sold as a special offer" && price !== "Counter-offered" && price !== "Accepted") {

            let priceExtracted = extractPrice(price)

            let lotInfoCurrency = currencyMap.has(_lotInfo.currency) ? currencyMap.get(_lotInfo.currency) : _lotInfo.currency

            if (priceExtracted.currency !== lotInfoCurrency) {
                throw new Error("currency doesn't match with lot currency lot currency " + lotInfoCurrency + " extracted currency " + priceExtracted.currency)
            }
            result.push(new PurchaseInfoInner(parseInt(columns[2]), parseDate(columns[3]), priceExtracted))
        } else {
            result.push(new PurchaseInfoInner(parseInt(columns[2]), parseDate(columns[3])))
        }
    }
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

function parseDate(dateString: string): Date {
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



function hasShippingToCountry(country: string, shipsTo: Set<string>, excludes: Set<string>) {

    let countryParams = supportedShippingCountries.get(country);

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

function showThatLotIsIgnored() {
    let ignoredLotDivElement = <HTMLDivElement>_panel.querySelector('div#' + ignoredLotDiv);
    let ignoreThatLotFormElement = <HTMLDivElement>_panel.querySelector('form#' + ignoreThatLotFormId);
    ignoredLotDivElement.hidden = false;
    ignoreThatLotFormElement.hidden = true;
}

async function fillIsIgnored(backendClient: EbayToolBackendClient) {
    let isIgnored = await backendClient.getIsLotIgnoredForProduct(_currentProductId, _lotInfo.lotId);
    if (!isIgnored) return
    showThatLotIsIgnored();
}

function fillPurchaseHistory() {
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
            await sleepElementLoaded('footer', iframeDoc)
            
            console.log("fillPurchaseHistory")
            
            let result = new Array<PurchaseInfoInner>();
            let fixedPriceBlock = iframeDoc.querySelector('div.fixed-price tbody')
            if (fixedPriceBlock !== null) {
                let fixedPriceRows = [...fixedPriceBlock.querySelectorAll('tr')]
                fillSoldItemsResult(fixedPriceRows, result);
            }

            let offerBlock = iframeDoc.querySelector('div.offer tbody')
            if (offerBlock !== null) {
                let offerRows = [...offerBlock.querySelectorAll('tr')]
                fillSoldItemsResult(offerRows, result);
            }

            _purchaseHistory = result.sort(function (a, b) {
                return b.date.getTime() - a.date.getTime();
            }).map(function (x) {

                return new PurchaseInfo({
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

function fillUpdateTitleDate() {

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
            await sleepElementLoaded('footer', iframeDoc)

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

                        _titleChangeDate = parseDate(date + " " + time).toISOString()
                        break;
                    }
                }
            }
            else {
                _titleChangeDate = new Date(0).toISOString()
            }
            
        } catch (error) {
            console.error(
                'Нas no access to iframe due to Same-Origin Policy:',
                error
            );
        }
    });
}


function getCurrentProductIdParam(): string | undefined {
    let currentProductId = new URL(document.location.href).searchParams?.get(currentProductIdParamName)?.trim()?.toLowerCase()
    if (currentProductId) return currentProductId

    if (document.referrer) {

        let productId = new URL(document.referrer).searchParams?.get(currentProductIdParamName)?.trim()?.toLowerCase()
        if (productId) {
            let currentUrl = new URL(document.location.href);
            currentUrl.searchParams.set(currentProductIdParamName, productId);
            window.history.pushState({}, null, currentUrl.toString());
        }

        return productId;
    }
}

async function fillProduct(client: EbayToolBackendClient) {
    let productField = _panel.querySelector('select#' + productFieldName);
    let ignoreThatLot = _panel.querySelector("form#" + ignoreThatLotFormId)
    let productIdServer = _serverLotInfo?.productId?.trim()?.toLowerCase()

    let products = await getAllProductsCached(client, _currentProductId)
    for (let i = 0; i < products.length; i++) {
        let opt = document.createElement('option');
        opt.value = products[i].id;
        opt.innerHTML = products[i].name;

        if (productIdServer !== undefined) {
            if (productIdServer === products[i].id.trim().toLowerCase()) {
                opt.selected = true
            }
        } else if (_currentProductId === products[i].id.trim().toLowerCase()) {
            opt.selected = true
            ignoreThatLot.innerHTML = `<button>Игнорировать для ${products[i].name}</button><br><br>`
        }

        productField.appendChild(opt);
    }
}

async function fillManualCondition(client: EbayToolBackendClient, extractedDataByFieldName: {}) {
    let categoriesDivElement = _panel.querySelector('div#' + categoriesDiv);
    categoriesDivElement.innerHTML = ""

    let serverCategories = _serverLotInfo?.lotInfo?.categories?.reduce((dictionary, value) => {
        dictionary[value.type] = value.value;
        return dictionary;
    }, {});

    let categoryTypes = await client.getCategories()

    for (let categoryType of categoryTypes) {
        let categoryDiv = document.createElement("div")

        let extractedData: LotDataExtractedItem[] = extractedDataByFieldName[categoryType.type];

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
            input.name = categoryPrefix + categoryType.type
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

async function getServerLotInfo(client: EbayToolBackendClient): Promise<void> {
    try {

        _serverLotInfo = await client.getLotInfo(_lotInfo.lotId);
    } catch (error) {
        if (error instanceof NotFoundProblemDetailedInfo) {
            return;
        }

        throw error;
    }
}

async function fillPcs(extractedDataByFieldName: {}) {
    let pcsField = <HTMLInputElement>_panel.querySelector('input#' + pcsFieldName);
    let autoPcsField = <HTMLInputElement>_panel.querySelector('input#' + autoPcsFieldName);

    let fillManualWithAutoValue = false
    let extractedData: LotDataExtractedItem[] = extractedDataByFieldName["pcs"];

    if (extractedData.length > 0) {

        autoPcsField.value = extractedData[0].value;

        if (extractedData.length === 1) {
            autoPcsField.style.backgroundColor = lightGreenColor;

            fillManualWithAutoValue = true
        } else {
            if (extractedData[0].extractorInfo.length > extractedData[1].extractorInfo.length) {
                autoPcsField.style.backgroundColor = lightYellowColor;

                fillManualWithAutoValue = false
            } else {
                autoPcsField.style.backgroundColor = lightPinkColor;
                fillManualWithAutoValue = false
            }
        }

    } else {
        autoPcsField.value = "1"
        autoPcsField.style.backgroundColor = lightYellowColor;

        fillManualWithAutoValue = false
    }

    let serverPcs = _serverLotInfo?.lotInfo?.pcs
    if (serverPcs !== undefined) {
        pcsField.value = serverPcs.toString()
    } else if (fillManualWithAutoValue) {
        pcsField.value = autoPcsField.value
    }
}


async function compareLotInfos(serverLotInfoWithProductId: LotInfoWithProductId) {
    if (serverLotInfoWithProductId === undefined) return;

    let serverLotInfoJson = serverLotInfoWithProductId.lotInfo.toJSON()
    serverLotInfoJson["pcs"] = undefined
    serverLotInfoJson["categories"] = undefined
    serverLotInfoJson["description"] = undefined
    serverLotInfoJson["shortDescription"] = undefined
    serverLotInfoJson["seller"] = undefined
    serverLotInfoJson["purchaseHistory"] = undefined

    let lotInfoJson = _lotInfo.toJSON()
    lotInfoJson["pcs"] = undefined
    lotInfoJson["categories"] = undefined
    lotInfoJson["description"] = undefined
    lotInfoJson["shortDescription"] = undefined
    lotInfoJson["seller"] = undefined
    lotInfoJson["purchaseHistory"] = undefined

    let serverLotInfoJsonString = JSON.stringify(serverLotInfoJson)
    let currentPageLotInfoJsonString = JSON.stringify(lotInfoJson)

    let panel = <HTMLDivElement>await sleepElementLoaded('div.' + panelClass, document);
    if (serverLotInfoJsonString === currentPageLotInfoJsonString) {
        let serverMaxDate = getMax(serverLotInfoWithProductId.lotInfo.purchaseHistory.map(x => {
            if (x.price !== undefined) {
                return new Date(x.date).getTime()
            } else return 0;
        }))
        let ebayMaxDate = getMax(_lotInfo.purchaseHistory.map(x => {
            if (x.price !== undefined) {
                return new Date(x.date).getTime();
            } else return 0;
        }))
        
        if (ebayMaxDate === 0 || serverMaxDate === ebayMaxDate) {
            panel.style.cssText = `background-color: ${lightGreenColor};`
            _serverAndEbayAreEqual = true;
        } else {
            panel.style.cssText = `background-color: ${lightYellowColor};`
            console.log(`Update needed because last sale server ${serverMaxDate} and ebay last sale ${ebayMaxDate}`)
        }
    } else {
        panel.style.cssText = `background-color: ${lightPinkColor};`
        console.log(`Update needed because server and ebay lot info differs`)
    }

    console.log("Received from server: " + serverLotInfoJsonString)
    console.log("CurrentPage: " + currentPageLotInfoJsonString)
}


function getMax(array: number[]) {
    let largest = 0;
    for (let i = 0; i < array.length; i++) {
        if (array[i] > largest) {
            largest = array[i];
        }
    }
    return largest;
}


async function extractManualFieldsData(client: EbayToolBackendClient): Promise<{}> {
    let extractedData = (await client.extractData(new LotDataToExtract({
        name: _lotInfo.name,
        conditionDescription: _lotInfo.conditionDescription,
        condition: _lotInfo.condition,
        description: _lotInfo.description
    }))).reduce((dictionary, value) => {
        dictionary[value.fieldName] = value.extractedData;
        return dictionary;
    }, {})

    console.log(JSON.stringify(extractedData))
    return extractedData
}

function getShippingCountry(ebayItem: Item) {
    let shipsTo = ebayItem.shipToLocations.regionIncluded.reduce((set, value) => {
        set.add(value.regionId)
        return set
    }, new Set<string>());
    let excludes = ebayItem.shipToLocations.regionExcluded.reduce((set, value) => {
        set.add(value.regionId)
        return set
    }, new Set<string>());

    let currentCountry = ebayItem.itemLocation.country

    let supportedShippingCountriesArray = Array.from(supportedShippingCountries.keys())
    let position = -1
    while (!supportedShippingCountries.has(currentCountry) || !hasShippingToCountry(currentCountry, shipsTo, excludes)) {
        position++;
        if (position >= supportedShippingCountriesArray.length) throw new Error("Position is greater than supportedShippingCountriesArray lenght");
        currentCountry = supportedShippingCountriesArray[position]
    }
    return currentCountry;
}

async function getEbayItem(ebayClient: EbayClient) {
    let ebayItem = await ebayClient.getItemByLegacyId(undefined,
        _lotInfo.lotId.toString(),
        undefined,
        undefined,
        undefined,
        marketplaceId);

    let shippingCountry = getShippingCountry(ebayItem);
    let zipCode = supportedShippingCountries.get(shippingCountry).zip ?? undefined
    
    let shippingHeader: string;
    if (zipCode) {
        shippingHeader = `contextualLocation=country%3D${shippingCountry}%2Czip%3D${zipCode}`;
    } else {
        shippingHeader = `contextualLocation=country%3D${shippingCountry}`;
    }
    
    let ebayItemWithShipping = await ebayClient.getItemByLegacyId(undefined,
        _lotInfo.lotId.toString(),
        undefined,
        undefined,
        shippingHeader,
        marketplaceId);

    await fillLotInfo(ebayItemWithShipping, shippingCountry)
}

function addShipping(ebayItem: Item) {
    let shipping = undefined;
    let shippingAdditional = undefined;
    for (let shippingOption of ebayItem.shippingOptions) {

        let shippingCurrencyValue = shippingOption.shippingCost.convertedFromCurrency ?? shippingOption.shippingCost.currency;
        let shippingValue = shippingOption.shippingCost.convertedFromValue ?? shippingOption.shippingCost.value;

        let shippingAdditionalCurrencyValue = shippingOption.additionalShippingCostPerUnit.convertedFromCurrency ?? shippingOption.additionalShippingCostPerUnit.currency;
        let shippingAdditionalValue = shippingOption.additionalShippingCostPerUnit.convertedFromValue ?? shippingOption.additionalShippingCostPerUnit.value;

        if (shippingValue < shipping || shipping === undefined) {
            shipping = parseFloat(shippingValue);
            if (shippingAdditionalValue) {
                shippingAdditional = parseFloat(shippingAdditionalValue);
            }

            if (_lotInfo.currency != shippingCurrencyValue)
                throw new Error("Shipping and lot currency mismatch lot + " + _lotInfo.currency + " shipping " + shippingCurrencyValue);

            if (shippingAdditionalCurrencyValue && _lotInfo.currency != shippingAdditionalCurrencyValue)
                throw new Error("Shipping additional and lot currency mismatch lot + " + _lotInfo.currency + " shipping " + shippingAdditionalCurrencyValue);
        }
    }

    _lotInfo.shipping = shipping;
    _lotInfo.shippingAdditional = shippingAdditional ?? 0.0;
}

async function fillLotInfo(ebayItem: Item, shippingCountry: string) {
    console.log(JSON.stringify(ebayItem))

    if (ebayItem.price.convertedFromValue === undefined) {
        _lotInfo.price = parseFloat(ebayItem.price.value)
        _lotInfo.currency = ebayItem.price.currency
    } else {
        _lotInfo.price = parseFloat(ebayItem.price.convertedFromValue)
        _lotInfo.currency = ebayItem.price.convertedFromCurrency
    }

    _lotInfo.name = ebayItem.title

    _lotInfo.seller = ebayItem.seller.username

    _lotInfo.condition = ebayItem.condition ?? "--"
    if (ebayItem.lotSize > 0) {
        _lotInfo.lotSize = ebayItem.lotSize
    }
    
    _lotInfo.conditionDescription = ebayItem.conditionDescription

    _lotInfo.description = ebayItem.description

    _lotInfo.locatedIn = ebayItem.itemLocation.country

    _lotInfo.shortDescription = ebayItem.shortDescription

    _lotInfo.shippingCountry = shippingCountry;
    addShipping(ebayItem);

    //todo categoryPath
}


async function checkForUpdates(): Promise<void> {
    const currentVersion = chrome.runtime.getManifest().version;
    const updateUrl = chrome.runtime.getManifest().update_url;

    if (!updateUrl) {
        throw new Error("Update URL not defined in manifest.");
    }
    const response = await fetchResource(updateUrl, {});
    if (!response.ok) {
        throw new Error("Failed to fetch update manifest: " + response.statusText);
    }

    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "application/xml");
    
    const updateCheckNode = xmlDoc.querySelector("updatecheck");
    const remoteVersion = updateCheckNode?.getAttribute("version");

    if (!remoteVersion) {
        console.error("Version not found in the update manifest.");
        return;
    }

    const isNewerVersion = (current: string, remote: string): boolean => {
        const currentParts = current.split('.').map(Number);
        const remoteParts = remote.split('.').map(Number);

        for (let i = 0; i < Math.max(currentParts.length, remoteParts.length); i++) {
            const currentPart = currentParts[i] || 0;
            const remotePart = remoteParts[i] || 0;

            if (remotePart > currentPart) {
                return true;
            } else if (remotePart < currentPart) {
                return false;
            }
        }

        return false;
    };
    
    if (isNewerVersion(currentVersion, remoteVersion)) {
        let alertMessage = `Ebay Helper extension New version available: ${remoteVersion}`
        if (currentVersion === "0") {
            // Локальный дебаг
            console.log("Alerting " + alertMessage)
        }
        else {
            alert(alertMessage);
        }
        return;
    }
    
    console.log("No updates available. Current version is up-to-date.");
}


async function waitForPurchaseHistoryAndTitleDate(){
    let counter = 0;
    while (!_purchaseHistory || !_titleChangeDate) {
        await sleep(100);
        console.log("retry " + counter)
        if (counter > 600){
            throw new Error("waitForPurchaseHistoryAndTitleDate run out of retries")
        }
    }
    
    const titleChangeDate = new Date(_titleChangeDate);
    _lotInfo.purchaseHistory = _purchaseHistory.filter(purchase =>
        new Date(purchase.date) >= titleChangeDate
    );
    _lotInfo.titleChangeDate = _titleChangeDate;
}

async function getDataFromPage(backendClient: EbayToolBackendClient, ebayClient: EbayClient) {
    let lotId = location.pathname.match(/\/itm\/([0-9]+)/)[1];
    _lotInfo.lotId = parseInt(lotId)
    
    await Promise.all([
        fillProduct(backendClient),
        fillIsIgnored(backendClient),
        getEbayItem(ebayClient),
        getServerLotInfo(backendClient),
    ]);

    let extractedDataByFieldName = await extractManualFieldsData(backendClient);

    fillPurchaseHistory();
    fillUpdateTitleDate();
    
    await Promise.all([
        waitForPurchaseHistoryAndTitleDate(),
        fillManualCondition(backendClient, extractedDataByFieldName),
        fillPcs(extractedDataByFieldName),
    ]);
    
    if (lotNotSupported) {
        await ignoreThatLot(backendClient);
    }
    
    await compareLotInfos(_serverLotInfo);
}

async function saveErrorToBackend(error: Error, client: EbayToolBackendClient) {
    let errorText = JSON.stringify(error) + " " + error?.stack
    try {
        let errorText = JSON.stringify(error) + " " + error?.stack
        await client.saveError(new ClientErrorInfo({
            error: errorText,
            url: document.location.href
        }))
    } catch {
        console.log("Unable to save error to backend " + errorText)
    }
}

async function showAndSaveError(error: Error, client: EbayToolBackendClient) {

    let errorText: string
    if (error instanceof ValidationProblemDetailedInfo) {
        let validationError = <ValidationProblemDetailedInfo>error
        errorText = JSON.stringify(validationError.errors)
    } else {
        errorText = error.stack;
    }

    console.log("ERROR " + errorText + " " + JSON.stringify(error))

    let errorDiv = await sleepElementLoaded('div.' + panelClass + ' #' + errorElementId, document)
    let span = document.createElement('span');

    span.innerHTML = errorText
    errorDiv.appendChild(span)
    errorDiv.appendChild(document.createElement('br'))
    await saveErrorToBackend(error, client);
}

function getAuthorizeFetch(oAuth2Client: OAuth2Client, scope: string, tokenStore: string, redirectUri: string): FetchWrapperCustom {
    return new FetchWrapperCustom({
        client: oAuth2Client,
        getNewToken: async () => {
            let codeVerifier = (await chrome.storage.local.get(["code_verifier"])).code_verifier;
            document.location.href = await oAuth2Client.authorizationCode.getAuthorizeUri({
                redirectUri: redirectUri,
                codeVerifier,
                scope: [scope]
            });
            return null;
        },
        getStoredToken: async () => {
            if (backendUrl !== (await chrome.storage.local.get(["backend_url"])).backend_url) return null;
            let token = (await chrome.storage.local.get(tokenStore))[tokenStore];
            if (token) return JSON.parse(token);
            return null;
        },
        fetch: fetchResource
    })
}

async function hideErrorsAndEnableSubmit() {
    let submitButton = <HTMLInputElement>(await sleepElementLoaded('#' + submitId, document))
    submitButton.disabled = false;
    let errorDiv = await sleepElementLoaded('div.' + panelClass + ' #' + errorElementId, document)
    errorDiv.innerHTML = ""
}

async function productPage(backendClient: EbayToolBackendClient, ebayClient: EbayClient) {
    console.log("productPage")

    await createPanel(backendClient, ebayClient)
    try {
        await getDataFromPage(backendClient, ebayClient);
        await hideErrorsAndEnableSubmit()
    } catch (error) {
        await showAndSaveError(error, backendClient);
    }
    _panel.hidden = false;
}

async function frappeExtensionAuthPage() {
    console.log("frappeExtensionAuthPage")

    let backendOAuth2Client = getFrappeOAuth2Client();
    let url = new URL(document.location.href)
    if (url.searchParams.has("code")) {
        let codeVerifier = (await chrome.storage.local.get(["code_verifier"])).code_verifier;

        let oauth2Token = await backendOAuth2Client.authorizationCode.getTokenFromCodeRedirect(
            document.location.href,
            {
                redirectUri: extensionAuthRedirectUrl,
                codeVerifier
            }
        );

        await chrome.storage.local.set({backend_url: backendUrl})
        await chrome.storage.local.set({frappeTokenStore: JSON.stringify(oauth2Token)})

        let returnPage = (await chrome.storage.local.get(["return_page"]))?.return_page;

        if (returnPage) {
            await chrome.storage.local.set({return_page: null})
            redirectWithoutReferer(returnPage);
        } else {
            document.location.href = extensionAuthRedirectUrl
        }
    }
}

async function extensionAuthPage() {
    console.log("extensionAuthPage")
    
    let backendOAuth2Client = getBackendOAuth2Client();
    let url = new URL(document.location.href)
    if (url.searchParams.has("code")) {
        let codeVerifier = (await chrome.storage.local.get(["code_verifier"])).code_verifier;
        
        let oauth2Token = await backendOAuth2Client.authorizationCode.getTokenFromCodeRedirect(
            document.location.href,
            {
                redirectUri: extensionAuthRedirectUrl,
                codeVerifier
            }
        );
        
        await chrome.storage.local.set({backend_url: backendUrl})
        await chrome.storage.local.set({ebayToolTokenStore: JSON.stringify(oauth2Token)})
        
        let returnPage = (await chrome.storage.local.get(["return_page"]))?.return_page;

        if (returnPage) {
            await chrome.storage.local.set({return_page: null})
            redirectWithoutReferer(returnPage);
        } else {
            document.location.href = extensionAuthRedirectUrl
        }
    }
}

function redirectWithoutReferer(url: string) {
    window.open(url, '_self', 'noopener,noreferrer');
}

async function ebayApiAuthPage() {
    console.log("ebayApiAuthPage")
    let ebayOAuth2Client: OAuth2Client = getEbayOAuth2Client();
    let url = new URL(document.location.href)
    if (url.searchParams.has("code")) {

        let oAuth2Client = ebayOAuth2Client;

        let codeVerifier = (await chrome.storage.local.get(["code_verifier"])).code_verifier;
        
        let oauth2Token = await oAuth2Client.authorizationCode.getTokenFromCodeRedirect(
            document.location.href,
            {
                redirectUri: ebayRedirectUriCode,
                codeVerifier
            }
        );
        
        await chrome.storage.local.set({ebayTokenStore: JSON.stringify(oauth2Token)})
        
        let returnPage = (await chrome.storage.local.get(["return_page"]))?.return_page;

        if (returnPage) {
            await chrome.storage.local.set({return_page: null})
            document.location.href = returnPage;
        } else {
            document.location.href = ebayRedirectUriCode
        }
    }
}



async function searchPage(client: EbayToolBackendClient) {
    console.log("SearchPage")

    //только на странице проданые лоты
    if (new URL(document.location.href).searchParams?.get('LH_Sold')?.trim() !== "1") return;
    
    
    
    let searchResults = await sleepElementLoaded('ul.srp-results', document)
    
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
        let _ = updateStatusInfinite(client, links);
    }

    await createOpenMultipleButton()
}

async function updateStatusInfinite(client: EbayToolBackendClient, links: LotLink[]) {
    let ids = links.map(function (x) {
        return x.id
    })
    // noinspection InfiniteLoopJS
    while (true) {
        try {
            //console.log("UpdatingLotStates")
            let getLotStatesAnswer = await client.getLotStates(ids)
            let ignoredLots = new Set(await client.getIgnoredLots(_currentProductId))

            let knownLots = new Map(getLotStatesAnswer.map(p => [p.lotId, p]));
            
            let importantCount = 0;
            links.forEach(function (x) {
                x.previousColor = x.color;

                if (!ignoredLots.has(x.id)) {
                    if (knownLots.has(x.id)) {
                        let lotState = knownLots.get(x.id)

                        let diffInDays = Math.ceil((x.soldDate.getTime() - new Date(lotState.lastUpdate).getTime()) / (1000 * 60 * 60 * 24));
                        if (diffInDays > 0) {
                            x.color = lightYellowColor
                        } else {
                            x.color = lightGreenColor
                        }
                        importantCount++;
                    } else {
                        x.color = lightPinkColor
                        importantCount++;
                    }
                } else {
                    x.color = lightGrayColor
                }
                
                x.importantCount = importantCount;
            })

            let filteredLinks = links.filter(item => item.importantCount <= interestedInTopNItems);
            
            filteredLinks.forEach(x => {
                if (x.color !== null && x.previousColor !== x.color) {
                    x.link.style.cssText = `background-color: ${x.color};`
                }
            });
            
            _needActualizationLotsIds = filteredLinks
                .filter(x => x.color === lightYellowColor || x.color === lightPinkColor )
                .map(x=>x.id)
        } catch (error) {
            await saveErrorToBackend(error, client)
        }
        await sleep(1000)
    }
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


async function saveCodeVerifier() {
    let codeVerifier = (await chrome.storage.local.get(["code_verifier"]))?.code_verifier;

    if (codeVerifier === null || codeVerifier === undefined) {
        let codeVerifier = await generateCodeVerifier();
        await chrome.storage.local.set({code_verifier: codeVerifier})
    }
}

async function ebayPages(currentPage: string) {
    await chrome.storage.local.set({return_page: document.location.href})
    
    // let frappeOAuth2Client: OAuth2Client = getFrappeOAuth2Client();
    // let frappeClient = new Frappe.FrappeBackendClient(frappeBaseApiUrl, getAuthorizeFetch(frappeOAuth2Client, frappeScope, "frappeTokenStore", frappeAuthRedirectUrl));
    // let x = await frappeClient.item(
    //     undefined,
    //     undefined,
    //     undefined,
    //     undefined,
    //     undefined
    // );
    //
    // console.log(x)


    let ebayOAuth2Client: OAuth2Client = getEbayOAuth2Client();
    let backendOAuth2Client: OAuth2Client = getBackendOAuth2Client();

    await sleepElementLoaded('footer', document)

    _currentProductId = getCurrentProductIdParam();
    if (!_currentProductId) {
        console.log("productId not found")
        return;
    }

    
    let authorizeFetch = getAuthorizeFetch(ebayOAuth2Client, ebayApiScope, "ebayTokenStore", ebayRedirectUriCode)

    let ebayClient = new EbayClient("https://api.ebay.com/buy/browse/v1", authorizeFetch);
    let backendClient = new EbayToolBackendClient(baseApiUrl, getAuthorizeFetch(backendOAuth2Client, backendApiScope, "ebayToolTokenStore", extensionAuthRedirectUrl));
    try {
        if (currentPage.startsWith("https://www.ebay.com/itm/")) {
            await productPage(backendClient, ebayClient);
        } else if (currentPage.startsWith("https://www.ebay.com/sch/")) {
            await searchPage(backendClient);
        }
    } catch (error) {
        await saveErrorToBackend(error, backendClient)
    }
}


async function getAllProductsCached(backendClient: EbayToolBackendClient, productId: string | null) {
    let cached = await getCachedDataOrFallback(_allItemsCacheIdentifier, async () => {
            return await backendClient.getAllProducts();
        },
        60 * 60)
    
    productId = productId?.trim()?.toLowerCase()
    if (productId && !cached.some(p => p.id.trim().toLowerCase() === productId)) {
        console.log(`Product ID ${productId} not found in cache, refreshing cache, clearing cache...`);
        removeFromCache(_allItemsCacheIdentifier);
        
        return await getCachedDataOrFallback(_allItemsCacheIdentifier, async () => {
                return await backendClient.getAllProducts();
            },
            60 * 60);
    }
    
    return cached;
}

// Вспомогательная функция для проверки соответствия регулярному выражению
function matchesAnyRegex(regexSet: RegExp[], value: string): boolean {
    return regexSet.some((regex) => regex.test(value));
}

// Получение OAuth2 клиента для eBay
function getEbayOAuth2Client(): OAuth2Client {
    return new OAuth2Client({
        server: "https://auth.ebay.com/",
        clientId: 'ArtemPet-tubesSea-PRD-63b5a5e64-416f2036',
        tokenEndpoint: 'https://api.ebay.com/identity/v1/oauth2/token',
        authorizationEndpoint: '/oauth2/authorize',
        clientSecret: "PRD-689869074719-68a0-4a78-9b78-8c3f",
        fetch: fetchResource
    });
}

// Получение OAuth2 клиента для Frappe
function getFrappeOAuth2Client(): OAuth2Client {
    return new OAuth2Client({
        server: frappeBaseApiUrl,
        clientId: 'rucemhiaqo',
        tokenEndpoint: '/api/method/frappe.integrations.oauth2.get_token',
        authorizationEndpoint: '/api/method/frappe.integrations.oauth2.authorize',
        //clientSecret: "3533fa9cf9",
        fetch: fetchResource
    });
}

// Получение OAuth2 клиента для бэкенда
function getBackendOAuth2Client(): OAuth2Client {
    return new OAuth2Client({
        server: backendUrl,
        clientId: 'Ebay.ChromeExtension',
        tokenEndpoint: '/connect/token',
        authorizationEndpoint: '/connect/authorize',
        fetch: fetchResource
    });
}

// Поиск по сайтам (обертка для функции из модуля searchSites)
async function searchSitePages() {
    await searchSitePagesFunc(fetchResource, _allItemsCacheIdentifier);
}

export async function run() {
  
    if (!matchesAnyRegex(workOnSites, location.host))
        return;
    
    console.log("Ebay extension is active on this page");
    
    await saveCodeVerifier();

    let _ = checkForUpdates();

    let currentPage = location.protocol + '//' + location.host + location.pathname

    if (currentPage === frappeAuthRedirectUrl) {
        await frappeExtensionAuthPage();
    }
    else if (currentPage === extensionAuthRedirectUrl) {
        await extensionAuthPage();
    } else if (currentPage === ebayAuthRedirectUrl) {
        await ebayApiAuthPage();
    } else if (ebaySiteRegex.test(location.host)) {
        await ebayPages(currentPage);
    } else if (matchesAnyRegex(searchOnSites, location.host)) {
        await searchSitePages();
    }
}


run();