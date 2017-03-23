import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Http } from '@angular/http';

import { AppService } from '../app.service';
import { ISelectBox } from '../select-box/select-box.interface';
import { IListFilter } from '../list-filter/list-filter.interface';
import { ISelectItem } from '../select-item/select-item.interface';
import {ApiService} from "../shared/api.service";
import Constants = require('../../backend/constants');
import {TranslateService} from "../pipes/translate/translate.service";

@Component({
  selector: '[list-filter-basic]',
  templateUrl: 'list-filter-basic.template.html',
})
export class ListFilterBasic {
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
  cat: number = 0;


  constructor(private api: ApiService, private translate: TranslateService) {
    this.appService = AppService.getInstance();
  }

  ngOnInit() {
    this.getData();
    this.getType();
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
      _this.httpSubscription = _this.api.get('/filter/' + _this.appService.getPath() + '/type/1?' + _this.getMeta())
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

  onSelectItem(item: ISelectItem) {
    if (item.type === 1) {
      this.selectedItems = this.appService.getSelectItemParam(item, this.selectedItems);
    } else if (item.type === 2) {
      this.selectedItems = this.appService.getSelectItemParamComboBox(item.code, item, this.selectedItems);
    }
    this.getData();
    this.emit();
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
    let filters = 'filtersbasic=';
    this.selectedItems.map(function (el, i) {
      filters += (i > 0 ? '@' : '') + el.val;
    });
    return filters;
  }

  getType() {
    this.loading = true;
    this.api.get('/filter/type/' + this.appService.getPath())
      .subscribe(res => {
        let data: any = res.json();
        this.cat = data.cat;
        this.loading = false;
      });
  }

  emit() {
    let filters = this.getFilters();
    this.onChangeFilter.emit(filters);
  }
}
