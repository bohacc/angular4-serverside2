import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import Constants = require('../../backend/constants');
import {ApiService} from "../shared/api.service";
import {AppService} from "../app.service";

@Component({
  selector: 'list-item',
  templateUrl: 'list-item.template.html',
})
export class ListItem {
  @Input('item') item: any;
  formatNumber1: string;
  formatNumber2: string;
  store: any = {user: {}};
  appService: AppService;

  constructor(private router: Router, private api: ApiService) {
    this.appService = AppService.getInstance();
    this.formatNumber1 = Constants.FORMAT_NUMBER_1;
    this.formatNumber2 = Constants.FORMAT_NUMBER_2;
  }

  ngOnInit() {
    this.store = this.appService.getStore();
  }

  buy() {
    this.api.post('/products/' + this.item.id + '/buy', {item: this.item, amount: 1})
      .subscribe(
        res => {
          let data: any = res.json() || [];
          this.router.navigate([Constants.PATHS.CART]);
        },
        err => {
          console.log(Constants.PRODUCT_ADD_TO_CART_ERROR);
        }
      );
  }
}
