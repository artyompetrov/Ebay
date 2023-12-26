const panelClass = "panel-div";
const idFieldName = "id";
const nameFieldName = "name";
const pcsFieldName = "pcs";
const priceFieldName = "price";
const shippingFieldName = "shipping";
const shippingAdditionalFieldName = "shippingAdditional";
const descriptionFieldName = "description";
const conditionFieldName = "condition";

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
  <label for="${shippingFieldName}">Shipping to Germany:</label>
  <input id="${shippingFieldName}" type="number" name="${shippingFieldName}" />
  <br>
  <label for="${conditionFieldName}">Condition:</label>
  <input id="${conditionFieldName}" type="text" name="${conditionFieldName}" />
  <br>
  <label for="${descriptionFieldName}">Description:</label>
  <input id="${descriptionFieldName}" type="text" name="${descriptionFieldName}" />
  <br>
  <input type="submit" value="Save" />
</form>`;
  return div;
}

function fillPanelWithData() {
  let panel = document.querySelector('div.' + panelClass)
  
  let idField = panel.querySelector('input#' + idFieldName)
  idField.value = location.pathname.match(/\/itm\/([0-9]+)/)[1];

  let priceField = panel.querySelector('input#' + priceFieldName)
  priceField.value = document.querySelector('div.x-price-primary span').innerText
      .match(/\d+(?:[,.]\d+)?/)[0].replace(',','.')

  let nameField = panel.querySelector('input#' + nameFieldName)
  nameField.value = document.querySelector('.vim h1').innerText

  let descriptionField = panel.querySelector('input#' + descriptionFieldName)
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

function run() {
  addHistoryButton();
  addPanel();
  fillPanelWithData();
}

run();

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  run();
});