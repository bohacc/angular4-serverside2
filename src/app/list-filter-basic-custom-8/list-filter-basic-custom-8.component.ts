import { Component, Output, Input, EventEmitter } from '@angular/core';

import { ISelectBox } from '../select-box/select-box.interface';
import { ISelectItem } from '../select-item/select-item.interface';
import { AppService } from '../app.service';

@Component({
  selector: 'list-filter-basic-custom-8',
  templateUrl: 'list-filter-basic-custom-8.template.html',
})
export class ListFilterBasicCustom8 {
  @Output('onSelectItem') onSelectItemOut = new EventEmitter<ISelectItem>();
  defaultItem: ISelectBox = {id: '', name: '', val: ''};
  itemsComboBox: Array<ISelectBox>;
  selectedItems: Array<ISelectBox> = [];
  appService: AppService;

  constructor() {
    this.appService = AppService.getInstance();
    this.itemsComboBox = [
      {id: 'MC000023:T8 120 cm', name: 'T8 120 cm', val: 'MC000023:T8 120 cm'},
      {id: 'MC000023:T8 150 cm', name: 'T8 150 cm', val: 'MC000023:T8 150 cm'},
      {id: 'MC000023:T8 60 cm', name: 'T8 60 cm', val: 'MC000023:T8 60 cm'},
    ];
  }

  onSelectItem(item: ISelectBox) {
    this.selectedItems = this.appService.getSelectItemParam(item, this.selectedItems);
    this.onSelectItemOut.emit({id: item.id, name: item.name, val: item.val, type: 1, code: null});
  }

  onSelectItemComboBox(code: string, item: ISelectBox) {
    this.selectedItems = this.appService.getSelectItemParamComboBox(code, item, this.selectedItems);
    this.onSelectItemOut.emit({id: item.id, name: item.name, val: item.val, type: 2, code: code});
  }
}
