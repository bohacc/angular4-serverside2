import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ExploreComponent } from './explore.component';
import { FeaturedComponent } from './featured/featured.component';
import { PopularComponent } from './popular/popular.component';
import { CategoriesComponent } from './categories/categories.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'explore', component: ExploreComponent },
      { path: 'explore/featured', component: FeaturedComponent },
      { path: 'explore/popular', component: PopularComponent },
      { path: 'explore/categories', component: CategoriesComponent }
    ])
  ]
})
export class ExploreRoutingModule {}
