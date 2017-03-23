import { Component, Inject, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated,
  selector: 'single-team',
  template: 'Single Team component'
})
export class SingleTeamComponent {
  constructor(@Inject('req') req: any) {
    console.log('req', req)

  }
}
