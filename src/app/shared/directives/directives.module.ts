import { NgModule, ModuleWithProviders }                         from '@angular/core'

import { DropdownModule }                                        from './'

const MODULES = [
  DropdownModule
];

const PIPES = [];

const COMPONENTS = [];

const PROVIDERS = [];

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
export class SharedDirectivesModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedDirectivesModule,
      providers: [
        ...PROVIDERS
      ]
    };
  }
}
