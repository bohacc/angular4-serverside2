import { Component, Inject, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated,
  selector: 'categories',
  template: 'Categories component'
})
export class CategoriesComponent {
  constructor(@Inject('req') req: any) {
    console.log('req', req)

  }
}
