import { Component, Inject, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated,
  selector: 'help',
  template: 'Help component'
})
export class HelpComponent {
  constructor(@Inject('req') req: any) {
    console.log('req', req)

  }
}
