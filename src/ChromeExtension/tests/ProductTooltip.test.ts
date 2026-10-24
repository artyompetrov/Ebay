import { test } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { ProductTooltip, TooltipElementId } from '../src/siteProcessors/searchSites/ProductTooltip.ts';
import type { TooltipProduct } from '../src/siteProcessors/searchSites/ProductTooltip.ts';
import { ProductIdsAttribute } from '../src/siteProcessors/searchSites/ProductHighlighter.ts';

const ProductUrlBase = 'https://example.com/Product/';

interface Page {
    window: JSDOM['window'];
    document: Document;
    listeners: ListenerRegistry;
}

// Учитывает обработчики, которые сейчас зарегистрированы на странице.
class ListenerRegistry {
    private readonly _active = new Set<string>();
    private readonly _ids = new WeakMap<object, number>();
    private _nextId = 0;

    constructor(window: JSDOM['window']) {
        const prototype = window.EventTarget.prototype;
        const originalAdd = prototype.addEventListener;
        const originalRemove = prototype.removeEventListener;
        const registry = this;
        prototype.addEventListener = function (type: string, listener: object, options?: unknown) {
            registry._active.add(registry.key(this, type, listener));
            return originalAdd.call(this, type, listener, options);
        };
        prototype.removeEventListener = function (type: string, listener: object, options?: unknown) {
            registry._active.delete(registry.key(this, type, listener));
            return originalRemove.call(this, type, listener, options);
        };
    }

    get count(): number {
        return this._active.size;
    }

    countOfType(type: string): number {
        return Array.from(this._active).filter(key => key.endsWith(`:${type}`)).length;
    }

    private key(target: object, type: string, listener: object): string {
        return `${this.id(target)}:${this.id(listener)}:${type}`;
    }

    private id(value: object): number {
        let id = this._ids.get(value);
        if (id === undefined) {
            id = this._nextId++;
            this._ids.set(value, id);
        }
        return id;
    }
}

function product(id: string, averagePriceRub: number | null): TooltipProduct {
    return {
        id,
        name: `Product ${id}`,
        searchNames: [`Product ${id}`],
        averagePriceRub,
        quantityTotal: 5,
        isCheckRequired: false,
        isWeightMissing: false,
        highlightClass: 'highlightChecked',
    };
}

function startTooltip(bodyHtml: string, products: readonly TooltipProduct[]): Page {
    const { window } = new JSDOM(`<!doctype html><body>${bodyHtml}</body>`, { pretendToBeVisual: true });
    const listeners = new ListenerRegistry(window);
    const productsById = new Map(products.map(item => [item.id, item]));
    new ProductTooltip(window.document, ProductIdsAttribute, id => productsById.get(id), id => `${ProductUrlBase}${id}`).start();
    return { window, document: window.document, listeners };
}

function hover(page: Page, target: Element): void {
    target.dispatchEvent(new page.window.MouseEvent('mouseover', { bubbles: true, clientX: 0, clientY: 0 }));
}

function moveMouse(page: Page, clientX: number, clientY: number): void {
    page.document.dispatchEvent(new page.window.MouseEvent('mousemove', { bubbles: true, clientX, clientY }));
}

function nextFrame(page: Page): Promise<void> {
    return new Promise(resolve => page.window.requestAnimationFrame(() => resolve()));
}

function tooltip(page: Page): HTMLElement {
    const found = page.document.getElementById(TooltipElementId);
    if (!found) throw new Error('Tooltip not found');
    return found;
}

function highlighted(id: string, productIds: string): string {
    return `<span id="${id}" ${ProductIdsAttribute}="${productIds}">lamp ${id}</span>`;
}

// [OpenSpecScenario("search-site-highlighting", "Hovering a highlight shows the matched products", "Element mentions two products")]
test('tooltip lists the matched products from the highest average price', () => {
    const page = startTooltip(highlighted('lot', 'a,b'), [product('a', 100), product('b', 300)]);

    hover(page, page.document.getElementById('lot') as Element);

    const shown = tooltip(page);
    assert.equal(shown.style.display, 'block');
    const links = Array.from(shown.querySelectorAll('a')).map(link => ({ text: link.textContent, href: link.href }));
    assert.deepEqual(links, [
        { text: 'Product b', href: `${ProductUrlBase}b` },
        { text: 'Product a', href: `${ProductUrlBase}a` },
    ]);
});

// [OpenSpecScenario("search-site-highlighting", "Hovering a highlight shows the matched products", "Cursor moves away")]
test('tooltip closes when the cursor moves more than 300 px from its centre', async () => {
    const page = startTooltip(highlighted('lot', 'a'), [product('a', 100)]);
    hover(page, page.document.getElementById('lot') as Element);

    // jsdom кладёт центр подсказки в (0, 0).
    moveMouse(page, 200, 200);
    await nextFrame(page);
    assert.equal(tooltip(page).style.display, 'block');

    moveMouse(page, 301, 0);
    await nextFrame(page);
    assert.equal(tooltip(page).style.display, 'none');
});

// [OpenSpecScenario("search-site-highlighting", "Hovering does not accumulate work", "Many highlights are hovered")]
test('hovering many highlights keeps one tooltip and the same handlers', () => {
    const ids = Array.from({ length: 50 }, (_, index) => `lot${index}`);
    const page = startTooltip(ids.map(id => highlighted(id, 'a')).join(''), [product('a', 100)]);

    hover(page, page.document.getElementById(ids[0]) as Element);
    const listenersAfterFirstHover = page.listeners.count;
    for (const id of ids.slice(1)) {
        hover(page, page.document.getElementById(id) as Element);
    }

    assert.equal(page.document.querySelectorAll(`#${TooltipElementId}`).length, 1);
    assert.equal(page.listeners.count, listenersAfterFirstHover);
});

// [OpenSpecScenario("search-site-highlighting", "Hovering does not accumulate work", "Tooltip is closed")]
test('closing the tooltip removes the mouse movement handler', () => {
    const page = startTooltip(highlighted('lot', 'a'), [product('a', 100)]);
    hover(page, page.document.getElementById('lot') as Element);
    assert.equal(page.listeners.countOfType('mousemove'), 1);

    const closeButton = tooltip(page).firstElementChild as HTMLElement;
    closeButton.click();

    assert.equal(tooltip(page).style.display, 'none');
    assert.equal(page.listeners.countOfType('mousemove'), 0);
});

test('tooltip closed with the close button opens again when the cursor returns to the same highlight', () => {
    const page = startTooltip(highlighted('lot', 'a'), [product('a', 100)]);
    const lot = page.document.getElementById('lot') as Element;
    hover(page, lot);
    (tooltip(page).firstElementChild as HTMLElement).click();

    hover(page, tooltip(page));
    hover(page, lot);

    assert.equal(tooltip(page).style.display, 'block');
});

test('clicks inside the tooltip do not reach the page handlers', () => {
    const page = startTooltip(highlighted('lot', 'a'), [product('a', 100)]);
    hover(page, page.document.getElementById('lot') as Element);
    let pageClicks = 0;
    page.document.addEventListener('click', () => pageClicks++);

    const link = tooltip(page).querySelector('a') as HTMLAnchorElement;
    link.addEventListener('click', event => event.preventDefault());
    link.click();

    assert.equal(pageClicks, 0);
});
