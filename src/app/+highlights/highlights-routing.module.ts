import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HighlightsComponent } from './highlights.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'highlights', component: HighlightsComponent }
    ])
  ]
})
export class HighlightsRoutingModule {}
