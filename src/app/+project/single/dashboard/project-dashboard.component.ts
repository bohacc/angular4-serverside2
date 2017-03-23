import { Component, Inject, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated,
  selector: 'project-dashboard',
  template: 'Project Dashboard component'
})
export class ProjectDashboardComponent {
  constructor(@Inject('req') req: any) {
    console.log('req', req)

  }
}
