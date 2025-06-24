import * as constants from '../constants';
import { ISiteProcessor } from './ISiteProcessor';
import * as utils from "../infrastructure/Utils";

const regex: RegExp =  /(?:^|\.)?e\.mail\.ru$/i;

export function tryGetMailRuProcessor() : ISiteProcessor | null {
    if (regex.test(location.host)) {

        //return new MailRuSiteProcessor();
    }
    return null;
}

class MailRuSiteProcessor implements ISiteProcessor {
    
    async run() {
        let right = await utils.sleepElementLoaded('div.layout__column_right-indented', document)
        right.remove()
        let top = await utils.sleepElementLoaded('div.letter-list-item-adv', document)
        top.remove()
    }

}
