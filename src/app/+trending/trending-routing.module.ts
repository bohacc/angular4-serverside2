import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TrendingComponent } from './trending.component';
import { TrendingUsersComponent } from './users/trending-users.component';
import { TrendingTeamsComponent } from './teams/trending-teams.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'trending', component: TrendingComponent },
      { path: 'trending/users', component: TrendingUsersComponent },
      { path: 'trending/teams', component: TrendingTeamsComponent }
    ])
  ]
})
export class TrendingRoutingModule {}
