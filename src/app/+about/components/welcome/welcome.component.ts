import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core'

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated,
  selector: 'welcome',
  template: 'Welcome component'
})
export class WelcomeComponent {
  constructor() {}
}
