import { Component, Output, EventEmitter } from '@angular/core';

import { ISelectBox } from '../select-box/select-box.interface';
import { ISelectItem } from '../select-item/select-item.interface';
import { AppService } from '../app.service';

@Component({
  selector: 'list-filter-basic-custom-5',
  templateUrl: 'list-filter-basic-custom-5.template.html',
})
export class ListFilterBasicCustom5 {
  @Output('onSelectItem') onSelectItemOut = new EventEmitter<ISelectItem>();
  defaultItem: ISelectBox = {id: '', name: '', val: ''};
  itemsComboBox: Array<ISelectBox>;
  selectedItems: Array<ISelectBox> = [];
  appService: AppService;

  constructor() {
    this.appService = AppService.getInstance();
    this.itemsComboBox = [
      {id: 'MC000002:40 W', name: '40 W', val: 'MC000002:40 W'},
      {id: 'MC000002:60 W', name: '60 W', val: 'MC000002:60 W'},
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
