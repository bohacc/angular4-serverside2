//import { isBrowser } from 'angular2-universal';

import {Component, OnInit, Input, Output, EventEmitter, Inject} from '@angular/core';

import { AppService } from '../app.service';
import {ApiService} from "../shared/api.service";

@Component({
  selector: 'pagination',
  templateUrl: 'pagination.template.html',
})

export class Pagination implements OnInit {
  @Input() itemsOnPage: number;
  @Input() meta: any = {};
  @Output('onPage') onPage = new EventEmitter<number>();
  @Output('onCount') onCount = new EventEmitter<number>();
  @Output('onLoadNextItems') onLoadNextItems = new EventEmitter<Boolean>();
  appService: AppService;
  itemsCount: number;
  showPrior: Boolean;
  showNext: Boolean;
  showFirst: Boolean;
  showLast: Boolean;
  showA: Boolean;
  showB: Boolean;
  showC: Boolean;
  showD: Boolean;
  showE: Boolean;
  showRangeLeft: Boolean;
  showRangeRight: Boolean;
  pageFirst: number;
  pageLast: number;
  pageA: number;
  pageB: number;
  pageC: number;
  pageD: number;
  pageE: number;
  currentPage: number;
  inc: Boolean;
  pagesIndex: number;
  isSetItemsOnPage: Boolean;
  filter: string;
  httpTimeout: any;
  httpSubscription: any;

  constructor(private api: ApiService, @Inject('isBrowser') private isBrowser: Boolean) {
    this.appService = AppService.getInstance();
  }

  ngOnInit() {
  }

  ngOnChanges(inputChanges) {
    if (inputChanges.itemsOnPage.currentValue && this.isBrowser) {
      let callback = () => {
        this.onPage.emit(this.currentPage);
      }
      this.getPagination(callback);
    }
  }

  private getPagination(callback: Function = null) {
    let _this = this;
    if (this.httpTimeout) {
      clearTimeout(this.httpTimeout);
    }
    this.httpTimeout = setTimeout(function () {
      if (_this.httpSubscription) {
        _this.httpSubscription.unsubscribe();
      }
      _this.httpSubscription = _this.api.get(_this.getUrl())
        .subscribe(res => {
          let data: any = res.json();
          _this.itemsCount = data.rows;
          _this.setDefault();
          _this.isSetItemsOnPage = true;
          _this.onCount.emit(_this.itemsCount);
          if (callback) {
            callback();
          }
        });
    }, 200);
  }

  private refreshModel(recalculate: Boolean) {
    this.setPaginationPagesIndex();
    this.setFirst();
    this.setPageA(recalculate);
    this.setPageB(recalculate);
    this.setPageC(recalculate);
    this.setPageD(recalculate);
    this.setPageE(recalculate);
    this.setLast();
    this.setRangeLeft();
    this.setRangeRight();
    this.setPrior();
    this.setNext();
  }

  setDefault() {
    let page = this.itemsCount > 0 ? 1 : 0;
    this.isSetItemsOnPage = false;
    this.setCurrent(page, true);
  }

  setDefaultAfterSort() {
    let page = this.itemsCount > 0 ? 1 : 0;
    this.setCurrent(page, true);
  }

  private setCurrent(num: number, recalculate: Boolean) {
    this.currentPage = num;
    this.refreshModel(recalculate);
    if (this.isSetItemsOnPage) {
      this.onPage.emit(this.currentPage);
    }
  }

  private setFirst() {
    this.showFirst = this.itemsCount > 0;
    this.pageFirst = this.itemsCount > 0 ? 1 : 0;
  }

  private setLast() {
    this.showLast = this.itemsCount > (this.itemsOnPage * 6);
    this.pageLast = Math.ceil(this.itemsCount / this.itemsOnPage);
  }

  private setPrior() {
    this.showPrior = this.currentPage > 1;
  }

  private setNext() {
    this.showNext = this.itemsOnPage * this.currentPage < this.itemsCount;
  }

  private setRangeLeft() {
    this.showRangeLeft = this.pagesIndex ? this.pageA - 1 > this.pageFirst : false;
  }

  private setRangeRight() {
    this.showRangeRight = this.pagesIndex ? this.pageE + 1 < this.pageLast : false;
  }

  private setPage(pageVal: number, minus: number, def: number) {
    let val;
    if (this.inc) {
      if (this.currentPage <= (this.pagesIndex + 1)) {
        val = def;
      } else {
        if (this.currentPage == this.pageLast) {
          val = this.currentPage - (minus + 1);
        } else {
          val = this.currentPage - minus;
        }
      }
    } else {
      if (this.currentPage <= (this.pagesIndex + 1)) {
        val = def;
      } else {
        if (this.currentPage < pageVal) {
          val = this.currentPage;
        } else {
          val = this.currentPage - (minus + (this.currentPage == this.pageLast ? 1 : 0));
        }
      }
    }
    return val;
  }

  private setPageA(recalculate: Boolean) {
    let page = 2;
    this.showA = this.itemsCount > (this.itemsOnPage);
    if (recalculate) {
      this.pageA = this.setPage(this.pageA, this.pagesIndex - 1, page);
    }
  }

  private setPageB(recalculate: Boolean) {
    let page = 3;
    this.showB = this.itemsCount > (this.itemsOnPage * 2);
    if (recalculate) {
      this.pageB = this.setPage(this.pageB, this.pagesIndex - 2, page);
    }
  }

  private setPageC(recalculate: Boolean) {
    let page = 4;
    this.showC = this.itemsCount > (this.itemsOnPage * 3);
    if (recalculate) {
      this.pageC = this.setPage(this.pageC, this.pagesIndex - 3, page);
    }
  }

  private setPageD(recalculate: Boolean) {
    let page = 5;
    this.showD = this.itemsCount > (this.itemsOnPage * 4);
    if (recalculate) {
      this.pageD = this.setPage(this.pageD, this.pagesIndex - 4, page);
    }
  }

  private setPageE(recalculate: Boolean) {
    let page = 6;
    this.showE = this.itemsCount > (this.itemsOnPage * 5);
    if (recalculate) {
      this.pageE = this.setPage(this.pageE, this.pagesIndex - 5, page);
    }
  }

  private prior() {
    this.inc = false;
    if (this.currentPage > 1) {
      this.setCurrent(this.currentPage - 1, true);
    }
  }

  private next() {
    this.inc = true;
    if (this.currentPage < this.pageLast) {
      this.setCurrent(this.currentPage + 1, true);
    }
  }

  private setPaginationPagesIndex() {
    let allPages = Math.ceil(this.itemsCount / this.itemsOnPage);
    allPages = allPages < 1 ? 0 : allPages;
    this.pagesIndex = allPages > 6 ? 5 : allPages;
  }

  private getMeta() {
    return '?' + this.getFilter();
  }

  private getFilter() {
    return this.filter || '';
  }

  public setFilter(filter: string) {
    this.filter = filter;
  }

  private addItemsOnPage() {
    if (this.itemsOnPage < this.itemsCount) {
      this.onLoadNextItems.emit(true);
      this.next();
    }
  }

  refresh(filter: string) {
    this.setFilter(filter);
    this.isSetItemsOnPage = false;
    this.getPagination();
  }

  getUrl(): string {
    let deaultUrl = '/products/list/' + this.appService.getPath() + '/pagination' + this.getMeta();
    if (this.meta.url) {
      deaultUrl = this.meta.url + this.getMeta();
    }
    return deaultUrl;
  }
}
