import { Component, Inject, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated,
  selector: 'cookies',
  template: 'Cookies component'
})
export class CookiesComponent {
  constructor(@Inject('req') req: any) {
    console.log('req', req)

  }
}
