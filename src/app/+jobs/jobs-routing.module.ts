import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { JobsComponent } from './jobs.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'jobs', component: JobsComponent }
    ])
  ]
})
export class JobsRoutingModule {}
