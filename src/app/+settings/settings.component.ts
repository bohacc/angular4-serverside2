import { Component, Inject, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated,
  selector: 'settings',
  template: 'Settings component'
})
export class SettingsComponent {
  constructor(@Inject('req') req: any) {
    console.log('req', req)

  }
}
