let htmlReports = require('./html_reports');
import {Tools} from "./tools";
// import translations
import { LANG_CS_NAME, LANG_CS_TRANS } from '../app/pipes/translate/lang-cs';
import { LANG_DE_NAME, LANG_DE_TRANS } from '../app/pipes/translate/lang-de';

// all translations
const dictionary = {
  [LANG_CS_NAME]: LANG_CS_TRANS,
  [LANG_DE_NAME]: LANG_DE_TRANS,
};

export module Translate {
  export function getLanguageFile(req: any) {
    return dictionary[req.countryVersion];
  }

  export function translateReport (str: string, req: any) {
    let obj = this.getLanguageFile(req);
    return this.prepare(str, obj);
  }

  export function translate (str: string, req: any) {
    let obj = this.getLanguageFile(req);
    let cond = Tools.escapeRegExp(str);
    let regex = new RegExp(cond, 'g');
    return obj[str] !== undefined ? str.replace(regex, String((obj[str] || ''))) : str;
  }

  export function prepare (file, obj, req) {
    var regex, str, key, cond;
    str = String(file);
    for (key in obj) {
      if (obj[key] !== undefined) {
        cond = Tools.escapeRegExp('@@' + key + '@@');
        regex = new RegExp(cond, 'g');
        str = str.replace(regex, String((obj[key] || '')));
      }
    }
    return str;
  };
}
