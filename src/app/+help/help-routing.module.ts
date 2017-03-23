import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HelpComponent } from './help.component';
import { FaqComponent } from './faq/faq.component';
import { SupportComponent } from './support/support.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'help', component: HelpComponent },
      { path: 'help/faq', component: FaqComponent },
      { path: 'help/support', component: SupportComponent }
    ])
  ]
})
export class HelpRoutingModule {}
