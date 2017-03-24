import '../shared/lib/rxjs-operators'

import {NgModule, ErrorHandler, LOCALE_ID}           from '@angular/core'
import { BrowserModule }                   from '@angular/platform-browser'

import { ApolloModule }                    from 'apollo-angular'
import { provideBrowserClient }            from './'

import { StoreModule }                     from '@ngrx/store'
import { AllReducers }                     from '../shared'

import { CookieService }                   from 'angular2-cookie/services/cookies.service'

import { BrowserTransferStateModule }      from '../../modules/transfer-state';
import { CommonAppModule }                 from './'
import { AppComponent }                    from '../'
import { AuthService, BrowserAuthService } from '../auth'

import * as Raven from 'raven-js'

import {FormsModule} from "@angular/forms";
import {ShopCategoriesObj} from "../shop-categories-obj/shop-categories-obj.component";
import {ListObj} from "../list-obj/list-obj.component";
import {ShopCategoriesDevObj} from "../shop-categories-dev-obj/shop-categories-dev-obj.component";
import {ShopCategoriesObjAt} from "../shop-categories-obj-at/shop-categories-obj-at.component";
import {List3Obj} from "../list3-obj/list3-obj.component";
import {List4Obj} from "../list4-obj/list4-obj.component";
import {CartPage} from "../cart-page/cart-page.component";
import {OrderStep1} from "../order-step1/order-step1.component";
import {OrderStep3} from "../order-step3/order-step3.component";
import {OrderStep4} from "../order-step4/order-step4.component";
import {OrderStep2} from "../order-step2/order-step2.component";
import {RegistrationPage} from "../registration-page/registration-page.component";
import {SearchResultList} from "../search-result-list/search-result-list.component";
import {RegistrationSuccess} from "../registration-success/registration-success.component";
import {SlidesComponent} from "../slides/slides.component";
import {ProductsHomepage} from "../products-homepage/products-homepage.component";
import {PageHeader} from "../page-header/page-header.component";
import {RedirectNavigation} from "../redirect-navigation/redirect-navigation.component";
import {List2} from "../list2/list2.component";
import {List} from "../list/list.component";
import {LoginPage} from "../login-page/login-page.component";
import {Partners} from "../partners/partners.component";
import {SlidesObj} from "../slides-obj/slides-obj.component";
import {Test} from "../test/test.component";
import {Configurator} from "../configurator/configurator.component";
import {ListSimple} from "../list-simple/list-simple.component";
import {PageHeaderAt} from "../page-header-at/page-header-at.component";
import {LoginNewsletter} from "../login-newsletter/login-newsletter.component";
import {List5Obj} from "../list5-obj/list5-obj.component";
import {LostPassword} from "../lost-password/lost-password.component";

export function getBrowserLRU(lru?: any) {
  return lru || new Map();
}

export function cookieServiceFactory(): CookieService {
  return new CookieService();
}

Raven
  .config('https://e090d88b54a342fba41842bf5a5f9d83@sentry.io/142633', {
    // MD5 hash of working project version (e.g. v.1.0.0)
    // Live productions should be prefixed with "LIVE:" (e.g. LIVE:2888cd...)
    release: '2888cd106bd98b888fca74c785bd6cf5'
  })
  .install();

export class RavenErrorHandler implements ErrorHandler {
  handleError(err: any) : void {
    Raven.captureException(err.originalError || err);
  }
}


@NgModule({
	bootstrap: [ AppComponent ],
	imports: [
    BrowserModule.withServerTransition({ appId: 'root-app' }),
    BrowserTransferStateModule,
    ApolloModule.withClient(provideBrowserClient),
    StoreModule.provideStore(AllReducers),
    CommonAppModule,
    //FormsModule
	],
  /*entryComponents: [
    Test,
    PageHeader,
    SlidesObj,
    Partners,
    PageHeader,
    LoginPage,
    RedirectNavigation,
    List,
    List2,
    Configurator,
    Record,
    ShopCategoriesObj,
    ShopCategoriesObjAt,
    ShopCategoriesDevObj,
    ListObj,
    List3Obj,
    List4Obj,
    SlidesComponent,
    CartPage,
    OrderStep1,
    OrderStep2,
    OrderStep3,
    OrderStep4,
    RegistrationSuccess,
    RegistrationPage,
    SearchResultList,
    ProductsHomepage,
    ListSimple,
    PageHeaderAt,
    LoginNewsletter,
    List5Obj,
    LostPassword
  ],*/
  providers: [
    { provide: 'LRU', useFactory: getBrowserLRU, deps: [] },
    { provide: 'isBrowser', useValue: true },
    { provide: 'isServer', useValue: false },
    { provide: AuthService, useClass: BrowserAuthService },
    { provide: ErrorHandler, useClass: RavenErrorHandler },
    { provide: CookieService, useFactory: cookieServiceFactory },
  ]
})
export class BrowserAppModule {}
