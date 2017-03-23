import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TermsComponent } from './terms.component';
import { UseComponent } from './use/use.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { CookiesComponent } from './cookies/cookies.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'terms', component: TermsComponent },
      { path: 'terms/use', component: UseComponent },
      { path: 'terms/privacy', component: PrivacyComponent },
      { path: 'terms/cookies', component: CookiesComponent }
    ])
  ]
})
export class TermsRoutingModule {}
