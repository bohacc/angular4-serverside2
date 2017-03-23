import { Component, Inject, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated,
  selector: 'support',
  template: 'Support component'
})
export class SupportComponent {
  constructor(@Inject('req') req: any) {
    console.log('req', req)

  }
}
