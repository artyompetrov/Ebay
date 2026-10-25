import { test } from 'node:test';
import assert from 'node:assert/strict';
import { classifySoldResults, selectLotsToOpen } from '../src/siteProcessors/ebay/SoldSearchResults.ts';
import type { SoldResult } from '../src/siteProcessors/ebay/SoldSearchResults.ts';

const ShownCount = 10;
const BatchSize = 5;
// Время регистрации 2026-10-20 15:00 по местному времени: дата продажи из выдачи eBay тоже разбирается в местном.
const RegisteredAt = new Date(2026, 9, 20, 15, 0, 0).toISOString();

function soldOn(lotId: number, soldText: string): SoldResult {
    return { lotId, soldDate: new Date(soldText) };
}

function results(count: number): SoldResult[] {
    return Array.from({ length: count }, (_, index) => soldOn(index + 1, 'Oct 21, 2026'));
}

// [OpenSpecScenario("ebay-lot-registration", "Sold search results show which lots need registering", "Lot is ignored")]
test('ignored lot is grey', () => {
    const [result] = classifySoldResults([soldOn(1, 'Oct 21, 2026')], new Map([[1, RegisteredAt]]), new Set([1]), ShownCount);

    assert.equal(result.status, 'ignored');
});

// [OpenSpecScenario("ebay-lot-registration", "Sold search results show which lots need registering", "Lot is not stored")]
test('lot that is not stored is pink', () => {
    const [result] = classifySoldResults([soldOn(1, 'Oct 21, 2026')], new Map(), new Set(), ShownCount);

    assert.equal(result.status, 'notStored');
});

// [OpenSpecScenario("ebay-lot-registration", "Sold search results show which lots need registering", "Lot sold after it was registered")]
test('lot sold on a day after its registration is yellow', () => {
    const [result] = classifySoldResults([soldOn(1, 'Oct 21, 2026')], new Map([[1, RegisteredAt]]), new Set(), ShownCount);

    assert.equal(result.status, 'soldAfterRegistration');
});

// [OpenSpecScenario("ebay-lot-registration", "Sold search results show which lots need registering", "Lot registered on the day it sold")]
test('lot registered on the day it sold is green', () => {
    const [result] = classifySoldResults([soldOn(1, 'Oct 20, 2026')], new Map([[1, RegisteredAt]]), new Set(), ShownCount);

    assert.equal(result.status, 'registered');
});

// [OpenSpecScenario("ebay-lot-registration", "Sold search results show which lots need registering", "More than ten results need attention")]
test('only the first ten results that are not ignored are shown', () => {
    const classified = classifySoldResults(results(12), new Map(), new Set(), ShownCount);

    assert.deepEqual(classified.filter(x => x.shown).map(x => x.lotId), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
});

// [OpenSpecScenario("ebay-lot-registration", "Lots needing registration open in batches", "Several lots need registration")]
test('the first five shown lots needing registration are opened', () => {
    const lastUpdates = new Map([[1, RegisteredAt], [2, RegisteredAt], [3, RegisteredAt], [4, RegisteredAt]]);
    const classified = classifySoldResults(results(7), lastUpdates, new Set(), ShownCount);

    assert.deepEqual(selectLotsToOpen(classified, BatchSize), [1, 2, 3, 4, 5]);
});

// [OpenSpecScenario("ebay-lot-registration", "Lots needing registration open in batches", "Nothing needs registration")]
test('no lot is opened when every shown result is registered', () => {
    const classified = classifySoldResults([soldOn(1, 'Oct 20, 2026'), soldOn(2, 'Oct 19, 2026')], new Map([[1, RegisteredAt], [2, RegisteredAt]]), new Set(), ShownCount);

    assert.deepEqual(selectLotsToOpen(classified, BatchSize), []);
});
