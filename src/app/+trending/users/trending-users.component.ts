import { Component, Inject, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated,
  selector: 'trending-users',
  template: 'Trending Users component'
})
export class TrendingUsersComponent {
  constructor(@Inject('req') req: any) {
    console.log('req', req)

  }
}
