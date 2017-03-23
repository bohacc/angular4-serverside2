import { NgModule } from '@angular/core';

import { HighlightsComponent } from './highlights.component';
import { HighlightsRoutingModule } from './highlights-routing.module';

@NgModule({
  imports: [
    HighlightsRoutingModule
  ],
  declarations: [
    HighlightsComponent
  ]
})
export class HighlightsModule {}
