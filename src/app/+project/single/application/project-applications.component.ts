import { Component, Inject, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated,
  selector: 'project-applications',
  template: 'Project Applications component'
})
export class ProjectApplicationsComponent {
  constructor(@Inject('req') req: any) {
    console.log('req', req)

  }
}
