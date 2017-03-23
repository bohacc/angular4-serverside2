import { Component, Inject, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated,
  selector: 'featured',
  template: 'Featured component'
})
export class FeaturedComponent {
  constructor(@Inject('req') req: any) {
    console.log('req', req)

  }
}
