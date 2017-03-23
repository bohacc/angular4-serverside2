import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SingleUserComponent } from './single/single-user.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'user/:slug', component: SingleUserComponent }
    ])
  ]
})
export class UserRoutingModule {}
