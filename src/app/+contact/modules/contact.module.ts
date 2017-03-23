import { NgModule }             from '@angular/core'

import { ContactComponent }     from '../'
import { NewslettersComponent } from '../'
import { ContactRoutingModule } from '../'

@NgModule({
  imports: [
    ContactRoutingModule
  ],
  declarations: [
    ContactComponent,
    NewslettersComponent
  ]
})
export class ContactModule {}
