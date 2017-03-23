import { NgModule } from '@angular/core';

import { HelpComponent } from './help.component';
import { FaqComponent } from './faq/faq.component';
import { SupportComponent } from './support/support.component';
import { HelpRoutingModule } from './help-routing.module';

@NgModule({
  imports: [
    HelpRoutingModule
  ],
  declarations: [
    HelpComponent,
    FaqComponent,
    SupportComponent
  ]
})
export class HelpModule {}
