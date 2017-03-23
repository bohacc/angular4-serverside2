//noinspection TypeScriptUnresolvedFunction
let Constants = require('../backend/constants');

//import { isBrowser } from 'angular2-universal';

import {Inject, Injectable} from '@angular/core';

import { ISelectBox } from './select-box/select-box.interface';
import { IListFilter } from './list-filter/list-filter.interface';

@Injectable()
export class AppService {
  static instance:AppService;
  static isCreating:boolean = false;
  store: any;
  @Inject('isBrowser') private isBrowser: Boolean;

  constructor() {
    if (!AppService.isCreating) {
      throw new Error("You can't call new in Singleton instances! Call SingletonService.getInstance() instead.");
    }
    this.store = {
      appWidth: 0,
      scrollBarWidth: 0,
      showCats: true,
      showCatsMobile: false,
      cart: {
        amount: 0,
        priveVatAmount: 0
      },
      user: {
        b2b: null
      },
      language: null,
      isAustria: false,
      passwordPattern: null
    };
  }

  static getInstance() {
    if (AppService.instance == null) {
      AppService.isCreating = true;
      AppService.instance = new AppService();
      AppService.isCreating = false;
    }

    return AppService.instance;
  }

  getScrollBarWidth() {
    return this.store.scrollBarWidth;
  }
  setScrollBarWidth(width) {
    this.store.scrollBarWidth = width;
  }
  setAppWidth(width) {
    this.store.appWidth = width;
  }
  getAppWidth() {
    return this.store.appWidth;
  }
  setShowCats(arg) {
    this.store.showCats = arg;
  }
  getShowCats() {
    return this.store.showCats;
  }
  getStore() {
    return this.store;
  }
  refreshWidth() {
    if (this.isBrowser) {
      let width = this.store.appWidth + this.store.scrollBarWidth;
      if (width <= 991) {
        this.store.showCats = false;
        this.store.showCatsMobile = true;
      }
      else if (width >= 992) {
        this.store.showCats = true;
        this.store.showCatsMobile = false;
      }
    }
  }
  setPath(code: string) {
    this.store.path = code;
  }
  getPath() {
    return this.store.path;
  }
  setPageId(id: number) {
    this.store.idPage = id;
  }
  getPageId() {
    return this.store.idPage;
  }
  setTableName(name: string) {
    this.store.tableName = name;
  }
  setRedirect(code: string) {
    this.store.redirect = code;
  }
  getImageForType(ext: string) {
    let imgObj, imgs = [
      {ext: '.doc', img: 'file_doc.png'},
      {ext: '.docx', img: 'file_doc.png'},
      {ext: '.xls', img: 'file_docx.png'},
      {ext: '.xlsx', img: 'file_docx.png'},
      {ext: '.pdf', img: 'file_pdf.png'},
    ];
    imgObj = imgs.filter(function (el) {
      return el.ext === ext;
    })[0];
    return Constants.imageFileExtPath + (imgObj ? imgObj.img : 'file_unknown.png');
  }

  getSelectItemParamComboBox(code: string, item: ISelectBox, selectedItems: Array<ISelectBox>): Array<ISelectBox> {
    //TODO change value(slider)
    let index = -1, par, parSel, del;
    del = !item.val;
    selectedItems.map(function (el, i) {
      par = code || item.id.split(':')[0];
      parSel = el.id.split(':')[0];
      if (par === parSel) {
        index = i;
        del = true;
      }
    });
    if (del) {
      selectedItems.splice(index, 1);
      if (item.val) {
        selectedItems.push(item);
      }
    } else {
      selectedItems.push(item);
    }
    return selectedItems;
  }

  getStringForFilter(arr: Array<IListFilter>): string {
    let filters: string = '';
    arr.map(function (el, i) {
      if (filters) {
        filters += '@';
      }
      filters += el.val;
    });
    return filters;
  }

  getSelectItemParam(item: ISelectBox, selectedItems: Array<ISelectBox>): Array<ISelectBox> {
    let index = -1;
    selectedItems.map(function (el, i) {
      if (item.id === el.id) {
        index = i;
      }
    });
    if (index > -1) {
      selectedItems.splice(index, 1);
    } else {
      selectedItems.push(item);
    }
    return selectedItems;
  }

  setLoginName(name: string) {
    this.store.loginName = name;
  }

  getRootPath() {
    return this.isBrowser ? '' : Constants.ROOT_PATH;
  }

  clearPayment() {
    this.store.payment = '';
  }

  setB2B(val: Boolean) {
    this.store.user.b2b = val;
  }

  setLanguage(val: string) {
    this.store.language = val;
    this.store.isAustria = this.store.language == Constants.AUT_COUNTRY_CODE;
  }

  setPasswordPattern(arg: string) {
    this.store.passwordPattern = arg;
  }
}
