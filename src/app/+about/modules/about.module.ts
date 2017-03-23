import { NgModule }                                              from '@angular/core'

import { SharedModule }                                          from '../../shared'
import { AboutComponent, HowItWorksComponent, WelcomeComponent,
         WhoWeAreComponent, PressComponent, AboutRoutingModule } from '../'


@NgModule({
  imports: [
    SharedModule,
    AboutRoutingModule
  ],
  declarations: [
    AboutComponent,
    HowItWorksComponent,
    WelcomeComponent,
    WhoWeAreComponent,
    PressComponent
  ]
})
export class AboutModule {}
