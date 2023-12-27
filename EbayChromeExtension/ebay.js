const panelClass = "panel-div";
const idFieldName = "id";
const nameFieldName = "name";
const pcsFieldName = "pcs";
const priceFieldName = "price";
const shippingFieldName = "shipping";
const shippingAdditionalFieldName = "shippingAdditional";
const descriptionFieldName = "description";
const conditionFieldName = "condition";
const sellerFieldName = "seller";
const purchaseHistoryFieldName = "purchaseHistory";

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

function createHistoryButton() {
  const itemId = location.pathname.match(/\/itm\/([0-9]+)/)[1];
  const domain = location.hostname;
  const historyButton = document.createElement('a');
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

function createPanel() {
  let div = document.createElement('div');
  div.classList.add(panelClass);
  div.style.cssText = `
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
    `;
  div.innerHTML = `
<form action="">
  <label for="${idFieldName}">Id:</label>
  <input id="${idFieldName}" type="number" name="${idFieldName}" readonly/>
  <br>
  <label for="${nameFieldName}">Name:</label>
  <input id="${nameFieldName}" type="text" name="${nameFieldName}" />
  <br>
  <label for="${pcsFieldName}">PCS:</label>
  <input id="${pcsFieldName}" type="text" name="${pcsFieldName}" />
  <br>
  <label for="${priceFieldName}">Price US$:</label>
  <input id="${priceFieldName}" type="text" name="${priceFieldName}" />
  <br>
  <label for="${shippingFieldName}">Shipping to Germany:</label>
  <input id="${shippingFieldName}" type="number" name="${shippingFieldName}" />
  <br>
  <label for="${shippingAdditionalFieldName}">Shipping each additional:</label>
  <input id="${shippingAdditionalFieldName}" type="number" name="${shippingAdditionalFieldName}" />
  <br>
  <label for="${conditionFieldName}">Condition:</label>
  <input id="${conditionFieldName}" type="text" name="${conditionFieldName}" />
  <br>
  <label for="${descriptionFieldName}">Description:</label>
  <input id="${descriptionFieldName}" type="text" name="${descriptionFieldName}" />
  <br>
  <label for="${purchaseHistoryFieldName}">PurchaseHistory:</label>
  <input id="${purchaseHistoryFieldName}" type="text" name="${purchaseHistoryFieldName}" />
  <br>
  <label for="${sellerFieldName}">Seller:</label>
  <input id="${sellerFieldName}" type="text" name="${sellerFieldName}" />
  <br>
  <input type="submit" value="Save" />
</form>`;
  return div;
}

async function fillPanelWithData() {
  let panel = document.querySelector('div.' + panelClass)

  let idField = panel.querySelector('input#' + idFieldName)
  let itemId = location.pathname.match(/\/itm\/([0-9]+)/)[1];
  idField.value = itemId;

  let priceField = panel.querySelector('input#' + priceFieldName)
  priceField.value = document.querySelector('div.x-price-primary span').innerText
      .match(/\d+(?:[,.]\d+)?/)[0].replace(',', '.')

  let nameField = panel.querySelector('input#' + nameFieldName)
  nameField.value = document.querySelector('.vim h1').innerText
  
  let conditionField = panel.querySelector('input#' + conditionFieldName)
  conditionField.value = document.querySelector('div.x-item-condition-text').innerText

  let sellerField = panel.querySelector('input#' + sellerFieldName)
  sellerField.value = document.querySelector('div.x-sellercard-atf__info__about-seller a').innerText

  let deliveryColumns = [...document.querySelector('div.d-shipping-maxview tbody')
      .querySelector('tr')
      .querySelectorAll('td')]

  let shippingField = panel.querySelector('input#' + shippingFieldName)
  shippingField.value = deliveryColumns[0].querySelector('span').innerText
      .match(/\d+(?:[,.]\d+)?/)[0]
      .replace(',', '.')

  let hippingAdditionalField = panel.querySelector('input#' + shippingAdditionalFieldName)
  hippingAdditionalField.value = deliveryColumns[1].querySelector('span').innerText
      .match(/\d+(?:[,.]\d+)?/)[0]
      .replace(',', '.')
  
  // далее ассинхронные запросы
  
  let descriptionField = panel.querySelector('input#' + descriptionFieldName)
  let descriptionUrl = document.querySelector('#desc_ifr').src
  descriptionField.value = await (await fetchResource(descriptionUrl, null)).text()

  let purchaseHistoryField = panel.querySelector('input#' + purchaseHistoryFieldName)
  let domain = location.hostname;
  let purchaseHistoryUrl = `https://${domain}/bin/purchaseHistory?item=${itemId}`;
  purchaseHistoryField.value = await (await fetchResource(purchaseHistoryUrl, null)).text()
}



function addPanel() {
  let bodyElement = document.querySelector('body');
  if (bodyElement) {
    let existingPanel = bodyElement.querySelector('div.'+panelClass );
    if (!existingPanel) {
      let panel = createPanel();
      bodyElement.appendChild(panel);
    }
  }
}

async function run() {
    addHistoryButton();
    addPanel();
    await fillPanelWithData();
}

run();

chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
  await run();
});