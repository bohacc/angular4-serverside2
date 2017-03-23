import { NgModule }                 from '@angular/core'
import { RouterModule }             from '@angular/router'

import { CreateComponent }          from './create.component'
import { CanActivateWithAuthGuard } from '../shared'


@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'create', component: CreateComponent, canActivate: [CanActivateWithAuthGuard]  }
    ])
  ]
})
export class CreateRoutingModule {}
