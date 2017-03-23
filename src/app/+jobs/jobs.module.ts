import { NgModule } from '@angular/core';

import { JobsComponent } from './jobs.component';
import { JobsRoutingModule } from './jobs-routing.module';

@NgModule({
  imports: [
    JobsRoutingModule
  ],
  declarations: [
    JobsComponent
  ]
})
export class JobsModule {}
