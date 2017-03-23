import { Component } from '@angular/core';
import { Router } from '@angular/router';

import Constants = require('../../backend/constants');
import {AppService} from "../app.service";

@Component({
  selector: 'order-shipping-and-payment',
  templateUrl: 'order-shipping-and-payment.template.html'
})

export class OrderShippingAndPayment {
  appService: AppService;
  filled: Boolean = false;

  constructor (private router: Router) {
    this.appService = AppService.getInstance();
  }

  onSubmit() {
    this.router.navigate([Constants.PATHS.ORDER_SUMMARY]);
  }

  onFilled(arg: Boolean) {
    this.filled = arg;
  }
}
