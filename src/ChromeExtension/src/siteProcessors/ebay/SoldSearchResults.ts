// Какие лоты на странице поиска проданных товаров eBay нужно зарегистрировать (openspec/specs/ebay-lot-registration).
// Модуль не зависит от сгенерированного клиента и DOM, чтобы его можно было тестировать (tests/).

export type SoldResultStatus = 'ignored' | 'notStored' | 'soldAfterRegistration' | 'registered';

export interface SoldResult {
    lotId: number;
    soldDate: Date;
}

export interface ClassifiedSoldResult {
    lotId: number;
    status: SoldResultStatus;
    // Подсвечивать ли результат: подсвечиваются только первые результаты, требующие внимания.
    shown: boolean;
}

const MillisecondsPerDay = 1000 * 60 * 60 * 24;

function getStatus(result: SoldResult, lastUpdates: ReadonlyMap<number, string>, ignoredLotIds: ReadonlySet<number>): SoldResultStatus {
    if (ignoredLotIds.has(result.lotId)) return 'ignored';

    const lastUpdate = lastUpdates.get(result.lotId);
    if (lastUpdate === undefined) return 'notStored';

    const diffInDays = Math.ceil((result.soldDate.getTime() - new Date(lastUpdate).getTime()) / MillisecondsPerDay);
    return diffInDays > 0 ? 'soldAfterRegistration' : 'registered';
}

// lastUpdates - время последней регистрации сохранённых лотов; shownCount - сколько неигнорируемых
// результатов подсвечивать (игнорируемые среди них тоже подсвечиваются).
export function classifySoldResults(
    results: readonly SoldResult[],
    lastUpdates: ReadonlyMap<number, string>,
    ignoredLotIds: ReadonlySet<number>,
    shownCount: number,
): ClassifiedSoldResult[] {
    let notIgnoredCount = 0;
    return results.map(result => {
        const status = getStatus(result, lastUpdates, ignoredLotIds);
        if (status !== 'ignored') notIgnoredCount++;
        return { lotId: result.lotId, status, shown: notIgnoredCount <= shownCount };
    });
}

export function selectLotsToOpen(results: readonly ClassifiedSoldResult[], batchSize: number): number[] {
    return results
        .filter(x => x.shown && (x.status === 'soldAfterRegistration' || x.status === 'notStored'))
        .map(x => x.lotId)
        .slice(0, batchSize);
}
