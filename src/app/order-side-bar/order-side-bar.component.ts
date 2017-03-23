import { Component } from '@angular/core';
import {AppService} from "../app.service";
import Constants = require('../../backend/constants');
import {ApiService} from "../shared/api.service";

@Component({
  selector: 'order-side-bar',
  templateUrl: 'order-side-bar.template.html'
})

export class OrderSideBar {
  appService: AppService;
  cartObj: any = {records: []};
  formatNumber1: string;
  store: any = {user: {}};

  constructor (private api: ApiService) {
    this.appService = AppService.getInstance();
    this.formatNumber1 = Constants.FORMAT_NUMBER_1;
  }

  ngOnInit() {
    this.getData();
    this.store = this.appService.getStore();
  }

  getData() {
    this.api.get('/cart')
      .subscribe(res => {
        this.cartObj = res.json();
      });
  }

  refresh() {
    this.getData();
  }
}
