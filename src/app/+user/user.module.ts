import { NgModule } from '@angular/core';

import { SingleUserComponent } from './single/single-user.component';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
  imports: [
    UserRoutingModule
  ],
  declarations: [
    SingleUserComponent
  ]
})
export class UserModule {}
