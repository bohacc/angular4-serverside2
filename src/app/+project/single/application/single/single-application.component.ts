import { Component, Inject, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated,
  selector: 'single-application',
  template: 'Single Application component'
})
export class SingleApplicationComponent {
  constructor(@Inject('req') req: any) {
    console.log('req', req)

  }
}
