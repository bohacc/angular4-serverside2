import { Component, Inject, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated,
  selector: 'explore',
  template: 'Explore component'
})
export class ExploreComponent {
  constructor(@Inject('req') req: any) {
    console.log('req', req)

  }
}
