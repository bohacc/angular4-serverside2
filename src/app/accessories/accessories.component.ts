import {Component, Input, Output, EventEmitter} from "@angular/core";

import Constants = require('../../backend/constants');

@Component({
  selector: 'accessories',
  templateUrl: 'accessories.template.html'
})

export class Accessories {
  @Input() items: Array<any> = [];
  @Output() onPlus = new EventEmitter<any>();
  @Output() onMinus = new EventEmitter<any>();
  formatNumber1: string;
  formatNumber2: string;

  constructor() {
    this.formatNumber1 = Constants.FORMAT_NUMBER_1;
    this.formatNumber2 = Constants.FORMAT_NUMBER_2;
  }

  plus(item: any) {
    this.onPlus.emit(item);
  }

  minus(item: any) {
    this.onMinus.emit(item);
  }
}
