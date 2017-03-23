import {Component, ViewChild} from '@angular/core';
import Constants = require('../../backend/constants');
import {AppService} from "../app.service";
import {Router} from "@angular/router";
import {ApiService} from "../shared/api.service";
import {TranslateService} from "../pipes/translate/translate.service";
import {ShippingAndDeliveryPopup} from "../shipping-and-delivery-popup/shipping-and-delivery-popup.component";

@Component({
  selector: 'cart',
  templateUrl: 'cart.template.html'
})

export class Cart {
  @ViewChild('sdp') ShippingAndDeliveryPopupCmp: ShippingAndDeliveryPopup;
  appService: AppService;
  cartObj: any = {};
  amount: number = 1;
  otherProduct: any = {code: null, amount: 1};
  test: any;
  httpTimeoutU: any;
  httpTimeoutR: any;
  httpSubscriptionU: any;
  httpSubscriptionR: any;
  filled: Boolean = false;
  store: any;
  formatNumber1: string;
  formatNumber2: string;
  inProcess: Boolean = false;
  coupon: any = {code: '', name: '', price: null};
  showCoupons: Boolean = false;
  existCoupons: Boolean = false;
  isChange: Boolean = false;
  isAustria: Boolean = false;

  constructor (private router: Router, private api: ApiService, private translate: TranslateService) {
    this.appService = AppService.getInstance();
    this.store = this.appService.getStore();
    this.formatNumber1 = Constants.FORMAT_NUMBER_1;
    this.formatNumber2 = Constants.FORMAT_NUMBER_2;
  }

  ngOnInit() {
    this.getData();
  }

  removeItem(item: any) {
    if (this.inProcess) {
      return;
    }

    this.inProcess = true;
    let _this = this;
    if (this.httpTimeoutR) {
      clearTimeout(this.httpTimeoutR);
    }
    this.httpTimeoutR = setTimeout(function () {
      if (_this.httpSubscriptionR) {
        _this.httpSubscriptionR.unsubscribe();
      }
      _this.httpSubscriptionR = _this.api.delete('/products/item/' + item.itemId)
        .subscribe(
          res => {
            _this.inProcess = false;
            _this.getData();
          },
          res => {
            _this.inProcess = false;
          }
        );
    }, 200);
  }

  updateItem(item: any, event: any) {
    if (this.inProcess) {
      return;
    }
    if (event && event.keyCode !== 13) {
      return;
    }
    if (!this.isChange) {
      return;
    }

    this.inProcess = true;
    let _this = this;
    if (this.httpTimeoutU) {
      clearTimeout(this.httpTimeoutU);
    }
    this.httpTimeoutU = setTimeout(function () {
      if (_this.httpSubscriptionU) {
        _this.httpSubscriptionU.unsubscribe();
      }
      _this.httpSubscriptionU = _this.api.put('/products', item)
        .subscribe(
          res => {
            _this.inProcess = false;
            _this.isChange = false;
            _this.getData();
          },
          res => {
            _this.inProcess = false;
            _this.isChange = false;
          }
        );
    }, 200);
  }

  getData() {
    this.api.get('/cart')
      .subscribe(
        data => {
          this.cartObj = data.json();
          this.setFilled();
          this.setCoupon();
          // REFRESH CART INFO
          this.store.priceVatAmount = this.cartObj.priceAmountVat;
          this.store.amount = this.cartObj.amount;
        },
        err => {
        }
      );
  }

  setFilled() {
    this.filled = (this.cartObj && this.cartObj.records && this.cartObj.records.length > 0);
  }

  buy() {
    this.inProcess = true;
    if (!this.otherProduct.code || !this.otherProduct.amount) {
      return;
    }
    this.api.post('/products/buy', this.otherProduct)
      .subscribe(
        res => {
          this.inProcess = false;
          this.setDefaultOtherProduct();
          this.getData();
        },
        err => {
          this.inProcess = false;
          alert(this.translate.instant(Constants.PRODUCT_ADD_TO_CART_ERROR));
        }
      );
  }

  setDefaultOtherProduct() {
    this.otherProduct.code = '';
    this.otherProduct.amount = 1;
  }

  addCoupon() {
    this.inProcess = true;
    this.api.post('/coupons', {code: this.coupon.code})
      .subscribe(
        res => {
          let data:any = res.json();
          this.inProcess = false;
          if (data.error) {
            alert(this.translate.instant(Constants.MESSAGE_COUPON_ERROR));
            return;
          }
          if (!data.valid) {
            alert(this.translate.instant(Constants.MESSAGE_COUPON_INVALID));
            return;
          }
          if (data.valid) {
            this.clearCurrentCoupon();
            this.getData();
          }
        },
        res => {
          this.inProcess = false;
        }
      )
  }

  incAmount(obj: any) {
    this.changeAmount();
    if (obj.amount) {
      let current = Math.abs(parseFloat(String(obj.amount).replace(/,/g, '.').replace(/ /g, '')));
      obj.amount = current + 1;
    }
    if (obj.amount) {
      this.updateItem(obj, null);
    }
  }

  decAmount(obj: any) {
    if (obj.amount == 1) {
      return;
    }
    this.changeAmount();
    let current = Math.abs(parseFloat(String(obj.amount).replace(/,/g, '.').replace(/ /g, '')));
    obj.amount = current - 1;
    this.updateItem(obj, null);
  }

  next() {
    if (this.isChange) {
      alert(this.translate.instant(Constants.MESSAGE_SAVE_AMOUNT_PROCESS));
      return;
    }

    if (this.filled) {
      this.router.navigate([Constants.PATHS.ORDER_PERSONAL_DATA]);
    } else {
      alert(this.translate.instant(Constants.MESSAGE_CART_ITEMS_NOT_FOUND));
    }
  }

  setCoupon() {
    this.existCoupons = false;
    this.coupon = {};
    if (this.cartObj && this.cartObj.coupons && this.cartObj.coupons[0]) {
      this.coupon.code = this.cartObj.coupons[0].code;
      this.coupon.name = this.cartObj.coupons[0].name;
      this.coupon.price = this.cartObj.coupons[0].price;
      this.showCoupons = true;
      this.existCoupons = true;
    }
  }

  removeCoupon() {
    this.inProcess = true;
    this.api.delete('/coupons/' + this.coupon.code)
      .subscribe(
        res => {
          let data:any = res.json();
          this.inProcess = false;
          if (data.error) {
            alert(this.translate.instant(Constants.MESSAGE_COUPON_DELETE_ERROR));
            return;
          }
          this.getData();
        },
        res => {
          this.inProcess = false;
        }
      )
  }

  onCoupon() {
    if (this.existCoupons) {
      this.removeCoupon();
    } else {
      this.addCoupon();
    }
  }

  clearCurrentCoupon() {
    this.coupon.code = '';
    this.coupon.name = '';
    this.coupon.price = '';
  }

  trans(arg: string): string {
    return this.translate.instant(arg);
  }

  shippingAndDeliveryPopupOpen() {
    this.ShippingAndDeliveryPopupCmp.open();
  }

  changeAmount() {
    this.isChange = true;
  }

  prev() {
    let _this = this;
    setTimeout(function () {
      if (!_this.isChange) {
        window.history.back();
      } else {
        alert(_this.translate.instant(Constants.MESSAGE_SAVE_AMOUNT_PROCESS));
      }
    }, 500);
  }
}
