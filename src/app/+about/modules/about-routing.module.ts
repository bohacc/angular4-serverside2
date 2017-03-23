import { NgModule }                                             from '@angular/core'
import { RouterModule }                                         from '@angular/router' 

import { AboutComponent, HowItWorksComponent, WelcomeComponent,
         WhoWeAreComponent, PressComponent }                    from '../'


@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'about', component: AboutComponent },
      { path: 'about/how-it-works', component: HowItWorksComponent },
      { path: 'about/welcome', component: WelcomeComponent },
      { path: 'about/who-we-are', component: WhoWeAreComponent },
      { path: 'about/press', component: PressComponent }
    ])
  ]
})
export class AboutRoutingModule {}
