import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getLotSyncStatus, isSameListing } from '../src/siteProcessors/ebay/LotSyncStatus.ts';
import type { ComparableLot } from '../src/siteProcessors/ebay/LotSyncStatus.ts';

// Лот со страницы eBay в том виде, в каком расширение отправляет его на бэкенд (из лога регистрации лота 353399536816).
function pageLot(): ComparableLot & Record<string, unknown> {
    return {
        categories: [{ type: 'condition', value: 'new' }, { type: 'test_state', value: 'notTested' }],
        purchaseHistory: [
            { date: '2026-09-19T22:47:56.000Z', quantity: 3, price: 3, isRecent: true },
            { date: '2026-09-16T01:01:28.000Z', quantity: 2, price: 3, isRecent: true },
            { date: '2026-08-05T18:47:17.000Z', quantity: 5, isRecent: true },
        ],
        lotId: 353399536816,
        price: 3,
        currency: 'USD',
        name: '2P19B Sputnik Transmitter radio tubes New Old Stock',
        seller: 'FsjWFrzyRbS',
        condition: 'New',
        description: "<font rwr='1' size='4' style='font-family:Arial'>New Old Stock USSR</font>",
        locatedIn: 'AL',
        shippingCountry: 'DE',
        shipping: 6,
        shippingAdditional: 2,
        titleChangeDate: '1970-01-01T00:00:00.000Z',
        productId: 'c12a49a0-9578-4cc7-95d7-c7f26125990f',
        pcs: '1',
        autoPcs: '1',
    };
}

// Тот же лот в ответе бэкенда: другой порядок полей, null для пустых значений, additionalProperties.
function storedLot(): ComparableLot & Record<string, unknown> {
    return {
        lotId: 353399536816,
        name: '2P19B Sputnik Transmitter radio tubes New Old Stock',
        pcs: 1,
        lotSize: null,
        shippingCountry: 'DE',
        currency: 'USD',
        price: 3.0,
        shipping: 6.0,
        shippingAdditional: 2.0,
        description: "<font rwr='1' size='4' style='font-family:Arial'>New Old Stock USSR</font>",
        condition: 'New',
        conditionDescription: null,
        shortDescription: null,
        seller: 'FsjWFrzyRbS',
        locatedIn: 'AL',
        categories: [{ type: 'condition', value: 'new', additionalProperties: {} }, { type: 'test_state', value: 'notTested', additionalProperties: {} }],
        titleChangeDate: '1970-01-01T00:00:00.000Z',
        purchaseHistory: [
            { price: 3.0, quantity: 3, date: '2026-09-19T22:47:56.000Z', isRecent: true, additionalProperties: {} },
            { price: 3.0, quantity: 2, date: '2026-09-16T01:01:28.000Z', isRecent: true, additionalProperties: {} },
            { price: null, quantity: 5, date: '2026-08-05T18:47:17.000Z', isRecent: true, additionalProperties: {} },
        ],
        additionalProperties: {},
    };
}

// [OpenSpecScenario("ebay-lot-registration", "Lot page shows whether the stored lot matches eBay", "Lot is not stored")]
test('lot that is not stored is reported as not stored', () => {
    assert.equal(getLotSyncStatus(undefined, pageLot()), 'notStored');
});

// [OpenSpecScenario("ebay-lot-registration", "Lot page shows whether the stored lot matches eBay", "Lot was just registered")]
test('lot just registered is in sync despite nulls, extra keys and key order', () => {
    assert.equal(getLotSyncStatus(storedLot(), pageLot()), 'inSync');
});

// [OpenSpecScenario("ebay-lot-registration", "Lot page shows whether the stored lot matches eBay", "eBay has a newer sale")]
test('newer priced sale on eBay is reported as new sales', () => {
    const page = { ...pageLot(), purchaseHistory: [{ date: '2026-10-20T10:00:00.000Z', price: 3 }] };
    const stored = { ...storedLot(), purchaseHistory: [{ date: '2026-10-01T10:00:00.000Z', price: 3 }] };

    assert.equal(getLotSyncStatus(stored, page), 'newSales');
});

// [OpenSpecScenario("ebay-lot-registration", "Lot page shows whether the stored lot matches eBay", "Stored sales include sales eBay no longer shows")]
test('older stored sales that eBay no longer shows do not matter', () => {
    const page = { ...pageLot(), purchaseHistory: [{ date: '2026-10-20T10:00:00.000Z', price: 3 }] };
    const stored = {
        ...storedLot(),
        purchaseHistory: [
            { date: '2026-10-20T10:00:00.000Z', price: 3 },
            { date: '2024-01-01T10:00:00.000Z', price: null },
        ],
    };

    assert.equal(getLotSyncStatus(stored, page), 'inSync');
});

// [OpenSpecScenario("ebay-lot-registration", "Lot page shows whether the stored lot matches eBay", "Latest stored sale has no price")]
test('newer stored sale without a price does not hide the latest priced sale', () => {
    const page = { ...pageLot(), purchaseHistory: [{ date: '2026-10-20T10:00:00.000Z', price: 3 }] };
    const stored = {
        ...storedLot(),
        purchaseHistory: [
            { date: '2026-10-22T10:00:00.000Z', price: null },
            { date: '2026-10-20T10:00:00.000Z', price: 3 },
        ],
    };

    assert.equal(getLotSyncStatus(stored, page), 'inSync');
});

// [OpenSpecScenario("ebay-lot-registration", "Lot page shows whether the stored lot matches eBay", "eBay shows no sale with a price")]
test('eBay sales without a price never make the lot need new sales', () => {
    const page = { ...pageLot(), purchaseHistory: [{ date: '2026-10-20T10:00:00.000Z' }] };
    const stored = { ...storedLot(), purchaseHistory: [] };

    assert.equal(getLotSyncStatus(stored, page), 'inSync');
});

// [OpenSpecScenario("ebay-lot-registration", "Lot page shows whether the stored lot matches eBay", "Price changed on eBay")]
test('changed price is reported as a different listing', () => {
    assert.equal(getLotSyncStatus(storedLot(), { ...pageLot(), price: 4 }), 'listingDiffers');
});

// [OpenSpecScenario("ebay-lot-registration", "Listing comparison covers eBay-owned fields", "Title change date differs")]
test('later title change on eBay makes the listing different', () => {
    assert.equal(isSameListing(storedLot(), { ...pageLot(), titleChangeDate: '2026-10-01T12:00:00.000Z' }), false);
});

// [OpenSpecScenario("ebay-lot-registration", "Listing comparison covers eBay-owned fields", "Operator-set fields differ")]
test('operator-set fields are not compared', () => {
    const page = {
        ...pageLot(),
        pcs: '4',
        categories: [{ type: 'condition', value: 'used' }],
        description: 'other description',
        shortDescription: 'other short description',
        seller: 'other-seller',
    };

    assert.equal(isSameListing(storedLot(), page), true);
});

// [OpenSpecScenario("ebay-lot-registration", "Listing comparison covers eBay-owned fields", "Missing and null values")]
test('missing values equal null values', () => {
    const stored = storedLot();
    delete stored.lotSize;
    delete stored.conditionDescription;

    assert.equal(isSameListing(stored, { ...pageLot(), lotSize: null, conditionDescription: null }), true);
    assert.equal(isSameListing(stored, { ...pageLot(), lotSize: 2 }), false);
});

// [OpenSpecScenario("ebay-lot-registration", "Listing comparison covers eBay-owned fields", "Same moment written differently")]
test('dates are compared as moments', () => {
    const stored = { ...storedLot(), titleChangeDate: '1970-01-01T00:00:00Z' };

    assert.equal(isSameListing(stored, { ...pageLot(), titleChangeDate: '1970-01-01T00:00:00.000Z' }), true);
});
