import { Component, Inject, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core'

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated,
  selector: 'create',
  template: 'Create component'
})
export class CreateComponent {
  constructor() {}
}
