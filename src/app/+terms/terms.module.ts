import { NgModule } from '@angular/core';

import { TermsComponent } from './terms.component';
import { UseComponent } from './use/use.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { CookiesComponent } from './cookies/cookies.component';
import { TermsRoutingModule } from './terms-routing.module';

@NgModule({
  imports: [
    TermsRoutingModule
  ],
  declarations: [
    TermsComponent,
    UseComponent,
    PrivacyComponent,
    CookiesComponent
  ]
})
export class TermsModule {}
