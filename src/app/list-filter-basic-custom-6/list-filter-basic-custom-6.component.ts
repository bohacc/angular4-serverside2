import { Component, Output, EventEmitter } from '@angular/core';

import { ISelectBox } from '../select-box/select-box.interface';
import { ISelectItem } from '../select-item/select-item.interface';
import { AppService } from '../app.service';

@Component({
  selector: 'list-filter-basic-custom-6',
  templateUrl: 'list-filter-basic-custom-6.template.html',
})
export class ListFilterBasicCustom6 {
  @Output('onSelectItem') onSelectItemOut = new EventEmitter<ISelectItem>();
  defaultItem: ISelectBox = {id: '', name: '', val: ''};
  itemsComboBox: Array<ISelectBox>;
  selectedItems: Array<ISelectBox> = [];
  appService: AppService;

  constructor() {
    this.appService = AppService.getInstance();
    this.itemsComboBox = [
      {id: 'MC000002:20 W', name: '20 W', val: 'MC000002:20 W'},
      {id: 'MC000002:25 W', name: '25 W', val: 'MC000002:25 W'},
      {id: 'MC000002:35 W', name: '35 W', val: 'MC000002:35 W'},
      {id: 'MC000002:50 W', name: '50 W', val: 'MC000002:50 W'},
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
