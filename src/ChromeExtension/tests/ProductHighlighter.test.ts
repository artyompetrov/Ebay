import { test } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { ProductHighlighter, HighlightClasses, ProductIdsAttribute, buildHighlightStyles } from '../src/siteProcessors/searchSites/ProductHighlighter.ts';
import type { HighlightProduct, IdleBudget } from '../src/siteProcessors/searchSites/ProductHighlighter.ts';

const UnlimitedBudget: IdleBudget = { timeRemaining: () => 50 };

interface ProductFlags {
    isInteresting?: boolean;
    isCheckRequired?: boolean;
}

// Считает запуски шаблонов товаров, чтобы проверять, сколько работы сделано в каждом периоде простоя.
class PatternCounter {
    tests = 0;

    product(id: string, source: string, flags: ProductFlags = {}): HighlightProduct {
        const regex = new RegExp(source, 'ig');
        const originalTest = regex.test.bind(regex);
        regex.test = (text: string): boolean => {
            this.tests++;
            return originalTest(text);
        };

        return { id, regex, isInteresting: flags.isInteresting ?? false, isCheckRequired: flags.isCheckRequired ?? true };
    }

    // Период простоя, который кончается после заданного числа запусков шаблонов.
    budgetFor(patternRuns: number): IdleBudget {
        const limit = this.tests + patternRuns;
        return { timeRemaining: () => this.tests < limit ? 1 : 0 };
    }
}

class ManualIdleScheduler {
    private _callbacks: Array<(budget: IdleBudget) => void> = [];

    get pendingRequests(): number {
        return this._callbacks.length;
    }

    request = (callback: (budget: IdleBudget) => void): void => {
        this._callbacks.push(callback);
    };

    runIdlePeriod(budget: IdleBudget): void {
        for (const callback of this._callbacks.splice(0)) {
            callback(budget);
        }
    }

    runUntilIdle(): void {
        while (this._callbacks.length > 0) {
            this.runIdlePeriod(UnlimitedBudget);
        }
    }

    // Возвращает, сколько раз проверялся остаток времени простоя: проверка идёт перед каждым элементом
    // и каждым шаблоном, так что это мера сделанной работы, которую кэш текстов не прячет.
    runUntilIdleCountingBudgetChecks(): number {
        let checks = 0;
        const budget: IdleBudget = {
            timeRemaining: () => {
                checks++;
                return 50;
            },
        };
        while (this._callbacks.length > 0) {
            this.runIdlePeriod(budget);
        }
        return checks;
    }
}

interface Page {
    document: Document;
    scheduler: ManualIdleScheduler;
}

function startHighlighting(bodyHtml: string, products: readonly HighlightProduct[], ignoredSelector: string | null = null): Page {
    const document = new JSDOM(`<!doctype html><body>${bodyHtml}</body>`).window.document;
    const scheduler = new ManualIdleScheduler();
    new ProductHighlighter(document.body, products, scheduler.request, ignoredSelector).start();
    return { document, scheduler };
}

function element(document: Document, id: string): HTMLElement {
    const found = document.getElementById(id);
    if (!found) throw new Error(`Element #${id} not found`);
    return found;
}

function highlightClasses(target: Element): string[] {
    return Object.values(HighlightClasses).filter(className => target.classList.contains(className));
}

// Даёт MutationObserver доставить записи об изменениях.
function flushMutations(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 0));
}

// [OpenSpecScenario("search-site-highlighting", "Text mentioning a known product is highlighted", "Text mentions an interesting product")]
test('text matching an interesting and a checked product gets the green highlight', () => {
    const counter = new PatternCounter();
    const { document, scheduler } = startHighlighting('<p id="lot">Лампы 6N2P и 6N1P</p>', [
        counter.product('interesting', '6n2p', { isInteresting: true }),
        counter.product('checked', '6n1p', { isCheckRequired: false }),
    ]);

    scheduler.runUntilIdle();

    const lot = element(document, 'lot');
    assert.deepEqual(highlightClasses(lot), [HighlightClasses.interesting]);
    assert.equal(lot.getAttribute(ProductIdsAttribute), 'checked,interesting');
});

// [OpenSpecScenario("search-site-highlighting", "Text mentioning a known product is highlighted", "Text mentions only a checked product")]
test('text matching only a checked product gets the yellow highlight', () => {
    const counter = new PatternCounter();
    const { document, scheduler } = startHighlighting('<p id="lot">Лампа 6N1P</p>', [
        counter.product('checked', '6n1p', { isCheckRequired: false }),
        counter.product('known', '6n2p'),
    ]);

    scheduler.runUntilIdle();

    assert.deepEqual(highlightClasses(element(document, 'lot')), [HighlightClasses.checked]);
});

// [OpenSpecScenario("search-site-highlighting", "Text mentioning a known product is highlighted", "Text mentions only a product that requires a check")]
test('text matching only a product that requires a check gets the grey highlight', () => {
    const counter = new PatternCounter();
    const { document, scheduler } = startHighlighting('<p id="lot">Лампа 6N2P</p>', [
        counter.product('known', '6n2p'),
    ]);

    scheduler.runUntilIdle();

    assert.deepEqual(highlightClasses(element(document, 'lot')), [HighlightClasses.known]);
});

// [OpenSpecScenario("search-site-highlighting", "Text mentioning a known product is highlighted", "Text mentions no known product")]
test('text matching no product gets no highlight', () => {
    const counter = new PatternCounter();
    const { document, scheduler } = startHighlighting('<p id="lot">Продам диван</p>', [
        counter.product('known', '6n2p'),
    ]);

    scheduler.runUntilIdle();

    const lot = element(document, 'lot');
    assert.deepEqual(highlightClasses(lot), []);
    assert.equal(lot.hasAttribute(ProductIdsAttribute), false);
});

// [OpenSpecScenario("search-site-highlighting", "Highlighting does not change text layout", "Highlighted element keeps its font")]
test('highlight styles of a highlighted element set only the background colour', () => {
    const counter = new PatternCounter();
    const { document, scheduler } = startHighlighting('<p id="lot">6N2P</p>', [
        counter.product('known', '6n2p'),
    ]);
    const style = document.createElement('style');
    style.textContent = buildHighlightStyles({ known: 'lightgray', checked: 'yellow', interesting: 'green' });
    document.head.appendChild(style);

    scheduler.runUntilIdle();

    const lot = element(document, 'lot');
    const appliedRules = Array.from((style.sheet as CSSStyleSheet).cssRules)
        .map(rule => rule as CSSStyleRule)
        .filter(rule => lot.matches(rule.selectorText));
    assert.equal(appliedRules.length, 1);
    assert.deepEqual(Array.from(appliedRules[0].style), ['background-color']);
});

// [OpenSpecScenario("search-site-highlighting", "Only page text is matched", "Product name inside a script")]
test('product names inside scripts and styles are not matched', () => {
    const counter = new PatternCounter();
    const { document, scheduler } = startHighlighting(
        '<script id="script">const lamp = "6N2P";</script><style id="style">/* 6N2P */</style>',
        [counter.product('known', '6n2p')]);

    scheduler.runUntilIdle();

    assert.equal(document.querySelectorAll(`[${ProductIdsAttribute}]`).length, 0);
    assert.equal(counter.tests, 0);
});

// [OpenSpecScenario("search-site-highlighting", "Only page text is matched", "Product name typed into a text area")]
test('product name inside a text area is not highlighted', () => {
    const counter = new PatternCounter();
    const { document, scheduler } = startHighlighting('<textarea id="input">6N2P</textarea>', [
        counter.product('known', '6n2p'),
    ]);

    scheduler.runUntilIdle();

    assert.deepEqual(highlightClasses(element(document, 'input')), []);
    assert.equal(counter.tests, 0);
});

// [OpenSpecScenario("search-site-highlighting", "Highlighting work runs only while the browser is idle", "Idle period ends in the middle of the page")]
test('matching stops when the idle period ends and the rest of the page is highlighted in later periods', () => {
    const counter = new PatternCounter();
    const { document, scheduler } = startHighlighting('<p id="first">6N2P</p><p id="second">6N2P!</p><p id="third">6N2P?</p>', [
        counter.product('known', '6n2p'),
        counter.product('other', '6n1p'),
    ]);

    scheduler.runIdlePeriod(counter.budgetFor(2));

    assert.equal(counter.tests, 2);
    assert.deepEqual(highlightClasses(element(document, 'first')), [HighlightClasses.known]);
    assert.deepEqual(highlightClasses(element(document, 'second')), []);
    assert.equal(scheduler.pendingRequests, 1);

    scheduler.runUntilIdle();

    assert.equal(counter.tests, 6);
    assert.deepEqual(highlightClasses(element(document, 'second')), [HighlightClasses.known]);
    assert.deepEqual(highlightClasses(element(document, 'third')), [HighlightClasses.known]);
});

// [OpenSpecScenario("search-site-highlighting", "Highlighting work runs only while the browser is idle", "Idle period ends in the middle of one text")]
test('checking one text continues with the remaining patterns in the next idle period', () => {
    const counter = new PatternCounter();
    const { document, scheduler } = startHighlighting('<p id="lot">6N2P</p>', [
        counter.product('a', '6n1p'),
        counter.product('b', '6n3p'),
        counter.product('c', '6n2p'),
        counter.product('d', '6n9p'),
    ]);

    scheduler.runIdlePeriod(counter.budgetFor(2));

    assert.equal(counter.tests, 2);
    assert.deepEqual(highlightClasses(element(document, 'lot')), []);

    scheduler.runUntilIdle();

    assert.equal(counter.tests, 4);
    assert.equal(element(document, 'lot').getAttribute(ProductIdsAttribute), 'c');
});

// [OpenSpecScenario("search-site-highlighting", "Highlighting work runs only while the browser is idle", "No idle period is granted")]
test('no pattern runs until the browser grants an idle period', () => {
    const counter = new PatternCounter();
    const { document, scheduler } = startHighlighting('<p id="lot">6N2P</p>', [
        counter.product('known', '6n2p'),
    ]);

    assert.equal(scheduler.pendingRequests, 1);
    assert.equal(counter.tests, 0);
    assert.deepEqual(highlightClasses(element(document, 'lot')), []);
});

// [OpenSpecScenario("search-site-highlighting", "Only changed content is processed again", "Page does not change after the first pass")]
test('an unchanged page requests no further idle periods', async () => {
    const counter = new PatternCounter();
    const { scheduler } = startHighlighting('<p>6N2P</p><p>Диван</p>', [
        counter.product('known', '6n2p'),
    ]);
    scheduler.runUntilIdle();
    const testsAfterFirstPass = counter.tests;

    await flushMutations();

    assert.equal(scheduler.pendingRequests, 0);
    assert.equal(counter.tests, testsAfterFirstPass);
});

// [OpenSpecScenario("search-site-highlighting", "Only changed content is processed again", "Content is added to the page")]
test('added content is highlighted without processing the rest of the page again', async () => {
    const counter = new PatternCounter();
    const products = [counter.product('known', '6n2p'), counter.product('checked', '6n1p', { isCheckRequired: false })];
    const processedParagraphs = 30;
    const { document, scheduler } = startHighlighting(
        Array.from({ length: processedParagraphs }, (_, index) => `<p>Лампа 6N2P №${index}</p>`).join(''),
        products);
    scheduler.runUntilIdle();
    const testsAfterFirstPass = counter.tests;

    const added = document.createElement('div');
    added.innerHTML = '<span id="added">Лампа 6N1P</span>';
    document.body.appendChild(added);
    await flushMutations();
    const budgetChecks = scheduler.runUntilIdleCountingBudgetChecks();

    assert.deepEqual(highlightClasses(element(document, 'added')), [HighlightClasses.checked]);
    assert.equal(counter.tests - testsAfterFirstPass, products.length);
    // Повторный обход страницы проверял бы бюджет хотя бы раз на каждый из уже обработанных абзацев.
    assert.ok(budgetChecks < processedParagraphs, `${budgetChecks} budget checks after adding one element`);
});

test('removing the element where the paused walk stopped does not cut the rest of the page', async () => {
    const counter = new PatternCounter();
    const { document, scheduler } = startHighlighting(
        '<div id="wrap"><p id="first">6N2P</p></div><p id="second">6N2P!</p><p id="third">6N2P?</p>',
        [counter.product('known', '6n2p')]);

    scheduler.runIdlePeriod(counter.budgetFor(1));
    element(document, 'wrap').remove();
    await flushMutations();
    scheduler.runUntilIdle();

    assert.deepEqual(highlightClasses(element(document, 'second')), [HighlightClasses.known]);
    assert.deepEqual(highlightClasses(element(document, 'third')), [HighlightClasses.known]);
});

test('content removed from the page in the middle of the pass is not matched', async () => {
    const counter = new PatternCounter();
    const { document, scheduler } = startHighlighting(
        `<main id="old">${Array.from({ length: 5 }, (_, index) => `<p>6N2P x${index}</p>`).join('')}</main>`,
        [counter.product('known', '6n2p')]);

    scheduler.runIdlePeriod(counter.budgetFor(1));
    element(document, 'old').remove();
    await flushMutations();
    scheduler.runUntilIdle();

    assert.equal(counter.tests, 1);
});

test('changes of ignored elements such as our tooltip request no work', async () => {
    const counter = new PatternCounter();
    const { document, scheduler } = startHighlighting('<p>6N2P</p>', [counter.product('known', '6n2p')], '#tooltip');
    scheduler.runUntilIdle();

    const tooltip = document.createElement('div');
    tooltip.id = 'tooltip';
    tooltip.innerHTML = '<span>Лампа 6N2P</span>';
    document.body.appendChild(tooltip);
    await flushMutations();
    tooltip.replaceChildren(document.createTextNode('Лампа 6N1P'));
    await flushMutations();

    assert.equal(scheduler.pendingRequests, 0);
});

// [OpenSpecScenario("search-site-highlighting", "Only changed content is processed again", "Text stops mentioning a product")]
test('highlight is removed when the text no longer mentions a product', async () => {
    const counter = new PatternCounter();
    const { document, scheduler } = startHighlighting('<p id="lot">6N2P</p>', [
        counter.product('known', '6n2p'),
    ]);
    scheduler.runUntilIdle();

    const lot = element(document, 'lot');
    (lot.firstChild as Text).data = 'Продано';
    await flushMutations();
    scheduler.runUntilIdle();

    assert.deepEqual(highlightClasses(lot), []);
    assert.equal(lot.hasAttribute(ProductIdsAttribute), false);
});

// [OpenSpecScenario("search-site-highlighting", "Only changed content is processed again", "Same text appears again")]
test('repeated text is highlighted from the cache without running patterns', async () => {
    const counter = new PatternCounter();
    const { document, scheduler } = startHighlighting('<p>Лампа 6N2P</p>', [
        counter.product('known', '6n2p'),
    ]);
    scheduler.runUntilIdle();
    const testsAfterFirstPass = counter.tests;

    const repeated = document.createElement('p');
    repeated.id = 'repeated';
    repeated.textContent = 'Лампа 6N2P';
    document.body.appendChild(repeated);
    await flushMutations();
    scheduler.runUntilIdle();

    assert.deepEqual(highlightClasses(repeated), [HighlightClasses.known]);
    assert.equal(counter.tests, testsAfterFirstPass);
});
