import { Component, ViewChild, Input } from '@angular/core';

import { AppService } from '../app.service';
import { Pagination } from '../pagination/pagination.component';
import { IListFilter } from '../list-filter/list-filter.interface';
import { ISelectBox } from '../select-box/select-box.interface';
import {ApiService} from "../shared/api.service";
import Constants = require('../../backend/constants');
import {TranslateService} from "../pipes/translate/translate.service";

@Component({
  selector: 'list',
  templateUrl: 'list.template.html',
})

export class List {
  @Input() asListType: number;
  @Input() meta: any = {};
  @Input() args: any = {};
  @ViewChild(Pagination) pagination:Pagination;
  appService: AppService;
  products: Array<Object>;
  defaultItem: ISelectBox;
  itemsOnPage: Array<ISelectBox>;
  itemsOnPageCount: number;
  page: number;
  sort: ISelectBox;
  inc: Boolean;
  httpSubscription: any;
  sortItems: Array<ISelectBox>;
  defaultItemSort: ISelectBox;
  action: Boolean;
  news: Boolean;
  stock: Boolean;
  notFoundText: string = Constants.NOT_FOUND_TEXT;
  paginationCount: number;
  httpTimeout: any;
  filtersAdvanced: Array<IListFilter> = [];
  filtersBasic: Array<IListFilter> = [];
  paginationMeta: {searchStr: string, url: string} = {searchStr: '', url: ''};
  isLoaded: Boolean = false;
  loading: Boolean = false;

  constructor(private api: ApiService, private translate: TranslateService) {
    this.appService = AppService.getInstance();
    this.page = 1;
    this.products = [];
    this.itemsOnPage = [
      {id: 1, name: '8', val: '8'},
      {id: 2, name: '24', val: '24'},
      {id: 3, name: '48', val: '48'},
      {id: 4, name: '64', val: '64'}
    ];
    this.defaultItem = this.itemsOnPage[0];
    this.itemsOnPageCount = parseInt(this.defaultItem.val, 10);
    this.sortItems = [
      {id: 1, name: this.translate.instant(Constants.ORDER_DEFAULT), val: 'name_asc'},
      {id: 2, name: this.translate.instant(Constants.ORDER_PRICE_ASC), val: 'price_asc'},
      {id: 3, name: this.translate.instant(Constants.ORDER_PRICE_DESC), val: 'price_desc'},
      {id: 4, name: this.translate.instant(Constants.ORDER_CODE_ASC), val: 'code_asc'},
      {id: 5, name: this.translate.instant(Constants.ORDER_CODE_DESC), val: 'code_desc'},
      {id: 6, name: this.translate.instant(Constants.ORDER_NAME_ASC), val: 'name_asc'},
      {id: 7, name: this.translate.instant(Constants.ORDER_NAME_DESC), val: 'name_desc'},
    ];
    this.defaultItemSort = this.sortItems[0];
    this.sort = this.defaultItemSort;
  }

  ngOnInit() {
    this.getData();
    this.setPaginationMeta();
    this.pagination.setFilter(this.getFilterAll());
  }

  getData() {
    let _this = this;
    if (this.httpTimeout) {
      clearTimeout(this.httpTimeout);
    }
    this.isLoaded = false;
    this.loading = true;
    this.httpTimeout = setTimeout(function () {
      if (_this.httpSubscription) {
        _this.httpSubscription.unsubscribe();
      }
      _this.httpSubscription = _this.api.get(_this.getUrl())
        .subscribe(
          res => {
            let data: any = res.json();
            _this.products = _this.inc ? _this.products.concat(data) : data;
            _this.inc = false;
            _this.isLoaded = true;
            _this.loading = false;
          },
          res=> {
            _this.isLoaded = true;
            _this.loading = false;
          }
        );
    }, 200);
  }

  getMeta() {
    return '?page=' + this.getPage() +
      '&rowsonpage=' + this.itemsOnPageCount +
      '&sort=' + this.getSort() +
      '&filter=' + this.getFilter() +
      '&filtersadv=' + this.getFiltersAdvanced() +
      '&filtersbasic=' + this.getFiltersBasic() +
      '&searchStr=' + this.getSearchStr() +
      this.getArgs();
  }

  setPage(num: number) {
    this.page = num;
  }

  getPage() {
    return this.page;
  }

  setSort(obj: ISelectBox) {
    this.sort = obj;
  }

  getSort() {
    return this.sort.val;
  }

  getFilter() {
    return (this.stock ? 'stock' : '') +
      ':' + (this.action ? 'action' : '') +
      ':' + (this.news ? 'news' : '');
  }

  getFiltersAdvanced(): string {
    return this.appService.getStringForFilter(this.filtersAdvanced);
  }

  getFiltersBasic(): string {
    return this.appService.getStringForFilter(this.filtersBasic);
  }

  getFilterAll() {
    let flt = this.getFilter();
    let fltAdvanced = this.getFiltersAdvanced();
    let fltBasic = this.getFiltersBasic();
    return 'filter=' + flt +
      '&' + 'filtersadv=' + fltAdvanced +
      '&' + 'filtersbasic=' + fltBasic +
      '&' + 'searchStr=' + this.getSearchStr() +
      this.getArgs();
  }

  setFiltersAdvanced(filters: Array<IListFilter>) {
    this.filtersAdvanced = filters;
  }

  setFiltersBasic(filters: Array<IListFilter>) {
    this.filtersBasic = filters;
  }

  onPage(page: number) {
    this.setPage(page);
    this.getData();
  }

  onSelectItemsOnPage(obj: ISelectBox) {
    this.itemsOnPageCount = parseInt(obj.val, 10);
  }

  onLoadNextItems(arg: Boolean) {
    this.inc = arg;
  }

  onSelectSort(obj: ISelectBox) {
    this.setSort(obj);
    this.refreshDataAfterSort();
  }

  refreshDataWithPagination() {
    this.setPage(1);
    this.getData();
    this.setPaginationMeta();
    this.pagination.refresh(this.getFilterAll());
  }

  refreshData() {
    this.getData();
  }

  refreshDataAfterSort() {
    this.pagination.setDefaultAfterSort();
  }

  getPaginationCount(num: number) {
    this.paginationCount = num;
  }

  onChangeFilterAdvanced(filters: Array<IListFilter>) {
    this.setFiltersAdvanced(filters);
    this.refreshDataWithPagination();
  }

  onChangeFilterBasic(filters: Array<IListFilter>) {
    this.setFiltersBasic(filters);
    this.refreshDataWithPagination();
  }

  getUrl(): string {
    let deaultUrl = '/products/list/' + this.appService.getPath() + this.getMeta();
    if (this.meta.searchStr) {
      deaultUrl = this.meta.url + this.getMeta();
    }
    return deaultUrl;
  }

  getSearchStr() {
    return (this.meta.searchStr || '');
  }

  setPaginationMeta() {
    this.paginationMeta.url = this.meta.urlPagination;
  }

  getArgs() {
    let params = '';
    if (!this.args) {
      return '';
    }
    for (var name in this.args) {
      if (this.args.hasOwnProperty(name)) {
        params += Constants.AND + name + Constants.EQUALS + this.args[name];
      }
    }
    return params;
  }
}
