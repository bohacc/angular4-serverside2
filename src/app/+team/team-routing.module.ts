import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SingleTeamComponent } from './single/single-team.component';
import { TeamDashboardComponent } from './single/dashboard/team-dashboard.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'team/:slug', component: SingleTeamComponent },
      { path: 'team/:slug/dashboard', component: TeamDashboardComponent }
    ])
  ]
})
export class TeamRoutingModule {}
