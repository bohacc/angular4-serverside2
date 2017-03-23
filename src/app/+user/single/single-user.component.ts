import { Component, Inject, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated,
  selector: 'single-user',
  template: 'Single User component'
})
export class SingleUserComponent {
  constructor(@Inject('req') req: any) {
    console.log('req', req)

  }
}
