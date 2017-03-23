import { Component, Inject, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated,
  selector: 'faq',
  template: 'FAQ component'
})
export class FaqComponent {
  constructor(@Inject('req') req: any) {
    console.log('req', req)

  }
}
