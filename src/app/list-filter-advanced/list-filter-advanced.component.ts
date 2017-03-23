import { Component, EventEmitter, Output, Input } from '@angular/core';

import { AppService } from '../app.service';
import { ISelectBox } from '../select-box/select-box.interface';
import { IListFilter } from '../list-filter/list-filter.interface';
import {ApiService} from "../shared/api.service";
import Constants = require('../../backend/constants');
import {TranslateService} from "../pipes/translate/translate.service";

@Component({
  selector: '[list-filter-advanced]',
  templateUrl: 'list-filter-advanced.template.html',
})
export class ListFilterAdvanced {
  @Input('filters') filters: Array<ISelectBox> = [];
  @Output('onChangeFilter') onChangeFilter = new EventEmitter<Array<IListFilter>>();
  items: Array<ISelectBox> = [];
  defaultItems: Array<ISelectBox> = [];
  loading: Boolean;
  appService: AppService;
  httpTimeout: any;
  httpSubscription: any;
  defaultItem: ISelectBox = {id: '', name: '', val: ''};
  selectedItems: Array<ISelectBox> = [];
  isLoadDefault: Boolean;

  constructor(private api: ApiService, private translate: TranslateService) {
    this.appService = AppService.getInstance();
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    let _this = this;
    if (this.httpTimeout) {
      clearTimeout(this.httpTimeout);
    }
    this.loading = true;
    this.httpTimeout = setTimeout(function () {
      if (_this.httpSubscription) {
        _this.httpSubscription.unsubscribe();
      }
      _this.httpSubscription = _this.api.get('/filter/' + _this.appService.getPath() + '/type/2?' + _this.getMeta())
        .subscribe(res => {
          let data: any = res.json();
          data = _this.translateFilter(data);
          _this.items = data;
          if (!_this.isLoadDefault) {
            _this.defaultItems = data;
            _this.isLoadDefault = true;
          }
          _this.loading = false;
        });
    }, 100);
  }

  translateFilter(data: Array<any>): Array<any> {
    let _this = this, a, b;
    return data.map(function (el) {
      if (el.type === Constants.FILTER_TYPE_FOR_BOOLEAN) {
        el.items = el.items.map(function (el2) {
          el2.name = _this.translate.instant(el2.name);
          return el2;
        });
      }
      return el;
    });
  }

  onSelectItemComboBox(code: string, item: ISelectBox) {
    this.selectedItems = this.appService.getSelectItemParamComboBox(code, item, this.selectedItems);
    this.getData();
    this.emit();
  }

  getFilters(): Array<IListFilter> {
    let arr: Array<IListFilter> = [];
    arr = this.selectedItems.map(function (el) {
      return {id: el.id, val: el.val};
    });
    return arr;
  }

  getMeta() {
    let filters = 'filtersadv=';
    this.selectedItems.map(function (el, i) {
      filters += (i > 0 ? '@' : '') + el.val;
    });
    return filters;
  }

  emit() {
    let filters = this.getFilters();
    this.onChangeFilter.emit(filters);
  }
}
