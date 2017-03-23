import { NgModule, ModuleWithProviders }                         from '@angular/core'
import { CommonModule }                                          from '@angular/common'
import { RouterModule }                                          from '@angular/router'
import { ReactiveFormsModule }                                   from '@angular/forms'

import { MainNavComponent, MainFooterComponent, LoaderComponent,
         SliderComponent, CardComponent }                        from './'
import { SafeStyle }                                             from '../'

const MODULES = [
  CommonModule,
  RouterModule,
  ReactiveFormsModule
];

const PIPES = [
  SafeStyle
];

const COMPONENTS = [
  MainNavComponent,
  MainFooterComponent,
  LoaderComponent,
  SliderComponent,
  CardComponent
];

const PROVIDERS = [
]

@NgModule({
  imports: [
    ...MODULES
  ],
  declarations: [
    ...PIPES,
    ...COMPONENTS
  ],
  exports: [
    ...MODULES,
    ...PIPES,
    ...COMPONENTS
  ]
})
export class SharedComponentsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedComponentsModule,
      providers: [
        ...PROVIDERS
      ]
    };
  }
}
