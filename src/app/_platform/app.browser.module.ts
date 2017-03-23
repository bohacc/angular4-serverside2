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
