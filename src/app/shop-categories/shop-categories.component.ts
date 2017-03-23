import { Component, OnInit, Input } from '@angular/core';

//import { CatsOnMobileTablet } from '../cats-on-mobile-tablet/cats-on-mobile-tablet';
//import { MenuToggle } from '../menu-toggle/menu-toggle';
import { AppService } from '../app.service';
import { SideMenu } from '../shared/side-menu.service';
//import { MenuSetActive } from '../menu-set-active/menu-set-active.component';

@Component({
  selector: 'shop-categories',
  templateUrl: '../../../templates/a_6344.html',
})

export class ShopCategories implements OnInit, SideMenu{
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

  onDefaultAction(arg: Array<string>) {
    this.menuShows = arg;
  }
}
