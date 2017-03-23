import { Component } from '@angular/core';
import {Router} from "@angular/router";

import Constants = require('../../backend/constants');
import {AppService} from "../app.service";
import {ApiService} from "../shared/api.service";
import {TranslateService} from "../pipes/translate/translate.service";

@Component({
  selector: 'order-summary',
  templateUrl: 'order-summary.template.html'
})

export class OrderSummary {
  appService: AppService;
  inProcess: Boolean = false;
  user: any;

  constructor (private router: Router, private api: ApiService, private translate: TranslateService) {
    this.appService = AppService.getInstance();
    this.user = {
      login: '',
      password: '',
      passwordConfirm: '',
      firstName: '',
      LastName: '',
      email: '',
      phone: '',
      city: '',
      street: '',
      zip: '',
      state: '',
      companyName: '',
      regId: '',
      vatId: '',
      firstNameDelivery: '',
      lastNameDelivery: '',
      companyNameDelivery: '',
      cityDelivery: '',
      streetDelivery: '',
      zipDelivery: '',
      stateDelivery: '',
      saveAsNewUser: false,
      note: ''
    }
  }

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    this.api.get('/user')
      .subscribe(res => {
        let data: any = res.json();
        this.user = data;
      })
  }

  verifyOrder(obj: any) {
    if (parseInt(obj.amount, 10) <= 0) {
      alert(this.translate.instant(Constants.MESSAGE_CART_ITEMS_NOT_FOUND));
      return false;
    }
    if (!obj.shipping) {
      alert(this.translate.instant(Constants.MESSAGE_ORDER_SHIPPING_ERROR));
      return false;
    }
    if (!obj.payment) {
      alert(this.translate.instant(Constants.MESSAGE_ORDER_PAYMENT_ERROR));
      return false;
    }
    if (!obj.firstName) {
      alert(this.translate.instant(Constants.MESSAGE_ORDER_FIRSTNAME_ERROR));
      return false;
    }
    if (!obj.firstName) {
      alert(this.translate.instant(Constants.MESSAGE_ORDER_LASTNAME_ERROR));
      return false;
    }
    if (!obj.email) {
      alert(this.translate.instant(Constants.MESSAGE_ORDER_EMAIL_ERROR));
      return false;
    }
    return true;
  }

  order() {
    if (this.inProcess) {
      return;
    }
    this.inProcess = true;
    this.api.get('/order/verify', {})
      .subscribe(
        res => {
          let data: any = res.json();
          if (this.verifyOrder(data)) {
            this.createOrder();
          } else {
            this.inProcess = false;
          }
        },
        res => {
          this.inProcess = false;
        }
      );
  }

  createOrder() {
    this.api.post('/order', {})
      .subscribe(
        res => {
          this.inProcess = false;
          let data:any = res.json();

          if (data.userExist) {
            alert(this.translate.instant(Constants.MESSAGE_EXIST_USER));
          } else {
            if (data.id && !isNaN(data.id)) {
              this.router.navigate([Constants.PATHS.ORDER_SUCCESS]);
            } else {
              alert(this.translate.instant(Constants.MESSAGE_ORDER_ERROR));
            }
          }
        },
        res => {
          this.inProcess = false;
        }
      );
  }
}
