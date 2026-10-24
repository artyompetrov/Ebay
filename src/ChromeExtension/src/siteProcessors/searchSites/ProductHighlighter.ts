// Подсветка известных товаров в тексте сторонних сайтов. Работа идёт только в периоды простоя браузера
// и прерывается, как только время простоя кончается, чтобы не мешать коду сайта (скролл, ввод, анимации).
// После первого прохода обрабатывается только то, что изменилось на странице. Модуль зависит только
// от DOM, чтобы его можно было тестировать на jsdom (tests/).

export interface HighlightProduct {
    id: string;
    regex: RegExp;
    isInteresting: boolean;
    isCheckRequired: boolean;
}

export interface IdleBudget {
    timeRemaining(): number;
}

// В продакшене это window.requestIdleCallback без timeout: на странице, которая не простаивает,
// подсветка откладывается, а не отнимает время у сайта.
export type IdleScheduler = (callback: (budget: IdleBudget) => void) => void;

export interface HighlightColors {
    known: string;
    checked: string;
    interesting: string;
}

export const HighlightClasses = {
    known: 'highlightKnown',
    checked: 'highlightChecked',
    interesting: 'highlightInteresting',
} as const;

export const ProductIdsAttribute = 'data-product-ids';

// Текст, который не показывается как текст страницы или редактируется пользователем, не проверяем.
const IgnoredSelector = 'script, style, noscript, textarea, input, [contenteditable]:not([contenteditable="false"])';
// Ограничивает память кэша на бесконечных лентах; кэш живёт, пока открыта страница.
const MaxCachedTexts = 10_000;
const ElementNodeType = 1;
const TextNodeType = 3;
const ShowElement = 0x1;
const FilterAccept = 1;
const FilterReject = 2;

// Подсветка только фоном: изменение фона - это перерисовка без пересчёта раскладки текста.
export function buildHighlightStyles(colors: HighlightColors): string {
    return `
.${HighlightClasses.known} { background-color: ${colors.known}; }
.${HighlightClasses.checked} { background-color: ${colors.checked}; }
.${HighlightClasses.interesting} { background-color: ${colors.interesting}; }
`;
}

export function getProductHighlightClass(product: Pick<HighlightProduct, 'isInteresting' | 'isCheckRequired'>): string {
    if (product.isInteresting) return HighlightClasses.interesting;
    if (!product.isCheckRequired) return HighlightClasses.checked;
    return HighlightClasses.known;
}

// Элемент, у которого проверяются собственные текстовые узлы; позиция сохраняется между периодами простоя.
interface ElementJob {
    element: Element;
    texts: string[];
    textIndex: number;
    productIndex: number;
    textMatches: string[];
    matchedIds: Set<string>;
}

export class ProductHighlighter {
    private readonly _root: Element;
    private readonly _products: readonly HighlightProduct[];
    private readonly _productsById: ReadonlyMap<string, HighlightProduct>;
    private readonly _requestIdle: IdleScheduler;
    private readonly _ignoredSelector: string;
    private readonly _matchesByText = new Map<string, readonly string[]>();
    // Элементы, у которых изменился собственный текст.
    private readonly _pendingElements = new Set<Element>();
    // Добавленные поддеревья, которые нужно обойти целиком.
    private readonly _pendingSubtrees = new Set<Element>();
    private _walker: TreeWalker | null = null;
    private _job: ElementJob | null = null;
    private _isScheduled = false;

    constructor(root: Element, products: readonly HighlightProduct[], requestIdle: IdleScheduler, ignoredSelector: string | null = null) {
        this._root = root;
        this._products = products;
        this._productsById = new Map(products.map(product => [product.id, product]));
        this._requestIdle = requestIdle;
        this._ignoredSelector = ignoredSelector ? `${IgnoredSelector}, ${ignoredSelector}` : IgnoredSelector;
    }

    public start(): void {
        const window = this._root.ownerDocument.defaultView;
        if (window) {
            new window.MutationObserver(records => this.onMutations(records))
                .observe(this._root, { childList: true, subtree: true, characterData: true });
        }

        this._pendingSubtrees.add(this._root);
        this.schedule();
    }

    // Изменения внутри игнорируемых элементов (скрипты, поля ввода, наша подсказка) и вставка или удаление
    // самих таких элементов не меняют текст страницы, поэтому работы не создают.
    private onMutations(records: readonly MutationRecord[]): void {
        for (const record of records) {
            if (record.type === 'characterData') {
                const parent = record.target.parentElement;
                if (parent && !this.isIgnored(parent)) this._pendingElements.add(parent);
                continue;
            }

            const target = record.target as Element;
            if (target.nodeType !== ElementNodeType || this.isIgnored(target)) continue;

            const changedNodes = [...Array.from(record.addedNodes), ...Array.from(record.removedNodes)]
                .filter(node => node.nodeType !== ElementNodeType || !(node as Element).matches(this._ignoredSelector));
            if (changedNodes.length === 0) continue;

            this._pendingElements.add(target);
            for (const node of Array.from(record.addedNodes)) {
                if (node.nodeType === ElementNodeType) {
                    this._pendingSubtrees.add(node as Element);
                }
            }
        }

        this.schedule();
    }

    private schedule(): void {
        if (this._isScheduled || !this.hasWork()) return;

        this._isScheduled = true;
        this._requestIdle(budget => {
            this._isScheduled = false;
            this.process(budget);
            this.schedule();
        });
    }

    private hasWork(): boolean {
        return this._job !== null || this._walker !== null || this._pendingElements.size > 0 || this._pendingSubtrees.size > 0;
    }

    private process(budget: IdleBudget): void {
        while (budget.timeRemaining() > 0) {
            if (!this._job) {
                const element = this.takeNextElement();
                if (!element) return;
                this._job = this.createJob(element);
            }

            if (!this.advanceJob(this._job, budget)) return;

            this.applyHighlight(this._job.element, this._job.matchedIds);
            this._job = null;
        }
    }

    private takeNextElement(): Element | null {
        while (true) {
            if (this._walker) {
                // Между периодами простоя сайт мог удалить или перенести элемент, на котором остановился обход:
                // от него nextNode() уже не дойдёт до остатка поддерева. Тогда обходим поддерево заново,
                // проверенные тексты возьмутся из кэша.
                if (!this.isWalkerPositionValid(this._walker)) {
                    this._pendingSubtrees.add(this._walker.root as Element);
                    this._walker = null;
                    continue;
                }

                const next = this._walker.nextNode();
                if (next) return next as Element;
                this._walker = null;
            }

            const subtree = takeFirst(this._pendingSubtrees);
            if (subtree) {
                if (!this.isProcessable(subtree)) continue;
                this._walker = this.createWalker(subtree);
                return subtree;
            }

            const element = takeFirst(this._pendingElements);
            if (!element) return null;
            if (this.isProcessable(element)) return element;
        }
    }

    private isProcessable(element: Element): boolean {
        return element.isConnected && this._root.contains(element) && !this.isIgnored(element);
    }

    private isIgnored(element: Element): boolean {
        return element.closest(this._ignoredSelector) !== null;
    }

    private isWalkerPositionValid(walker: TreeWalker): boolean {
        return walker.root.isConnected && walker.root.contains(walker.currentNode);
    }

    private createWalker(subtree: Element): TreeWalker {
        return subtree.ownerDocument.createTreeWalker(subtree, ShowElement, {
            acceptNode: node => (node as Element).matches(this._ignoredSelector) ? FilterReject : FilterAccept,
        });
    }

    private createJob(element: Element): ElementJob {
        const texts = Array.from(element.childNodes)
            .filter(node => node.nodeType === TextNodeType && node.textContent?.trim())
            .map(node => node.textContent as string);
        return { element, texts, textIndex: 0, productIndex: 0, textMatches: [], matchedIds: new Set<string>() };
    }

    // Возвращает false, если время простоя кончилось раньше, чем все тексты элемента проверены.
    private advanceJob(job: ElementJob, budget: IdleBudget): boolean {
        while (job.textIndex < job.texts.length) {
            // Удалённый со страницы элемент не проверяем: подсветка ему уже не нужна.
            if (!job.element.isConnected) return true;

            const text = job.texts[job.textIndex];
            let matches = this._matchesByText.get(text);

            if (!matches) {
                while (job.productIndex < this._products.length) {
                    if (budget.timeRemaining() <= 0) return false;

                    const product = this._products[job.productIndex];
                    product.regex.lastIndex = 0;
                    if (product.regex.test(text)) {
                        job.textMatches.push(product.id);
                    }
                    job.productIndex++;
                }

                matches = job.textMatches;
                if (this._matchesByText.size >= MaxCachedTexts) {
                    this._matchesByText.clear();
                }
                this._matchesByText.set(text, matches);
            }

            for (const id of matches) {
                job.matchedIds.add(id);
            }
            job.textIndex++;
            job.productIndex = 0;
            job.textMatches = [];
        }

        return true;
    }

    // Пишем в DOM, только если набор товаров элемента изменился.
    // TODO: если сайт перезапишет className, но оставит data-product-ids, класс подсветки не вернётся:
    // атрибуты не наблюдаются (иначе наши же записи будили бы наблюдатель), а набор товаров не изменился.
    // Восстанавливать класс, не реагируя на собственные записи.
    private applyHighlight(element: Element, matchedIds: ReadonlySet<string>): void {
        if (!element.isConnected) return;

        const idsValue = Array.from(matchedIds).sort().join(',');
        const currentValue = element.getAttribute(ProductIdsAttribute) ?? '';
        if (idsValue === currentValue) return;

        element.classList.remove(HighlightClasses.interesting, HighlightClasses.checked, HighlightClasses.known);
        if (matchedIds.size === 0) {
            element.removeAttribute(ProductIdsAttribute);
            return;
        }

        const products = Array.from(matchedIds, id => this._productsById.get(id) as HighlightProduct);
        element.classList.add(getProductHighlightClass({
            isInteresting: products.some(product => product.isInteresting),
            isCheckRequired: !products.some(product => !product.isCheckRequired),
        }));
        element.setAttribute(ProductIdsAttribute, idsValue);
    }
}

function takeFirst<T>(set: Set<T>): T | null {
    for (const item of set) {
        set.delete(item);
        return item;
    }

    return null;
}
