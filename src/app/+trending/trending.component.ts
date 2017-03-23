import { Component, Inject, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated,
  selector: 'trending',
  template: 'Trending component'
})
export class TrendingComponent {
  constructor(@Inject('req') req: any) {
    console.log('req', req)

  }
}
