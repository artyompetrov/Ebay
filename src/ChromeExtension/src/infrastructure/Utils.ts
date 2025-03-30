import * as constants from "../constants";

export function getMax(array: number[]) {
    let largest = 0;
    for (let i = 0; i < array.length; i++) {
        if (array[i] > largest) {
            largest = array[i];
        }
    }
    return largest;
}


// Функция для ожидания загрузки элемента
export async function sleepElementLoaded(selector: string, elementToSearchIn: Document | Element): Promise<Element> {
    let retry = 0;
    while (true) {
        retry++;
        if (retry > 200) throw new Error("unable to find element by selector " + selector);

        let element = elementToSearchIn.querySelector(selector);
        if (element !== null) return element;
        await sleep(100);
    }
}

// Функция для паузы выполнения кода
export function sleep(ms: number): Promise<number> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

interface CachedData<T> {
    value: T;
    expirationTime: number;
}

export function getCachedDataOrFallback<T>(
    key: string,
    fallbackLogic: () => Promise<T>,
    ttlInSeconds: number
): Promise<T | null> {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(key, async (result) => {
            const data: CachedData<T> | undefined = result[key];

            if (data && Date.now() <= data.expirationTime) {
                // Если данные валидны
                console.log(`${key} loaded from cache.`);
                resolve(data.value);
            } else {
                // Данные отсутствуют или устарели
                console.log(`${key} not in cache or expired. Fetching new data...`);
                try {
                    const newData = await fallbackLogic(); // Выполняем fallback логику
                    const expirationTime = Date.now() + ttlInSeconds * 1000;

                    // Сохраняем новые данные в кэш
                    const cachedData: CachedData<T> = { value: newData, expirationTime };
                    chrome.storage.local.set({ [key]: cachedData }, () => {
                        console.log(`${key} cached for ${ttlInSeconds} seconds.`);
                    });

                    resolve(newData); // Возвращаем данные из fallback логики
                } catch (error) {
                    console.error(`Failed to fetch data for ${key}:`, error);
                    reject(error);
                }
            }
        });
    });
}

export function removeFromCache(key: string){
    chrome.storage.local.remove(key, () => {} );
}

export function redirectWithoutReferer(url: string) {
    window.open(url, '_self', 'noopener,noreferrer');
}


// Вспомогательная функция для проверки соответствия регулярному выражению
export function matchesAnyRegex(regexSet: RegExp[], value: string): boolean {
    return regexSet.some((regex) => regex.test(value));
}

export async function fetchResource(input: RequestInfo, init: RequestInit): Promise<Response> {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ input, init }, async messageResponse => {
            try {
                const [response, error] = messageResponse;
                let logEntry = "Request: " + JSON.stringify(input);
                if (constants.Settings.extendedLogging) {
                    logEntry += "\n\nRequest body: \n" + JSON.stringify(init);
                }
                if (response === null) {
                    logEntry += "\n\nNo response"
                    console.log(logEntry);
                    reject(error);
                } else {
                    logEntry += "\n\nResponse " + response.status + " " + response.statusText;

                    if (constants.Settings.extendedLogging) {
                        logEntry += "\n\nResponse headers:\n" + JSON.stringify(response.headers);
                    }

                    let body = new Blob([response.body]);


                    if (constants.Settings.extendedLogging) {
                        logEntry += "\n\nResponse body:\n";
                        try {
                            const loggedBody = await new Response(body).text();
                            logEntry += loggedBody;
                        } catch (logError) {
                            logEntry += "Failed to log response body: " + logError;
                        }
                    }

                    console.log(logEntry);
                    resolve(new Response(body, {
                        headers: new Headers(response.headers),
                        status: response.status,
                        statusText: response.statusText
                    }));
                }
            } catch (error) {
                console.log("An error occurred while processing the response:", error);
                reject(error);
            }
        });
    });
}