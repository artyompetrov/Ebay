import { ISiteProcessor } from './ISiteProcessor';

export function tryGetAvitoSavedSearchesProcessor() : ISiteProcessor | null {
    let currentPage = location.protocol + '//' + location.host + location.pathname

    if (currentPage === "https://www.avito.ru/autosearch") {

        return new AvitoSavedSearchesPageProcessor();
    }
    return null;
}

class AvitoSavedSearchesPageProcessor implements ISiteProcessor {
    breakAfterSearchProcessor: boolean = true;

    async run(): Promise<void> {
       alert("test")
    }
}