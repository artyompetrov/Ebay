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
    ValidationProblemDetailedInfo
} from "./EbayClient/EbayToolBackendClient"
import {EbayClient, Item} from "./EbayClient/EbayClient"
import {generateCodeVerifier, OAuth2Client} from '@badgateway/oauth2-client';
import {FetchWrapperCustom} from "./FetchWrapperCustom";

const ignoreThatLotFieldName = "ignoreThatLot";
const productFieldName = "productId";
const pcsFieldName = "pcs";
const autoPcsFieldName = "autoPcs";
const categoryPrefix = 'category_'
const panelClass = "panel-div";
const panelInputClass = "panel-input-div";
const formId = "product-form-id"
const errorElementId = "errorElement"
const submitId = "submitButton"
//const backendUrl = "https://localhost:7095/"
const backendUrl = "https://naks42.ru:17443/"
const baseApiUrl = `${backendUrl}api/ebay/v1`;
const redirectUrl = "https://www.ebay.com/"
const ebayRedirectUriCode = "Artem_Petrov-ArtemPet-tubesS-dsrgu"
const ebayApiScope = "https://api.ebay.com/oauth/api_scope"
const backendApiScope = 'Ebay.ServerAPI'
const lightGreenColor = "#ecffec"
const lightPinkColor = "lightpink"
const lightYellowColor = "#e0e07f"
const marketplaceId = "EBAY_US"
const batchOpen = 5
const searchQueryParam = 'searchQuery'
const ignoreThatLotDiv = "ignoreThatLotDiv"
const unsupportedLotDiv = "unsupportedLotDiv"
const categoriesDiv = "categoriesDiv"
let _lotInfo = new LotInfo()
let _serverLotInfo: LotInfoWithProductId;
let _unsupportedLot = false;
let _needActualizationLotsIds: number[] = null
let _serverAndEbayAreEqual = false;
let _panel: HTMLDivElement;

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
supportedShippingCountries.set('GB', new ShippingParameters(['EUROPE'], null))
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

// fetch через background script, по другому не работает
function fetchResource(input: RequestInfo, init: RequestInit): Promise<Response> {
    console.log(JSON.stringify(input) + " " + JSON.stringify(init))
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({input, init}, messageResponse => {
            const [response, error] = messageResponse;
            if (response === null) {
                reject(error);
            } else {
                // Use undefined on a 204 - No Content
                const body = response.body ? new Blob([response.body]) : undefined;
                resolve(new Response(body, {
                    status: response.status,
                    statusText: response.statusText,
                }));
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
    div.classList.add(panelClass);


    let form = document.createElement('form')
    form.id = formId
    let itemId = location.pathname.match(/\/itm\/([0-9]+)/)[1];
    let domain = location.hostname;

    let historyButtonHref = `https://${domain}/bin/purchaseHistory?item=${itemId}`;
    let revisionsButtonHref = `https://${domain}/rvh/${itemId}`;
    // language=HTML
    form.innerHTML = `
        <a href="${historyButtonHref}" target="_blank">История продаж лота</a>
        <br><a href="${revisionsButtonHref}" target="_blank">История изменений лота</a>
        <br>Бэкенд: <a href="${backendUrl}" target="_blank">${backendUrl}</a>
        <br>
        <div class="${panelInputClass}">
            <div id="${ignoreThatLotDiv}">
                <label for="${ignoreThatLotFieldName}">Игнорировать лот</label>
                <input id="${ignoreThatLotFieldName}" type="checkbox" name="${ignoreThatLotFieldName}"/>
                <br>
                <br>
            </div>
            <label for="${productFieldName}">Товар</label>
            <select name="${productFieldName}" id="${productFieldName}">
                <option value="">Выберите товар</option>
            </select>
            <br>
            <label for="${pcsFieldName}">PCS</label>
            <input id="${pcsFieldName}" type="number" name="${pcsFieldName}"/>
            <input id="${autoPcsFieldName}" type="text" name="${autoPcsFieldName}" readonly/>
        </div>
        <br>
        <div id="${categoriesDiv}">
        </div>
        <div id="${unsupportedLotDiv}" hidden="hidden">Лот не поддерживается, будет добавлен в игнор
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

        for (let x of _needActualizationLotsIds.slice(0, batchOpen)) {
            let url = "https://www.ebay.com/itm/" + x;
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

        let ignoreThatLot = false;
        let categories = [];
        data.forEach(function (value, key) {

            if (key.startsWith(categoryPrefix)) {
                let category = key.replace(categoryPrefix, "")
                categories.push(new CategoryValue({type: category, value: value.toString()}))
            } else if (key === 'ignoreThatLot') {
                ignoreThatLot = true
            } else {
                _lotInfo[key] = value;
            }
        });

        _lotInfo.categories = categories;

        if (_unsupportedLot) {
            ignoreThatLot = true;
        }

        _lotInfo['ignoreThatLot'] = ignoreThatLot;

        if (ignoreThatLot) {
            if (!_lotInfo.pcs) {
                _lotInfo.pcs = 1
            }

            if (!_lotInfo.titleChangeDate) {
                _lotInfo.titleChangeDate = new Date(0).toISOString()
            }
        }

        console.log("Sending to backend: " + JSON.stringify(_lotInfo))


        let productId = data.get('productId').toString();

        if (!productId) {
            // noinspection ExceptionCaughtLocallyJS
            throw new Error("Product id not set");
        }

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

    if (matches[6].toUpperCase() === "MSK") {
        date.setHours(date.getHours() - 3);
    } else {
        throw new Error("unknown timezone " + matches[6])
    }

    return date
}

function parseSoldItemsPage(text: string): PurchaseInfo[] {
    let doc = new DOMParser().parseFromString(text, "text/html")

    let result = new Array<PurchaseInfoInner>();
    let fixedPriceBlock = doc.querySelector('div.fixed-price tbody')
    if (fixedPriceBlock !== null) {
        let fixedPriceRows = [...fixedPriceBlock.querySelectorAll('tr')]
        fillSoldItemsResult(fixedPriceRows, result);
    }

    let offerBlock = doc.querySelector('div.offer tbody')
    if (offerBlock !== null) {
        let offerRows = [...offerBlock.querySelectorAll('tr')]
        fillSoldItemsResult(offerRows, result);
    }

    return result.sort(function (a, b) {
        return b.date.getTime() - a.date.getTime();
    }).map(function (x) {

        return new PurchaseInfo({
            date: x.date.toISOString(), quantity: x.quantity, price: x.price?.price
        })
    });
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

async function fillPurchaseHistory() {
    if (!_unsupportedLot) {
        let itemId = location.pathname.match(/\/itm\/([0-9]+)/)[1];
        let purchaseHistoryUrl = `https://${location.hostname}/bin/purchaseHistory?item=${itemId}`;
        let response = await fetchResource(purchaseHistoryUrl, {method: 'GET', credentials: 'include'})
        let text = await response.text()
        _lotInfo.purchaseHistory = parseSoldItemsPage(text)
    }
}

async function fillUpdateTitleDate() {
    if (!_unsupportedLot) {
        let itemId = location.pathname.match(/\/itm\/([0-9]+)/)[1];
        let url = `https://${location.hostname}/rvh/${itemId}`;
        console.log(url);
        let response = await fetchResource(url, {method: 'GET', credentials: 'include'})
        let text = await response.text()
        _lotInfo.titleChangeDate = parseRevisionSummary(text).toISOString()
    }
}

function parseRevisionSummary(text: string): Date {
    console.log("parseRevisionSummary")
    let doc = new DOMParser().parseFromString(text, "text/html")

    let table = doc.querySelector('div#vi-revision-history-layout-container table')
    if (table) {
        let rows = [...table.querySelectorAll('tr')]

        for (let row of rows.reverse()) {
            let columns = [...row.querySelectorAll('td')]
            if (columns.length === 0) continue;
            let changes = columns[2].innerText;
            if (changes.includes('Title')) {
                let date = columns[0].innerText
                let time = columns[1].innerText

                return parseDate(date + " " + time)
            }
        }
    }

    return new Date(0)
}

function getSearchQuery(): string | undefined {
    if (document.referrer) {
        return new URL(document.referrer).searchParams?.get('_nkw')?.trim()?.toLowerCase();
    }

    return new URL(document.location.href).searchParams?.get(searchQueryParam)?.trim()?.toLowerCase();
}

async function fillProduct(panel: HTMLDivElement, client: EbayToolBackendClient, serverLotInfo: LotInfoWithProductId | undefined) {
    let productField = panel.querySelector('select#' + productFieldName);

    let productId = serverLotInfo?.productId?.trim()?.toLowerCase()
    let searchQuery = getSearchQuery();

    let products = await client.getAllProducts()
    for (let i = 0; i < products.length; i++) {
        let opt = document.createElement('option');
        opt.value = products[i].id;
        opt.innerHTML = products[i].name;

        if (productId !== undefined) {
            if (productId === products[i].id.trim().toLowerCase()) {
                opt.selected = true
            }
        } else if (searchQuery !== undefined) {
            products[i].searchQueries.forEach(function (x) {
                if (searchQuery === x.query.trim().toLowerCase()) {
                    opt.selected = true
                }
            })

        }
        productField.appendChild(opt);
    }
}

async function fillManualCondition(panel: HTMLDivElement, client: EbayToolBackendClient, serverLotInfo: LotInfoWithProductId | undefined, extractedDataByFieldName: {}) {
    let categoriesDivElement = panel.querySelector('div#' + categoriesDiv);
    categoriesDivElement.innerHTML = ""

    let serverCategories = serverLotInfo?.lotInfo?.categories?.reduce((dictionary, value) => {
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

async function getServerLotInfo(client: EbayToolBackendClient): Promise<LotInfoWithProductId | undefined> {
    try {
        _serverLotInfo = await client.getLotInfo(_lotInfo.lotId);
    } catch (error) {
        if (error instanceof NotFoundProblemDetailedInfo) {
            return undefined;
        }

        throw error;
    }
}

async function fillPcs(panel: HTMLDivElement, serverLotInfo: LotInfoWithProductId | undefined, extractedDataByFieldName: {}) {
    let pcsField = <HTMLInputElement>panel.querySelector('input#' + pcsFieldName);
    let autoPcsField = <HTMLInputElement>panel.querySelector('input#' + autoPcsFieldName);

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

                fillManualWithAutoValue = true
            } else {
                autoPcsField.style.backgroundColor = lightPinkColor;
            }
        }

    } else {
        autoPcsField.value = "1"
        autoPcsField.style.backgroundColor = lightYellowColor;

        fillManualWithAutoValue = true
    }

    let serverPcs = serverLotInfo?.lotInfo?.pcs
    if (serverPcs !== undefined) {
        pcsField.value = serverPcs.toString()
    } else if (fillManualWithAutoValue) {
        pcsField.value = autoPcsField.value
    }
}

async function fillIgnoreThatLot(panel: HTMLDivElement, serverLotInfo: LotInfoWithProductId | undefined) {
    let ignoreThatLotField = <HTMLInputElement>panel.querySelector('input#' + ignoreThatLotFieldName);

    let serverPcs = serverLotInfo?.lotInfo?.ignoreThatLot
    if (serverPcs !== undefined) {
        ignoreThatLotField.checked = serverPcs
    }
}


async function compareLotInfos(serverLotInfoWithProductId: LotInfoWithProductId) {
    if (serverLotInfoWithProductId === undefined) return;

    let serverLotInfoJson = serverLotInfoWithProductId.lotInfo.toJSON()
    serverLotInfoJson["pcs"] = undefined
    serverLotInfoJson["ignoreThatLot"] = undefined
    serverLotInfoJson["categories"] = undefined
    serverLotInfoJson["description"] = undefined
    serverLotInfoJson["seller"] = undefined
    serverLotInfoJson["purchaseHistory"] = undefined

    let lotInfoJson = _lotInfo.toJSON()
    lotInfoJson["pcs"] = undefined
    lotInfoJson["ignoreThatLot"] = undefined
    lotInfoJson["categories"] = undefined
    lotInfoJson["description"] = undefined
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
        if (_serverLotInfo.lotInfo.ignoreThatLot === true || ebayMaxDate === 0 || serverMaxDate === ebayMaxDate) {
            panel.style.cssText = `background-color: ${lightGreenColor};`
            _serverAndEbayAreEqual = true;
        } else {
            panel.style.cssText = `background-color: ${lightYellowColor};`
        }
    } else {
        panel.style.cssText = `background-color: ${lightPinkColor};`
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


async function fillManualFieldsAuto(client: EbayToolBackendClient): Promise<{}> {
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
    let lotId = location.pathname.match(/\/itm\/([0-9]+)/)[1];
    
    let ebayItem = await ebayClient.getItemByLegacyId(undefined,
        lotId,
        undefined,
        undefined,
        undefined,
        marketplaceId);

    let shippingCountry = getShippingCountry(ebayItem);
    let zipCode = supportedShippingCountries.get(shippingCountry).zip ?? "<zip_code>"
    
    //todo перейти на https://developer.ebay.com/Devzone/shopping/docs/CallRef/GetShippingCosts.html
    ebayItem = await ebayClient.getItemByLegacyId(undefined,
        lotId,
        undefined,
        undefined,
        `contextualLocation=country=${shippingCountry},zip=${zipCode}`,
        marketplaceId);


    fillLotInfo(ebayItem, shippingCountry)
}

function fillShipping(ebayItem: Item, shippingCountry: string) {
    let shippingOption = ebayItem.shippingOptions[0]

    let shippingCurrency: string;
    let shippingValue: string;
    let additionalShippingCostPerUnit: string;
    if (shippingOption.shippingCost.convertedFromValue === undefined) {
        shippingValue = shippingOption.shippingCost.value;
        shippingCurrency = shippingOption.shippingCost.currency;
        additionalShippingCostPerUnit = shippingOption.additionalShippingCostPerUnit.value
    } else {
        shippingValue = shippingOption.shippingCost.convertedFromValue;
        shippingCurrency = shippingOption.shippingCost.convertedFromCurrency;
        additionalShippingCostPerUnit = shippingOption.additionalShippingCostPerUnit.convertedFromValue
    }


    if (_lotInfo.currency != shippingCurrency) throw new Error("Shipping and lot currency mismatch lot + " + _lotInfo.currency + " shipping " + shippingCurrency)

    _lotInfo.shipping = parseFloat(shippingValue)
    _lotInfo.shippingAdditional = parseFloat(additionalShippingCostPerUnit)
    _lotInfo.shippingCountry = shippingCountry
}

function fillLotInfo(ebayItem: Item, shippingCountry: string) {
    console.log(JSON.stringify(ebayItem))

    _lotInfo.lotId = parseInt(ebayItem.legacyItemId)

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

    _lotInfo.conditionDescription = ebayItem.conditionDescription

    _lotInfo.description = ebayItem.description

    _lotInfo.locatedIn = ebayItem.itemLocation.country

    _lotInfo.shortDescription = ebayItem.shortDescription

    fillShipping(ebayItem, shippingCountry);

    //todo categoryPath
}


async function getDataFromPage(backendClient: EbayToolBackendClient, ebayClient: EbayClient) {
    await Promise.all([
        await getEbayItem(ebayClient),
        await getServerLotInfo(backendClient),
    ]);

    let extractedDataByFieldName = await fillManualFieldsAuto(backendClient);

    await Promise.all([
        fillPurchaseHistory(),
        fillUpdateTitleDate(),
        fillProduct(_panel, backendClient, _serverLotInfo),
        fillManualCondition(_panel, backendClient, _serverLotInfo, extractedDataByFieldName),
        fillPcs(_panel, _serverLotInfo, extractedDataByFieldName),
        fillIgnoreThatLot(_panel, _serverLotInfo),
    ]);

    await compareLotInfos(_serverLotInfo);
}

async function saveErrorToBackend(error: Error, client: EbayToolBackendClient) {
    let errorText = JSON.stringify(error) + " " + error.stack
    try {
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

async function authPage(backendOAuth2Client: OAuth2Client, ebayOAuth2Client: OAuth2Client) {
    console.log("authPage")
    let url = new URL(document.location.href)
    if (url.searchParams.has("code")) {

        let isEbayAuth = url.searchParams.has("ebayAuth")

        let oAuth2Client = isEbayAuth ? ebayOAuth2Client : backendOAuth2Client;

        let codeVerifier = (await chrome.storage.local.get(["code_verifier"])).code_verifier;

        let redirect = isEbayAuth ? ebayRedirectUriCode : redirectUrl;
        let oauth2Token = await oAuth2Client.authorizationCode.getTokenFromCodeRedirect(
            document.location.href,
            {
                redirectUri: redirect,
                codeVerifier
            }
        );
        await chrome.storage.local.set({backend_url: backendUrl})
        if (isEbayAuth) {
            await chrome.storage.local.set({ebayTokenStore: JSON.stringify(oauth2Token)})
        } else {
            await chrome.storage.local.set({ebayToolTokenStore: JSON.stringify(oauth2Token)})
        }

        let returnPage = (await chrome.storage.local.get(["return_page"]))?.return_page;

        if (returnPage !== null && returnPage !== undefined) {
            await chrome.storage.local.set({return_page: null})
            document.location.href = returnPage
        } else {
            document.location.href = redirect
        }
    }
}


async function searchPage(client: EbayToolBackendClient) {
    console.log("SearchPage")
    //только на странице проданые лоты
    if (new URL(document.location.href).searchParams?.get('LH_Sold')?.trim() !== "1") return;

    let searchResults = await sleepElementLoaded('ul.srp-results', document)

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


            let knownLots = new Map(getLotStatesAnswer.map(p => [p.lotId, p]));

            let notKnownItems = []

            links.forEach(function (x) {

                let color = x.color;

                if (knownLots.has(x.id)) {
                    let lotState = knownLots.get(x.id)
                    if (!lotState.ignoreThatLot) {
                        let diffInDays = Math.ceil((x.soldDate.getTime() - new Date(lotState.lastUpdate).getTime()) / (1000 * 60 * 60 * 24));
                        if (diffInDays > 0) {
                            x.color = lightYellowColor
                            notKnownItems.push(x.id);
                        } else {
                            x.color = lightGreenColor
                        }
                    } else {
                        x.color = lightGreenColor
                    }
                } else {
                    x.color = lightPinkColor
                    notKnownItems.push(x.id);
                }

                if (x.color !== null && color !== x.color) {
                    x.link.style.cssText = `background-color: ${x.color};`
                }
            })

            _needActualizationLotsIds = notKnownItems
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
    color: string | null
}


async function saveCodeVerifier() {
    let codeVerifier = (await chrome.storage.local.get(["code_verifier"]))?.code_verifier;

    if (codeVerifier === null || codeVerifier === undefined) {
        let codeVerifier = await generateCodeVerifier();
        await chrome.storage.local.set({code_verifier: codeVerifier})
    }
}

export async function run() {
    await sleepElementLoaded('footer', document)
    await saveCodeVerifier();

    let ebayOAuth2Client = new OAuth2Client({
        server: "https://auth.ebay.com/",
        clientId: 'ArtemPet-tubesSea-PRD-63b5a5e64-416f2036',
        tokenEndpoint: 'https://api.ebay.com/identity/v1/oauth2/token',
        authorizationEndpoint: '/oauth2/authorize',
        clientSecret: "PRD-3b5a5e64bd92-2c90-41e9-bff8-e256",
        fetch: fetchResource
    });

    let backendOAuth2Client = new OAuth2Client({
        server: backendUrl,
        clientId: 'Ebay.ChromeExtension',
        tokenEndpoint: '/connect/token',
        authorizationEndpoint: '/connect/authorize',
        fetch: fetchResource
    });

    let currentPage = location.protocol + '//' + location.host + location.pathname

    if (currentPage === redirectUrl) {
        await authPage(backendOAuth2Client, ebayOAuth2Client);
    } else {
        await chrome.storage.local.set({return_page: document.location.href})
        let ebayClient = new EbayClient("https://api.ebay.com/buy/browse/v1", getAuthorizeFetch(ebayOAuth2Client, ebayApiScope, "ebayTokenStore", ebayRedirectUriCode));
        let backendClient = new EbayToolBackendClient(baseApiUrl, getAuthorizeFetch(backendOAuth2Client, backendApiScope, "ebayToolTokenStore", redirectUrl));
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

}


run();