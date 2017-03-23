import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core'

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated,
  selector: 'newsletters',
  template: 'Newsletters component'
})
export class NewslettersComponent {
  constructor() {}
}
