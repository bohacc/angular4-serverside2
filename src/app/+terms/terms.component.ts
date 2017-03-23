import { Component, Inject, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated,
  selector: 'terms',
  template: 'Terms component'
})
export class TermsComponent {
  constructor(@Inject('req') req: any) {
    console.log('req', req)

  }
}
