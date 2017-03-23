import { Component } from '@angular/core';
import {AppService} from "../app.service";

import Constants = require('../../backend/constants');

@Component({
  selector: 'order-header',
  templateUrl: 'order-header.template.html'
})

export class OrderHeader {
  steps: Array<Boolean> = [false, false, false, false];
  pages: Array<string> = [
    Constants.PATHS.CART,
    Constants.PATHS.ORDER_PERSONAL_DATA,
    Constants.PATHS.ORDER_SHIPPING_AND_PAYMENT,
    Constants.PATHS.ORDER_SUMMARY
  ];
  appService: AppService;

  constructor () {
    this.appService = AppService.getInstance();
  }

  ngOnInit() {
    let code = Constants.SLASH + this.appService.getPath();
    this.steps = [false, false, false, false];
    this.steps[this.pages.indexOf(code)] = true;
  }
}
