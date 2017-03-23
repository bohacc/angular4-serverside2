import { NgModule, ModuleWithProviders }                     from '@angular/core'
import { CommonModule }                                      from '@angular/common'
import { RouterModule }                                      from '@angular/router'
import { ReactiveFormsModule }                               from '@angular/forms'

import { SharedComponentsModule, ApiService, CacheService,
         HashService, MetaService, CanActivateWithAuthGuard,
         SharedDirectivesModule }                            from '../'


const MODULES = [
  CommonModule,
  RouterModule,
  ReactiveFormsModule,
  SharedComponentsModule,
  SharedDirectivesModule
];

const PIPES = [
];

const COMPONENTS = [
  // put shared components here
];

const PROVIDERS = [
  CacheService,
  HashService,
  MetaService,
  ApiService,
  CanActivateWithAuthGuard
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
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        ...PROVIDERS
      ]
    };
  }
}
