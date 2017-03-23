import 'zone.js/dist/zone'
import 'reflect-metadata'

import * as $ from 'jquery'
import 'swiper'

import { enableProdMode, ErrorHandler } from '@angular/core'
import { platformBrowserDynamic }              from '@angular/platform-browser-dynamic'

import { BrowserAppModuleNgFactory }    from './app/_platform/app.browser.module.ngfactory'

declare var preboot: any;

enableProdMode();

platformBrowserDynamic()
  .bootstrapModuleFactory(BrowserAppModuleNgFactory)
  .then(() => {
    preboot.complete();
  });
