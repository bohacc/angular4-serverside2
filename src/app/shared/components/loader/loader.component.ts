import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core'

import { AuthModelService, AuthUser }                            from '../../../auth'


@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated,
  selector: 'loading',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent {}
