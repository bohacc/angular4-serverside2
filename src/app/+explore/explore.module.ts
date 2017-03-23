import { NgModule } from '@angular/core';

import { ExploreComponent } from './explore.component';
import { FeaturedComponent } from './featured/featured.component';
import { PopularComponent } from './popular/popular.component';
import { CategoriesComponent } from './categories/categories.component';
import { ExploreRoutingModule } from './explore-routing.module';

@NgModule({
  imports: [
    ExploreRoutingModule
  ],
  declarations: [
    ExploreComponent,
    FeaturedComponent,
    PopularComponent,
    CategoriesComponent
  ]
})
export class ExploreModule {}
