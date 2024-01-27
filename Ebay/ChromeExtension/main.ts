import {
    Client,
    LotInfo,
    LotInfoWithProductId, NotFoundProblemDetailedInfo,
    PurchaseInfo, ValidationProblemDetailedInfo
} from "./EbayClient/EbayClient"

import {generateCodeVerifier, OAuth2Client} from '@badgateway/oauth2-client';
import {FetchWrapperCustom} from "./FetchWrapperCustom";

const ignoreThatLotFieldName = "ignoreThatLot";
const manualConditionIdFieldName = "manualConditionId";
const productFieldName = "productId";
const pcsFieldName = "pcs";

const panelClass = "panel-div";
const formId = "product-form-id"
const errorElementId = "errorElement"
const submitId = "submit"
const backendUrl = "https://localhost:7095/"
const baseApiUrl = `${backendUrl}api/ebay/v1`;
const authRedirectUrl = "https://www.ebay.com/"
const notSetValue = "notSet"

const lotInfo = new LotInfo();
let _serverLotInfo: LotInfoWithProductId;

// fetch через background script, по другому не работает
function fetchResource(input: RequestInfo, init: RequestInit): Promise<Response> {
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


function extractPrice(price) {
    let matches = price.match(/(\D+)(\d+(?:[,.]\d+)?)/)
    if (matches[1] !== "US $") {
        throw new Error('US $ price expected, but was')
    }

    return parseFloat(matches[2].replace(',', '.'))
}

function createHistoryButton() {
    let itemId = location.pathname.match(/\/itm\/([0-9]+)/)[1];
    let domain = location.hostname;
    let historyButton = document.createElement('a');
    historyButton.classList.add('history-button');
    historyButton.textContent = 'HISTORY';
    historyButton.href = `https://${domain}/bin/purchaseHistory?item=${itemId}`;
    historyButton.style.cssText = `
    cursor: pointer;
    margin-left: 5px;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 3px 6px;
    text-decoration: none;
    color: black;
  `;
    historyButton.target = '_blank';

    return historyButton;
}

async function addHistoryButton() {
    let productTitleContainer = await sleepElementLoaded('.vim[data-testid="x-item-title"]');
    if (productTitleContainer) {
        let existingButton = productTitleContainer.querySelector('a.history-button');
        if (!existingButton) {
            let historyButton = createHistoryButton();
            productTitleContainer.appendChild(historyButton);
        }
    }
}

function createPanel(bodyElement, client: Client) {
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
    
    .${panelClass} label {
      font-weight: bold;
      display: block;
      width: 200px;
      float: left;
    }
    
    .${panelClass} input {
      width: 200px;
    }
    
    .${panelClass} select {
      width: 200px;
    }
    
    .${panelClass} label:after { content: ": " }
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
        <label for="${ignoreThatLotFieldName}">Игнорировать лот</label>
        <input id="${ignoreThatLotFieldName}" type="checkbox" name="${ignoreThatLotFieldName}"/>
        <br>
        <br>
        <label for="${productFieldName}">Товар</label>
        <select name="${productFieldName}" id="${productFieldName}">
            <option value="">Выберите товар</option>
        </select>
        <br>
        <label for="${pcsFieldName}">PCS</label>
        <input id="${pcsFieldName}" type="number" name="${pcsFieldName}"/>
        <br>
        <label for="${manualConditionIdFieldName}">Состояние</label>
        <select name="${manualConditionIdFieldName}" id="${manualConditionIdFieldName}">
            <option value="">Выберите Состояние</option>
        </select>
        <br>
        <div style="color: red;" id="${errorElementId}"></div>
        <br>
        <input id="${submitId}" type="submit" value="Save" disabled/>`;

    form.addEventListener("submit", async function (event: SubmitEvent) {
        await handleSubmit(event, client)
    });

    div.appendChild(form)
    bodyElement.appendChild(div);
}

async function handleSubmit(event: SubmitEvent, client: Client) {
    try {
        event.preventDefault();
        let data = new FormData(<HTMLFormElement>event.target);

        let ignoreThatLot = false;

        data.forEach(function (value, key) {

            if (key === 'ignoreThatLot') {
                ignoreThatLot = true
            } else {
                lotInfo[key] = value;
            }
        });

        lotInfo['ignoreThatLot'] = ignoreThatLot;

        if (ignoreThatLot) {
            lotInfo.pcs = 1
            lotInfo.manualConditionId = notSetValue
        }

        console.log("Sending to backend: " + JSON.stringify(lotInfo))


        await client.upsertLotInfo(lotInfo, data.get('productId').toString())

        await productPage(client)
    } catch (error) {
        await showError(error)
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

            result.push(new PurchaseInfoInner(parseInt(columns[2]), parseDate(columns[3]), extractPrice(price)))
        } else {
            result.push(new PurchaseInfoInner(parseInt(columns[2]), parseDate(columns[3])))
        }
    }
}

class PurchaseInfoInner {
    constructor(quantity: number, date: Date, price?: number | undefined) {
        this.quantity = quantity
        this.date = date
        this.price = price
    }

    quantity: number;
    price: number | undefined;
    date: Date
}

function parseDate(dateString): Date {
    let matches = dateString.match(/(\d+\s[A-z]+\s\d+)\sat\s(\d+):(\d+):(\d+)(am|pm)\s([A-z]+)/)

    let date = new Date(Date.parse(matches[1] + ' 00:00:00.000Z'))

    date.setUTCHours(parseInt(matches[2]));
    date.setUTCMinutes(parseInt(matches[3]));
    date.setUTCSeconds(parseInt(matches[4]));

    if (matches[5] === "pm" && date.getUTCHours() !== 12) {
        date.setHours(date.getHours() + 12);
    }
    if (matches[5] === "am" && date.getUTCHours() === 12) {
        date.setHours(date.getHours() - 12);
    }

    if (matches[6] === "MSK") {
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
            date: x.date.toISOString(), quantity: x.quantity, price: x.price
        })
    });
}

function fillId() {
    lotInfo.lotId = parseInt(location.pathname.match(/\/itm\/([0-9]+)/)[1]);
}

async function fillPrice() {
    lotInfo.price = extractPrice((<HTMLElement>await sleepElementLoaded('div.x-price-primary span')).innerText)
}

async function fillName() {
    lotInfo.name = (<HTMLElement>await sleepElementLoaded('.vim h1')).innerText
}

async function fillSeller() {
    lotInfo.seller = (<HTMLElement>await sleepElementLoaded('div.x-sellercard-atf__info__about-seller a')).innerText.toLowerCase()
}

async function fillCondition() {
    lotInfo.condition = (<HTMLElement>await sleepElementLoaded('div.x-item-condition-text span.ux-textspans')).innerText
}

async function fillConditionDescription() {
    let conditionDescriptionElement = document.querySelector('div.x-item-condition-desc')
    if (conditionDescriptionElement != null) {
        lotInfo.conditionDescription = (<HTMLElement>conditionDescriptionElement).innerText
            .replace('“', '')
            .replace('”', '')
    }
}

async function fillShipping() {
    let shippingDiv = await sleepElementLoaded('div.d-shipping-maxview')
    let shippingRatesAvailable = shippingDiv.querySelector('div.ux-layout-section__textual-display--askSeller') === null
    if (shippingRatesAvailable) {
        let shippingTable = shippingDiv.querySelector('table.ux-table-section-with-hints--shippingTable')
        
        let deliveryColumnsHeader = [...shippingTable.querySelector('thead')
            .querySelectorAll('th')]
        let deliveryColumnsValues = [...shippingTable.querySelector('tbody')
            .querySelector('tr')
            .querySelectorAll('td')]

        let shippingMaxviewValues = {};

        for (let i = 0; i < 3; i++) {
            let key = deliveryColumnsHeader[i].innerText
            shippingMaxviewValues[key] = deliveryColumnsValues[i].querySelector('span').innerText
        }

        if (shippingMaxviewValues['To'] !== 'Germany') {
            throw new Error('Shipping country must be Germany');
        }

        let shippingValue = shippingMaxviewValues['Shipping and handling']

        if (shippingValue !== 'Free shipping') {
            lotInfo.shipping = extractPrice(shippingValue)

            if (shippingMaxviewValues.hasOwnProperty('Each additional item')) {

                let eachAdditional = shippingMaxviewValues['Each additional item']

                if (eachAdditional !== "Free") {
                    lotInfo.shippingAdditional = extractPrice(eachAdditional)
                } else {
                    lotInfo.shippingAdditional = 0;
                }
            } else {
                lotInfo.shippingAdditional = 0;
            }

        } else {
            lotInfo.shipping = 0;
            lotInfo.shippingAdditional = 0;
        }
    } else {
        lotInfo.shipping = undefined;
        lotInfo.shippingAdditional = undefined;
    }
}

async function fillLocatedIn() {
    let match = (<HTMLElement>await sleepElementLoaded('div.d-shipping-minview')).innerText.match(/Located\sin:\s(.+)/)
    if (match !== null) {
        lotInfo.locatedIn = match[1]
    } else {
        lotInfo.locatedIn = "Unknown"
    }
}

async function fillDescription() {
    let descriptionUrl = (<HTMLIFrameElement>await sleepElementLoaded('#desc_ifr')).src
    let response = await fetchResource(descriptionUrl, {method: 'GET', credentials: 'include'})
    lotInfo.description = await response.text()
}

async function fillPurchaseHistory() {
    let itemId = location.pathname.match(/\/itm\/([0-9]+)/)[1];
    let purchaseHistoryUrl = `https://${location.hostname}/bin/purchaseHistory?item=${itemId}`;
    let response = await fetchResource(purchaseHistoryUrl, {method: 'GET', credentials: 'include'})
    let text = await response.text()
    lotInfo.purchaseHistory = parseSoldItemsPage(text)
}

function getSearchQuery() : string | undefined {
    if (document.referrer) {
        return new URL(document.referrer).searchParams?.get('_nkw')?.trim()?.toLowerCase();
    }
    return undefined
}

async function fillProduct(panel: HTMLDivElement, client: Client, serverLotInfo: LotInfoWithProductId | undefined) {
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
            if (searchQuery === products[i].searchQuery.trim().toLowerCase()) {
                opt.selected = true
            }
        }
        productField.appendChild(opt);
    }
}

async function fillManualCondition(panel: HTMLDivElement, client: Client, serverLotInfo: LotInfoWithProductId | undefined) {
    let manualConditionField = panel.querySelector('select#' + manualConditionIdFieldName);

    let manualConditionId = serverLotInfo?.lotInfo?.manualConditionId?.trim()?.toLowerCase()

    let manualConditions = await client.getManualConditionsList()
    for (let i = 0; i < manualConditions.length; i++) {
        let opt = document.createElement('option');
        opt.value = manualConditions[i].id;
        opt.innerHTML = manualConditions[i].description;

        if (manualConditionId !== undefined) {
            if (manualConditionId === manualConditions[i].id.trim().toLowerCase()) {
                opt.selected = true
            }
        }

        manualConditionField.appendChild(opt);
    }
}

async function getServerLotInfo(client: Client): Promise<LotInfoWithProductId | undefined> {
    try {
        _serverLotInfo = await client.getLotInfo(lotInfo.lotId);
    } catch (error) {
        if (error instanceof NotFoundProblemDetailedInfo) {
            return undefined;
        }

        throw error;
    }
}

async function fillPcs(panel: HTMLDivElement, serverLotInfo: LotInfoWithProductId | undefined) {
    let pcsField = <HTMLInputElement>panel.querySelector('input#' + pcsFieldName);

    let serverPcs = serverLotInfo?.lotInfo?.pcs
    if (serverPcs !== undefined) {
        pcsField.value = serverPcs.toString()
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
    serverLotInfoJson["manualConditionId"] = undefined
    let lotInfoJson = lotInfo.toJSON()
    lotInfoJson["pcs"] = undefined
    lotInfoJson["ignoreThatLot"] = undefined
    lotInfoJson["manualConditionId"] = undefined
    if (serverLotInfoWithProductId.lotInfo.ignoreThatLot) {
        serverLotInfoJson["purchaseHistory"] = undefined
        lotInfoJson["purchaseHistory"] = undefined
    }

    let serverLotInfoJsonString = JSON.stringify(serverLotInfoJson)
    let currentPageLotInfoJsonString = JSON.stringify(lotInfoJson)
    let panel = <HTMLDivElement>await sleepElementLoaded('div.' + panelClass);
    if (serverLotInfoJsonString === currentPageLotInfoJsonString) {
        panel.style.cssText = `background-color: #ecffec;`
    } else {
        panel.style.cssText = `background-color: lightpink;`
    }

    console.log("Received from server: " + serverLotInfoJsonString)
    console.log("CurrentPage: " + currentPageLotInfoJsonString)
}

async function getDataFromPage(client: Client) {
    let panel = <HTMLDivElement>await sleepElementLoaded('div.' + panelClass)

    fillId();
    await Promise.all([
        fillPrice(),
        fillName(),
        fillSeller(),
        fillCondition(),
        fillConditionDescription(),
        fillLocatedIn(),
        fillDescription(),
        fillPurchaseHistory(),
        getServerLotInfo(client)
    ])
    await Promise.all([
        fillProduct(panel, client, _serverLotInfo),
        fillManualCondition(panel, client, _serverLotInfo),
        fillPcs(panel, _serverLotInfo),
        fillIgnoreThatLot(panel, _serverLotInfo),
        fillShipping(),
    ]);
    
    await compareLotInfos(_serverLotInfo);
}


async function addPanel(client: Client) {
    let bodyElement = await sleepElementLoaded('body');
    if (bodyElement) {
        let existingPanel = bodyElement.querySelector('div.' + panelClass);
        if (!existingPanel) {
            createPanel(bodyElement, client);
        }
    }
}

async function showError(error: Error) {
    let errorDiv = await sleepElementLoaded('div.' + panelClass + ' #' + errorElementId)
    let span = document.createElement('span');

    if (error instanceof ValidationProblemDetailedInfo) {
        let validationError = <ValidationProblemDetailedInfo>error
        span.innerHTML = "Ошибка валидации: " + JSON.stringify(validationError.errors)
    } else {
        console.log(error.stack)
        span.innerHTML = error.stack;
    }

    errorDiv.appendChild(span)
}

async function enableSubmitButton() {
    (<HTMLButtonElement>await sleepElementLoaded('#' + submitId)).disabled = false
}

function getAuthorizeFetch(oAuth2Client: OAuth2Client): FetchWrapperCustom {
    return new FetchWrapperCustom({
        client: oAuth2Client,
        getNewToken: async () => {
            let codeVerifier = (await chrome.storage.local.get(["code_verifier"])).code_verifier;

            document.location.href = await oAuth2Client.authorizationCode.getAuthorizeUri({
                redirectUri: authRedirectUrl,
                codeVerifier,
                scope: ['Ebay.ServerAPI']
            });
            return null;
        },
        getStoredToken: async () => {
            let token = (await chrome.storage.local.get(["token_store"])).token_store;
            if (token) return JSON.parse(token);
            return null;
        },
        fetch: fetchResource
    })
}

async function hideErrors() {
    let errorDiv = await sleepElementLoaded('div.' + panelClass + ' #' + errorElementId)
    errorDiv.innerHTML = ""
}

async function productPage(client: Client) {
    console.log("productPage")
    try {
        await addHistoryButton();
        await addPanel(client);
        await getDataFromPage(client);
        await enableSubmitButton()
        await hideErrors()
    } catch (error) {
        await showError(error);
        throw error;
    }
}

async function authPage(oAuth2Client: OAuth2Client) {
    console.log("authPage")
    let url = new URL(document.location.href)
    if (url.searchParams.has("code")) {
        let codeVerifier = (await chrome.storage.local.get(["code_verifier"])).code_verifier;
        let oauth2Token = await oAuth2Client.authorizationCode.getTokenFromCodeRedirect(
            document.location.href,
            {
                redirectUri: authRedirectUrl,
                codeVerifier
            }
        );

        await chrome.storage.local.set({token_store: JSON.stringify(oauth2Token)})

        document.location.href = authRedirectUrl
    }
}


async function searchPage(client: Client) {
    console.log("SearchPage")
    //только на странице проданые лоты
    if (new URL(document.location.href).searchParams?.get('LH_Sold')?.trim() !== "1") return;

    let searchResults = await sleepElementLoaded('ul.srp-results')

    let links = [...searchResults.querySelectorAll('li.s-item')]
        .map(function (x: HTMLElement) {
            let link = <HTMLAnchorElement>x.querySelector('a.s-item__link')
            let soldDate = new Date((<HTMLElement>x.querySelector('span.POSITIVE')).innerText.replace("Sold ", ""))
            return new LotLink(parseInt(link.href.match(/https:\/\/[^\/]+\/itm\/(\d+)/)[1]), link, soldDate);
        })

    let _ = updateStatusInfinite(client, links);
}

async function updateStatusInfinite(client: Client, links: LotLink[]) {
    let ids = links.map(function (x) {
        return x.id
    })
    // noinspection InfiniteLoopJS
    while (true) {
        try {
            console.log("UpdatingLotStates")
            let getLotStatesAnswer = await client.getLotStates(ids)

            let knownLots = new Map(getLotStatesAnswer.map(p => [p.lotId, p]));

            links.forEach(function (x) {

                let color = x.color;

                if (knownLots.has(x.id)) {
                    let lotState = knownLots.get(x.id)
                    if (!lotState.ignoreThatLot) {
                        let diffInDays = Math.ceil((x.soldDate.getTime() - new Date(lotState.lastUpdate).getTime()) / (1000 * 60 * 60 * 24));
                        if (diffInDays > 0) {
                            x.color = '#e0e07f'
                        } else {
                            x.color = 'lightgreen'
                        }
                        console.log(diffInDays)
                    } else {
                        x.color = 'lightgreen'
                    }
                } else {
                    x.color = 'lightpink'
                }

                if (x.color !== null && color !== x.color) {
                    x.link.style.cssText = `background-color: ${x.color};`
                }
            })
        } catch (error) {
            console.log(error.stack)
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

async function sleepElementLoaded(selector: string): Promise<Element> {
    let retry = 0
    while (true) {
        retry++;
        if (retry > 1000) throw new Error("unable to find element by selector " + selector)

        let element = document.querySelector(selector)
        if (element !== null) return element
        await sleep(100);
    }
}

function sleep(ms: number): Promise<number> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function saveCodeVerifier() {
    let codeVerifier = (await chrome.storage.local.get(["code_verifier"]))?.code_verifier;

    if (codeVerifier === null || codeVerifier === undefined) {
        let codeVerifier = await generateCodeVerifier();
        await chrome.storage.local.set({code_verifier: codeVerifier})
    }
}

export async function run() {
    await sleepElementLoaded('footer')
    await saveCodeVerifier();

    let oAuth2Client = new OAuth2Client({
        server: backendUrl,
        clientId: 'Ebay.ChromeExtension',
        tokenEndpoint: '/connect/token',
        authorizationEndpoint: '/connect/authorize',
        fetch: fetchResource
    });

    let currentPage = location.protocol + '//' + location.host + location.pathname

    if (currentPage === authRedirectUrl) {
        await authPage(oAuth2Client);
    } else {
        let client = new Client(baseApiUrl, getAuthorizeFetch(oAuth2Client));

        if (currentPage.startsWith("https://www.ebay.com/itm/")) {
            await productPage(client);
        } else if (currentPage.startsWith("https://www.ebay.com/sch/")) {
            await searchPage(client);
        }
    }
}


run();