import { Component, Inject, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated,
  selector: 'use',
  template: 'Terms of Use component'
})
export class UseComponent {
  constructor(@Inject('req') req: any) {
    console.log('req', req)

  }
}
