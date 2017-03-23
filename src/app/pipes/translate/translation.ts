import { OpaqueToken } from '@angular/core';

// import translations
import { LANG_CS_NAME, LANG_CS_TRANS } from './lang-cs';
import { LANG_DE_NAME, LANG_DE_TRANS } from './lang-de';

// translation token
export const TRANSLATIONS = new OpaqueToken('translations');

// all translations, EXIST SERVER SIDE TRANSLATE !!!
/*export const dictionary = {
  [LANG_CS_NAME]: LANG_CS_TRANS,
  [LANG_DE_NAME]: LANG_DE_TRANS,
};*/

// providers
export const TRANSLATION_PROVIDERS = [
  { provide: TRANSLATIONS, useValue: {CZ: {}} },
];
