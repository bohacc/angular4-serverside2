import { NgModule } from '@angular/core';

import { SingleTeamComponent } from './single/single-team.component';
import { TeamDashboardComponent } from './single/dashboard/team-dashboard.component';
import { TeamRoutingModule } from './team-routing.module';

@NgModule({
  imports: [
    TeamRoutingModule
  ],
  declarations: [
    SingleTeamComponent,
    TeamDashboardComponent
  ]
})
export class TeamModule {}
