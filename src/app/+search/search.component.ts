import { Component, Inject, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core'

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated,
  selector: 'search',
  template: 'Search component'
})
export class SearchComponent {
  constructor() {}
}
