import { Component, Inject, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated,
  selector: 'trending-teams',
  template: 'Trending Teams component'
})
export class TrendingTeamsComponent {
  constructor(@Inject('req') req: any) {
    console.log('req', req)

  }
}
