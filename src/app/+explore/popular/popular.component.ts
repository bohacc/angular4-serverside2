import { Component, Inject, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated,
  selector: 'popular',
  template: 'Popular component'
})
export class PopularComponent {
  constructor(@Inject('req') req: any) {
    console.log('req', req)

  }
}
