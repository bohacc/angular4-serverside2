import {Component, EventEmitter, Output, Input} from '@angular/core';
import {AppService} from "../app.service";
import Constants = require('../../backend/constants');
import {ApiService} from "../shared/api.service";

@Component({
  selector: 'payment',
  templateUrl: 'payment.template.html'
})

export class Payment {
  @Output() onSelect = new EventEmitter<{item: any, callback: Function}>();
  @Input() defaultPayment: string;
  appService: AppService;
  paymentObj: any = {records: []};
  selectedPayment: any;
  isProcess: Boolean = false;
  isOpen: Boolean = false;
  store: any;
  formatNumber1: string;

  constructor (private api: ApiService) {
    this.appService = AppService.getInstance();
    this.store = this.appService.getStore();
    this.formatNumber1 = Constants.FORMAT_NUMBER_1;
  }

  ngOnInit() {
    this.getData();
  }

  ngChanges(changes) {
    if (changes.defaultPayment) {
      this.setDefault();
    }
  }

  setDefault() {
    this.selectedPayment = this.store.payment || this.defaultPayment;
  }

  getData(obj: any = null) {
    this.isOpen = true;
    let code = (obj && obj.item ? obj.item.code : '' || '');
    this.api.get('/payment/' + code)
      .subscribe(res => {
        this.paymentObj = res.json();
        this.setDefault();
        if (obj && obj.callback) {
          obj.callback();
        }
      });
  }

  selectItem(item: any) {
    let self = this;
    this.isProcess = true;
    let callback = function () {
      self.isProcess = false;
    };
    let code = (item ? item.code : '' || '');
    this.api.post('/payment', {code: item.code})
      .subscribe(res => {
        this.onSelect.emit({item: item, callback: callback}); // only for refresh, callback is not call
        callback();
      });
  }

  refresh(obj: any = null) {
    this.appService.clearPayment();
    this.defaultPayment = '';
    this.selectedPayment = '';
    this.getData(obj);
  }
}
