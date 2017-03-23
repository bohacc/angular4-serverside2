import '../shared/lib/rxjs-operators'

import {LOCALE_ID, NgModule}                                from '@angular/core'
import { ServerModule }                             from '@angular/platform-server'

import { ApolloModule }                             from 'apollo-angular'
import { provideServerClient }                      from './'

import { StoreModule }                     from '@ngrx/store'
import { AllReducers }                     from '../shared'

import { TransferState, ServerTransferStateModule } from '../../modules/transfer-state'
import { CommonAppModule }                          from './'
import { AppComponent }                             from '../'
import { AuthService, ServerAuthService }           from '../auth'
import {FormsModule} from "@angular/forms";

declare var Zone: any

export function getServerLRU(): any {
  return new Map();
}


@NgModule({
  bootstrap: [AppComponent],
  imports: [
    ServerModule,
    ServerTransferStateModule,
    ApolloModule.withClient(provideServerClient),
    StoreModule.provideStore(AllReducers),
    CommonAppModule,
    //FormsModule
  ],
  providers: [
    { provide: 'LRU', useFactory: getServerLRU, deps: [] },
    { provide: 'isBrowser', useValue: false },
    { provide: 'isServer', useValue: true },
    { provide: AuthService, useClass: ServerAuthService },
  ]
})
export class ServerAppModule {

  constructor(
    private _transferState: TransferState
  ) {}

  ngOnBootstrap = () => {
    this._transferState.inject();
  }

}
