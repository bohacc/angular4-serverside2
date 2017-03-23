import { Component, OnInit } from '@angular/core';
import {AppService} from "../app.service";
import {Router} from "@angular/router";
import Constants = require('../../backend/constants');
import {ApiService} from "../shared/api.service";
import {TranslateService} from "../pipes/translate/translate.service";

@Component({
  selector: 'page-header',
  templateUrl: 'page-header.template.html',
})

export class PageHeader implements OnInit {
  appService: AppService;
  store: any;
  priceVatAmount: string;
  amount: string;
  searchStr: string;

  constructor(private api: ApiService, private router: Router, private translate: TranslateService) {
    this.appService = AppService.getInstance();
    this.store = this.appService.getStore();
  }

  ngOnInit() {
    this.getCartInfo();
  }

  getCartInfo() {
    this.api.get('/cart')
      .subscribe(res => {
        let data: any = res.json();
        this.store.priceAmount = (data.priceAmount || 0);
        this.store.priceVatAmount = (data.priceAmountVat || 0);
        this.store.amount = (data.amount || 0);
        this.store.currency = data.currency;
      });
  }

  onSubmit() {
    if (!this.searchStr) {
      return;
    }
    if (this.searchStr.length < Constants.SEARCH_STR_LENGTH) {
      alert(this.translate.instant(Constants.MESSAGE_SEARCH_STR_LENGTH_ERROR));
      return;
    }
    this.router.navigate([Constants.PATHS.SEARCH_RESULT + Constants.SLASH + Constants.PATHS.SEARCH_RESULT + Constants.SLASH + this.searchStr]);
  }
}
