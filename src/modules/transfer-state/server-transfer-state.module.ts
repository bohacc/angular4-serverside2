import { NgModule }                           from '@angular/core'
import { TransferState, ServerTransferState } from './'

@NgModule({
  providers: [
    { provide: TransferState, useClass: ServerTransferState }
  ]
})
export class ServerTransferStateModule {}
