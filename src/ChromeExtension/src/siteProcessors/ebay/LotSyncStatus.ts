// Статус синхронизации лота eBay с сохранённым у нас (openspec/specs/ebay-lot-registration).
// Модуль не зависит от сгенерированного клиента и DOM, чтобы его можно было тестировать (tests/).

export interface ComparableSale {
    date: string;
    price?: number | null;
}

export interface ComparableLot {
    name?: string | null;
    lotSize?: number | null;
    shippingCountry?: string | null;
    currency?: string | null;
    price?: number | null;
    shipping?: number | null;
    shippingAdditional?: number | null;
    condition?: string | null;
    conditionDescription?: string | null;
    locatedIn?: string | null;
    titleChangeDate?: string | null;
    purchaseHistory?: readonly ComparableSale[] | null;
}

export type LotSyncStatus = 'notStored' | 'listingDiffers' | 'newSales' | 'inSync';

// Поля, которые задаёт eBay и которые влияют на предложение. Количество в лоте, категории, описания
// и продавец сюда не входят: их задаёт оператор или eBay меняет их без изменения предложения.
const ComparedFields = [
    'name',
    'lotSize',
    'shippingCountry',
    'currency',
    'price',
    'shipping',
    'shippingAdditional',
    'condition',
    'conditionDescription',
    'locatedIn',
] as const;

function isMissing(value: unknown): boolean {
    return value === null || value === undefined;
}

function areSameValues(stored: unknown, page: unknown): boolean {
    if (isMissing(stored) || isMissing(page)) return isMissing(stored) && isMissing(page);
    return stored === page;
}

function areSameMoments(stored: string | null | undefined, page: string | null | undefined): boolean {
    if (isMissing(stored) || isMissing(page)) return isMissing(stored) && isMissing(page);
    return Date.parse(stored) === Date.parse(page);
}

// Дата последней продажи с ценой: продажи без цены (special offer и т. п.) не учитываются.
function getLatestPricedSaleTime(sales: readonly ComparableSale[] | null | undefined): number | undefined {
    let latest: number | undefined = undefined;
    for (const sale of sales ?? []) {
        if (isMissing(sale.price)) continue;
        const time = Date.parse(sale.date);
        if (latest === undefined || time > latest) latest = time;
    }
    return latest;
}

export function isSameListing(stored: ComparableLot, page: ComparableLot): boolean {
    return ComparedFields.every(field => areSameValues(stored[field], page[field]))
        && areSameMoments(stored.titleChangeDate, page.titleChangeDate);
}

export function getLotSyncStatus(stored: ComparableLot | undefined, page: ComparableLot): LotSyncStatus {
    if (stored === undefined) return 'notStored';
    if (!isSameListing(stored, page)) return 'listingDiffers';

    const pageLatestSale = getLatestPricedSaleTime(page.purchaseHistory);
    if (pageLatestSale === undefined || pageLatestSale === getLatestPricedSaleTime(stored.purchaseHistory)) {
        return 'inSync';
    }
    return 'newSales';
}
