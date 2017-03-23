import { Component, OnInit, Input } from '@angular/core';

import { AppService } from '../app.service';
import { SideMenu } from '../shared/side-menu.service';


@Component({
  selector: 'shop-categories-dev',
  templateUrl: '../../../templates/a_6663.html',
})

export class ShopCategoriesDev implements OnInit, SideMenu{
  @Input('typeShowing') typeShowing: string;
  store: any;
  field: string;
  menuShows: Array<string> = [];
  menuShowsMobile: Array<string> = [];

  constructor() {}

  ngOnInit() {
    let appService = AppService.getInstance();
    let store = appService.getStore();
    this.field = this.typeShowing; //'showCatsMobile'
    this.store = store;
  }
  // SIDE MENU
  menuShowItems(item: string) {
    let pos = this.menuShows.indexOf(item);
    if (pos > -1) {
      this.menuShows.splice(pos, 1);
    } else {
      this.menuShows.push(item);
    }
  }
  menuIsShow(item: string) {
    return this.menuShows.indexOf(item) > -1;
  }
  menuShowItemsMobile(item: string) {
    let pos = this.menuShowsMobile.indexOf(item);
    if (pos > -1) {
      this.menuShowsMobile.splice(pos, 1);
    } else {
      this.menuShowsMobile.push(item);
    }
  }
  menuIsShowMobile(item: string) {
    return this.menuShowsMobile.indexOf(item) > -1;
  }
  onCollapseAll(event: any) {
    this.menuShowsMobile = [];
  }
}
