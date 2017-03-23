import { NgModule }                                                             from '@angular/core'
import { ReactiveFormsModule }                                                  from '@angular/forms'

import { SharedModule }                                                         from '../../shared'
import { LoginComponent, SignupComponent, AuthModelService, AuthRoutingModule } from '../'


@NgModule({
  imports: [
    ReactiveFormsModule,
    SharedModule,
    AuthRoutingModule
  ],
  declarations: [
    LoginComponent,
    SignupComponent
  ],
  providers: [
    AuthModelService
  ]
})
export class AuthModule {}
