import { NgModule, ModuleWithProviders } from '@angular/core';

import { Dropdown, DropdownToggle, DropdownConfig} from '../';

const DROPDOWN_DIRECTIVES = [DropdownToggle, Dropdown];

@NgModule({
  declarations: DROPDOWN_DIRECTIVES,
  exports: DROPDOWN_DIRECTIVES
})
export class DropdownModule {

  static forRoot(): ModuleWithProviders { 
    return {
      ngModule: DropdownModule,
      providers: [DropdownConfig]
    }; 
  }
}
