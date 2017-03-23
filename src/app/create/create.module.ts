import { NgModule } from '@angular/core';

import { CreateComponent } from './create.component';
import { CreateRoutingModule } from './create-routing.module';

@NgModule({
  imports: [
    CreateRoutingModule
  ],
  declarations: [
    CreateComponent
  ]
})
export class CreateModule {}
