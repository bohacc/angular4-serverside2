import { NgModule }             from '@angular/core'
import { RouterModule }         from '@angular/router'

import { ContactComponent }     from '../'
import { NewslettersComponent } from '../'

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'contact', component: ContactComponent },
      { path: 'newsletters', component: NewslettersComponent }
    ])
  ]
})
export class ContactRoutingModule {}
