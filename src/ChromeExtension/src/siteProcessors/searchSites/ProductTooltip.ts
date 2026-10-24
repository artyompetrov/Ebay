// Подсказка с ценами товаров при наведении на подсветку. Один делегированный обработчик на документ
// и одна переиспользуемая подсказка, чтобы наведения не добавляли обработчиков и элементов на страницу;
// движение мыши отслеживается только пока подсказка открыта. Модуль зависит только от DOM (tests/),
// поэтому атрибут со списком товаров подсветки передаётся снаружи, а не импортируется.

export interface TooltipProduct {
    id: string;
    name: string;
    searchNames: readonly string[];
    // null - для товара ещё нет расчёта цены.
    averagePriceRub: number | null;
    quantityTotal: number;
    isCheckRequired: boolean;
    isWeightMissing: boolean;
    highlightClass: string;
}

export const TooltipElementId = 'product-price-tooltip';

const TooltipWidth = 300;
const CursorPadding = 10;
const FallbackTooltipHeight = 200;
const CloseDistance = 300;
const ElementNodeType = 1;

interface Point {
    x: number;
    y: number;
}

export class ProductTooltip {
    private readonly _document: Document;
    private readonly _productIdsAttribute: string;
    private readonly _findProduct: (id: string) => TooltipProduct | undefined;
    private readonly _getProductUrl: (id: string) => string;
    private _tooltip: HTMLDivElement | null = null;
    private _content: HTMLDivElement | null = null;
    private _hoveredElement: Element | null = null;
    private _isTrackingMouse = false;
    private _isFrameRequested = false;
    private _lastMousePosition: Point = { x: 0, y: 0 };

    constructor(
        document: Document,
        productIdsAttribute: string,
        findProduct: (id: string) => TooltipProduct | undefined,
        getProductUrl: (id: string) => string) {
        this._document = document;
        this._productIdsAttribute = productIdsAttribute;
        this._findProduct = findProduct;
        this._getProductUrl = getProductUrl;
    }

    public start(): void {
        this._document.addEventListener('mouseover', this.onMouseOver);
    }

    private readonly onMouseOver = (event: MouseEvent): void => {
        const target = event.target as Node | null;
        if (!target || target.nodeType !== ElementNodeType || this._tooltip?.contains(target)) return;

        const highlighted = (target as Element).closest(`[${this._productIdsAttribute}]`);
        if (highlighted === this._hoveredElement) return;

        this._hoveredElement = highlighted;
        const ids = highlighted?.getAttribute(this._productIdsAttribute);
        if (ids) {
            this.show(ids.split(','), event);
        }
    };

    private readonly onMouseMove = (event: MouseEvent): void => {
        this._lastMousePosition = { x: event.clientX, y: event.clientY };
        if (this._isFrameRequested) return;

        this._isFrameRequested = true;
        this._document.defaultView?.requestAnimationFrame(this.closeIfCursorIsFar);
    };

    // Раскладку читаем не чаще раза за кадр, а не на каждое событие mousemove.
    private readonly closeIfCursorIsFar = (): void => {
        this._isFrameRequested = false;
        if (!this._tooltip || !this._isTrackingMouse) return;

        const rect = this._tooltip.getBoundingClientRect();
        const distance = Math.hypot(
            this._lastMousePosition.x - (rect.left + rect.width / 2),
            this._lastMousePosition.y - (rect.top + rect.height / 2));
        if (distance > CloseDistance) {
            this.hide();
        }
    };

    private show(ids: readonly string[], event: MouseEvent): void {
        const products = ids
            .map(id => this._findProduct(id))
            .filter((product): product is TooltipProduct => product !== undefined)
            .sort((a, b) => (b.averagePriceRub ?? 0) - (a.averagePriceRub ?? 0));
        if (products.length === 0) return;

        const { tooltip, content } = this.ensureTooltip();
        const productElements: Node[] = [];
        for (const product of products) {
            if (productElements.length > 0) {
                productElements.push(this.createSeparator());
            }
            productElements.push(this.createProductElement(product));
        }
        content.replaceChildren(...productElements);

        this.position(tooltip, event);
        tooltip.style.display = 'block';

        this._lastMousePosition = { x: event.clientX, y: event.clientY };
        if (!this._isTrackingMouse) {
            this._isTrackingMouse = true;
            this._document.addEventListener('mousemove', this.onMouseMove);
        }
    }

    private hide(): void {
        if (this._tooltip) {
            this._tooltip.style.display = 'none';
        }
        if (this._isTrackingMouse) {
            this._isTrackingMouse = false;
            this._document.removeEventListener('mousemove', this.onMouseMove);
        }
    }

    // Подсказка создаётся один раз; если сайт убрал её из DOM, возвращаем ту же.
    private ensureTooltip(): { tooltip: HTMLDivElement, content: HTMLDivElement } {
        if (!this._tooltip || !this._content) {
            const tooltip = this._document.createElement('div');
            tooltip.id = TooltipElementId;
            tooltip.style.cssText = `
        position: absolute;
        background-color: white;
        border: 2px solid #0000cc;
        border-radius: 5px;
        box-shadow: 0 2px 12px rgba(0,0,0,0.3);
        z-index: 9999;
        display: none;
        font-size: 14px;
        color: #000;
        max-width: ${TooltipWidth}px;
        max-height: 30vh;
        overflow-y: auto;
        overflow-x: hidden;
        line-height: 1.5;
    `;

            const closeButton = this._document.createElement('div');
            closeButton.textContent = '✕';
            closeButton.style.cssText = `
        position: sticky;
        top: 0;
        right: 5px;
        float: right;
        cursor: pointer;
        font-weight: bold;
        padding: 3px;
        margin-left: 5px;
        z-index: 10000;
    `;
            // После закрытия крестиком подсказка снова откроется, когда курсор вернётся на ту же подсветку.
            closeButton.addEventListener('click', () => {
                this._hoveredElement = null;
                this.hide();
            });

            const content = this._document.createElement('div');
            tooltip.append(closeButton, content);
            // Клики по подсказке (ссылки на товары, крестик) не должны доходить до обработчиков сайта.
            tooltip.addEventListener('click', event => event.stopPropagation());
            this._tooltip = tooltip;
            this._content = content;
        }

        if (!this._tooltip.isConnected) {
            this._document.body.appendChild(this._tooltip);
        }

        return { tooltip: this._tooltip, content: this._content };
    }

    private createSeparator(): HTMLHRElement {
        const separator = this._document.createElement('hr');
        separator.style.cssText = 'margin: 0; border: 0; border-top: 1px solid #ddd;';
        return separator;
    }

    private createProductElement(product: TooltipProduct): HTMLDivElement {
        const document = this._document;

        const link = document.createElement('a');
        link.href = this._getProductUrl(product.id);
        link.target = '_blank';
        link.title = product.searchNames.join(', ');
        link.textContent = product.name;
        link.style.cssText = 'color: #0000aa; text-decoration: none; border-bottom: 1px dotted #0000aa;';

        const header = document.createElement('strong');
        header.style.cssText = 'font-size: 16px; color: #0000aa;';
        header.appendChild(link);

        const details = document.createElement('div');
        details.style.marginTop = '8px';
        if (product.averagePriceRub === null) {
            details.append('Нет данных о средней цене');
        } else if (product.quantityTotal > 0) {
            details.append(
                this.createLabeledLine('Средняя цена:', `${product.averagePriceRub.toFixed(0)} RUB`),
                this.createLabeledLine('Всего продано:', `${product.quantityTotal} шт.`));
        } else {
            details.append('Нет данных о продажах');
        }
        if (product.isCheckRequired) {
            details.appendChild(this.createWarningLine('Требуется проверка'));
        }
        if (product.isWeightMissing) {
            details.appendChild(this.createWarningLine('Вес не указан'));
        }

        const element = document.createElement('div');
        element.className = product.highlightClass;
        element.style.cssText = 'position: relative; padding: 10px;';
        element.append(header, document.createElement('br'), details);
        return element;
    }

    private createLabeledLine(label: string, value: string): HTMLDivElement {
        const line = this._document.createElement('div');
        const labelElement = this._document.createElement('strong');
        labelElement.textContent = label;
        line.append(labelElement, ` ${value}`);
        return line;
    }

    private createWarningLine(text: string): HTMLDivElement {
        const line = this._document.createElement('div');
        line.style.color = 'red';
        line.textContent = text;
        return line;
    }

    // Справа и снизу от курсора, а если не помещается - слева или сверху.
    private position(tooltip: HTMLElement, event: MouseEvent): void {
        const window = this._document.defaultView;
        if (!window) return;

        if (event.clientX + TooltipWidth + CursorPadding <= window.innerWidth) {
            tooltip.style.left = `${event.clientX + CursorPadding}px`;
        } else {
            tooltip.style.left = `${Math.max(0, event.clientX - TooltipWidth - CursorPadding)}px`;
        }

        const tooltipHeight = tooltip.offsetHeight || FallbackTooltipHeight;
        if (event.clientY + tooltipHeight + CursorPadding <= window.innerHeight) {
            tooltip.style.top = `${event.clientY + window.scrollY + CursorPadding}px`;
        } else {
            tooltip.style.top = `${Math.max(0, event.clientY + window.scrollY - tooltipHeight - CursorPadding)}px`;
        }
    }
}
