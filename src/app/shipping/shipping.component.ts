import {Component, Output, EventEmitter, Input} from '@angular/core';
import {AppService} from "../app.service";
import Constants = require('../../backend/constants');
import {ApiService} from "../shared/api.service";

@Component({
  selector: 'shipping',
  templateUrl: 'shipping.template.html'
})

export class Shipping {
  @Output() onSelect = new EventEmitter<{item: any, callback: Function}>();
  @Input() defaultShipping: string;
  appService: AppService;
  shippingObj: any = {records: []};
  selectedShipping: any;
  isProcess: Boolean = false;
  isLoaded: Boolean = false;
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

  getData(obj: any = null) {
    let code = (obj && obj.item ? obj.item.code : '' || '');
    this.api.get('/shipping/' + code)
      .subscribe(res => {
        this.shippingObj = res.json();
        this.setDefault();
        if (obj && obj.callback) {
          obj.callback();
        }
      });
  }

  setDefault() {
    this.selectedShipping = this.store.shipping || this.defaultShipping;
  }

  selectItem(item: any) {
    let self = this;
    this.isProcess = true;
    let callback = function () {
      self.isProcess = false;
    };
    let code = (item ? item.code : '' || '');
    this.api.post('/shipping', {code: item.code})
      .subscribe(res => {
        this.onSelect.emit({item: item, callback: callback});
      });
  }
}
