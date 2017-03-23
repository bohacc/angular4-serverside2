import { Component, Inject, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated,
  selector: 'privacy',
  template: 'Privacy component'
})
export class PrivacyComponent {
  constructor(@Inject('req') req: any) {
    console.log('req', req)

  }
}
