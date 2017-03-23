import { Component, Inject, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated,
  selector: 'team-dashboard',
  template: 'Team Dashboard component'
})
export class TeamDashboardComponent {
  constructor(@Inject('req') req: any) {
    console.log('req', req)

  }
}
