import { Component, AfterViewInit } from '@angular/core';

import { AppService } from '../app.service';
import {ApiService} from "../shared/api.service";

declare var $: any;

@Component({
  selector: 'redirect-navigation',
  templateUrl: '../../../templates/a_6363.html',
})

export class RedirectNavigation implements AfterViewInit {
  redirects: Array<Object>;
  appService: AppService;

  constructor(private api: ApiService) {
    this.appService = AppService.getInstance();
  }

  ngAfterViewInit() {
    let store = this.appService.getStore();
    let url = store.tableName === 'PRODUKTY' ? '/redirect-navigations/product/' + store.path : '/redirect-navigations/page/' + store.idPage;
    this.api.get(url)
      .subscribe(res => {
        let data: any = res.json();
        this.redirects = data;
      });
  }
}
