import {Component, Input} from '@angular/core';
import {AppService} from '../app.service';
import {ApiService} from "../shared/api.service";
import Constants = require('../../backend/constants');

@Component({
  selector: 'list-simple',
  templateUrl: 'list-simple.template.html',
})

export class ListSimple {
  @Input() rowsonpage: number;
  appService: AppService;
  products: Array<Object> = [];
  notFoundText: string = Constants.NOT_FOUND_TEXT;

  constructor(private api: ApiService) {
    this.appService = AppService.getInstance();
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.api.get('/products/list/' + this.appService.getPath() + this.getMeta())
      .subscribe(data => {
        this.products = data.json();
      });
  }

  getMeta() {
    return '?sort=sort_order_asc' +
      '&rowsonpage=' + (this.rowsonpage || 8);
  }

}
