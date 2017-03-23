import { NgModule }          from '@angular/core'
import { RouterModule }      from '@angular/router'

import { DiscoverComponent } from '../'


@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'discover', component: DiscoverComponent }
    ])
  ]
})
export class DiscoverRoutingModule {}
