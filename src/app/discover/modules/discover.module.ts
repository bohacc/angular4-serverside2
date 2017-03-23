import { NgModule }                                 from '@angular/core'

import { SharedModule }                             from '../../shared'

import { DiscoverComponent, DiscoverRoutingModule } from '../'


@NgModule({
  imports: [
    SharedModule,
    DiscoverRoutingModule
  ],
  declarations: [
    DiscoverComponent
  ]
})
export class DiscoverModule {}
