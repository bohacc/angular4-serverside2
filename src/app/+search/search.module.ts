import { NgModule } from '@angular/core';

import { SearchComponent } from './search.component';
import { SearchRoutingModule } from './search-routing.module';

@NgModule({
  imports: [
    SearchRoutingModule
  ],
  declarations: [
    SearchComponent
  ]
})
export class SearchModule {}
