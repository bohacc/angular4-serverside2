import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SingleProjectComponent } from './single/single-project.component';
import { ProjectDashboardComponent } from './single/dashboard/project-dashboard.component';
import { ProjectApplicationsComponent } from './single/application/project-applications.component';
import { SingleApplicationComponent } from './single/application/single/single-application.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'project/:slug', component: SingleProjectComponent },
      { path: 'project/:slug/dashboard', component: ProjectDashboardComponent },
      { path: 'project/:slug/dashboard/applications', component: ProjectDashboardComponent },
      { path: 'project/:slug/dashboard/application/:application_id', component: ProjectDashboardComponent }
    ])
  ]
})
export class ProjectRoutingModule {}
