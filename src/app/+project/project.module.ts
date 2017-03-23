import { NgModule } from '@angular/core';

import { SingleProjectComponent } from './single/single-project.component';
import { ProjectDashboardComponent } from './single/dashboard/project-dashboard.component';
import { ProjectApplicationsComponent } from './single/application/project-applications.component';
import { SingleApplicationComponent } from './single/application/single/single-application.component';
import { ProjectRoutingModule } from './project-routing.module';

@NgModule({
  imports: [
    ProjectRoutingModule
  ],
  declarations: [
    SingleProjectComponent,
    ProjectDashboardComponent,
    ProjectApplicationsComponent,
    SingleApplicationComponent
  ]
})
export class ProjectModule {}
