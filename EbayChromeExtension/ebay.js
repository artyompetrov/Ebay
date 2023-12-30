const panelClass = "panel-div";
const idFieldName = "id";
const nameFieldName = "name";
const pcsFieldName = "pcs";
const priceFieldName = "price";
const shippingFieldName = "shipping";
const shippingAdditionalFieldName = "shippingAdditional";
const descriptionFieldName = "description";
const conditionFieldName = "condition";
const conditionDescriptionFieldName = "conditionDescription";
const sellerFieldName = "seller";
const purchaseHistoryFieldName = "purchaseHistory";
const locatedInFieldName = "locatedIn";
const errorElementId = "errorElement"
const submitId = "submit"

function fetchResource(input, init) {
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

    return matches[2].replace(',', '.')
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

function addHistoryButton() {
    let productTitleContainer = document.querySelector('.vim[data-testid="x-item-title"]');
    if (productTitleContainer) {
        let existingButton = productTitleContainer.querySelector('a.history-button');
        if (!existingButton) {
            let historyButton = createHistoryButton();
            productTitleContainer.appendChild(historyButton);
        }
    }
}

function createPanel(bodyElement) {
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
    
    .${panelClass} label:after { content: ": " }
`

    let styleSheet = document.createElement("style")
    styleSheet.innerText = styles
    bodyElement.appendChild(styleSheet)

    let div = document.createElement('div');
    div.classList.add(panelClass);

    // language=HTML
    div.innerHTML = `
        <form action="">
            <label for="${idFieldName}">Id</label>
            <input id="${idFieldName}" type="number" name="${idFieldName}" readonly/>
            <br>
            <label for="${nameFieldName}">Name</label>
            <input id="${nameFieldName}" type="text" name="${nameFieldName}" readonly/>
            <br>
            <label for="${pcsFieldName}">PCS</label>
            <input id="${pcsFieldName}" type="text" name="${pcsFieldName}"/>
            <br>
            <label for="${priceFieldName}">Price US$</label>
            <input id="${priceFieldName}" type="text" name="${priceFieldName}"/>
            <br>
            <label for="${shippingFieldName}">Shipping to Germany</label>
            <input id="${shippingFieldName}" type="number" name="${shippingFieldName}"/>
            <br>
            <label for="${shippingAdditionalFieldName}">Shipping each additional</label>
            <input id="${shippingAdditionalFieldName}" type="number" name="${shippingAdditionalFieldName}"/>
            <br>
            <label for="${conditionFieldName}">Condition</label>
            <input id="${conditionFieldName}" type="text" name="${conditionFieldName}"/>
            <br>
            <label for="${conditionDescriptionFieldName}">Condition description</label>
            <input id="${conditionDescriptionFieldName}" type="text" name="${conditionDescriptionFieldName}"/>
            <br>
            <label for="${descriptionFieldName}">Description</label>
            <input id="${descriptionFieldName}" type="text" name="${descriptionFieldName}" readonly/>
            <br>
            <label for="${purchaseHistoryFieldName}">PurchaseHistory</label>
            <input id="${purchaseHistoryFieldName}" type="text" name="${purchaseHistoryFieldName}" readonly/>
            <br>
            <label for="${sellerFieldName}">Seller</label>
            <input id="${sellerFieldName}" type="text" name="${sellerFieldName}" readonly/>
            <br>
            <label for="${locatedInFieldName}">Located in</label>
            <input id="${locatedInFieldName}" type="text" name="${locatedInFieldName}" readonly/>
            <br>
            <div style="color: red;" id="${errorElementId}"></div>
            <br>
            <input id="${submitId}" type="submit" value="Save" disabled/>
        </form>`;

    bodyElement.appendChild(div);
}

function fillSoldItemsResult(fixedPriceRows, result) {
    for (let fixedPriceRow of fixedPriceRows) {
        let columns = [...fixedPriceRow.querySelectorAll('td')]
            .map(function (item) {
                return item.innerText;
            })

        let price = columns[1]

        if (price === "Expired" || price === "Declined") {
            continue
        }

        let resultItem = {}

        if (price !== "Sold as a special offer" && price !== "Counter-offered" && price !== "Accepted") {
            resultItem['price'] = extractPrice(price)
        }

        resultItem['quantity'] = columns[2]
        resultItem['date'] = parseDate(columns[3])

        result.push(resultItem)
    }
}

function parseDate(dateString) {
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

    return date.toISOString()
}

function parseSoldItemsPage(text) {
    let doc = new DOMParser().parseFromString(text, "text/html")

    let result = []
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

    return JSON.stringify(result);
}

function fillId(panel) {
    let idField = panel.querySelector('input#' + idFieldName)
    idField.value = location.pathname.match(/\/itm\/([0-9]+)/)[1];
}

function fillPrice(panel) {
    let priceField = panel.querySelector('input#' + priceFieldName)
    priceField.value = extractPrice(document.querySelector('div.x-price-primary span').innerText)
}

function fillName(panel) {
    let nameField = panel.querySelector('input#' + nameFieldName)
    nameField.value = document.querySelector('.vim h1').innerText
}

function fillSeller(panel) {
    let sellerField = panel.querySelector('input#' + sellerFieldName)
    sellerField.value = document.querySelector('div.x-sellercard-atf__info__about-seller a').innerText.toLowerCase()
}

function fillCondition(panel) {
    let conditionField = panel.querySelector('input#' + conditionFieldName)
    conditionField.value = document.querySelector('div.x-item-condition-text span.ux-textspans').innerText
}

function fillConditionDescription(panel) {
    let conditionDescriptionElement = document.querySelector('div.x-item-condition-desc')
    if (conditionDescriptionElement != null) {
        let conditionDescriptionField = panel.querySelector('input#' + conditionDescriptionFieldName)
        conditionDescriptionField.value = conditionDescriptionElement.innerText
            .replace('“', '')
            .replace('”', '')
    }
}

function fillShipping(panel) {
    let shippingField = panel.querySelector('input#' + shippingFieldName)
    let shippingAdditionalField = panel.querySelector('input#' + shippingAdditionalFieldName)
    let shippingRatesAvailable = document.querySelector('div.ux-layout-section__textual-display--askSeller') === null
    if (shippingRatesAvailable) {
        let deliveryColumnsHeader = [...document.querySelector('div.d-shipping-maxview thead')
            .querySelectorAll('th')]
        let deliveryColumnsValues = [...document.querySelector('div.d-shipping-maxview tbody')
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
            shippingField.value = extractPrice(shippingValue)

            if (shippingMaxviewValues.hasOwnProperty('Each additional item')) {
                shippingAdditionalField.value = extractPrice(shippingMaxviewValues['Each additional item'])

            } else {
                shippingAdditionalField.value = 0;
            }

        } else {
            shippingField.value = 0;
            shippingAdditionalField.value = 0;
        }
    }
}

function fillDescription(panel) {
    let descriptionUrl = document.querySelector('#desc_ifr').src
    fetchResource(descriptionUrl, {method: 'GET', credentials: 'include'})
        .then((response) => {
            response.text().then((text) => {
                panel.querySelector('input#' + descriptionFieldName).value = text
            }).catch((err) => {
                showError(err);
            })
        })
        .catch((err) => {
            showError(err)
        })
}

function fillPurchaseHistory(panel) {
    let itemId = location.pathname.match(/\/itm\/([0-9]+)/)[1];
    let purchaseHistoryUrl = `https://${location.hostname}/bin/purchaseHistory?item=${itemId}`;
    fetchResource(purchaseHistoryUrl, {method: 'GET', credentials: 'include'})
        .then((response) => {
            response.text().then((text) => {
                panel.querySelector('input#' + purchaseHistoryFieldName).value = parseSoldItemsPage(text)

            }).catch((err) => {
                showError(err);
            })
        })
        .catch((err) => {
            showError(err)
        })
}

function fillPanelWithData() {
    let panel = document.querySelector('div.' + panelClass)

    fillId(panel);
    fillPrice(panel);
    fillName(panel);
    fillSeller(panel);
    fillCondition(panel);
    fillConditionDescription(panel);
    fillShipping(panel);

    //todo добавить извлечение located in
    fillDescription(panel);
    fillPurchaseHistory(panel);
}


function addPanel() {
    let bodyElement = document.querySelector('body');
    if (bodyElement) {
        let existingPanel = bodyElement.querySelector('div.' + panelClass);
        if (!existingPanel) {
            createPanel(bodyElement);
        }
    }
}

function showError(error) {
    let errorDiv = document.querySelector('div.' + panelClass + ' #' + errorElementId)

    let span = document.createElement('span');
    span.innerHTML = error.stack;
    errorDiv.appendChild(span)
}

function enableSubmitButton() {
    document.querySelector('#' + submitId).disabled = false
}

async function run() {

    try {
        addHistoryButton();
        addPanel();
        fillPanelWithData();
        //todo разрешать только если вообще нет ошибок
        enableSubmitButton()
    } catch (error) {
        showError(error);
        throw error;
    }
}

run();

chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    await run();
});