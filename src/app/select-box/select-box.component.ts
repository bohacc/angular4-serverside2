import { Component, ElementRef, OnInit, Input, Output, EventEmitter } from '@angular/core';
import Constants = require('../../backend/constants');

import { ISelectBox } from '../select-box/select-box.interface';
import {TranslateService} from "../pipes/translate/translate.service";

declare var $: any;

@Component({
  selector: '[select-box]',
  templateUrl: './select-box.template.html',
})

export class SelectBox implements OnInit {
  @Input('items') items: Array<any>;
  @Input('defaultItem') defaultItem: ISelectBox;
  @Input('firstEmpty') firstEmpty: Boolean = true;
  @Input() disabled: Boolean = false;
  @Output('onSelectItem') onSelectItem = new EventEmitter<ISelectBox>();
  showItems: Boolean;
  selectedItem: ISelectBox = {id: '1', name: '', val: ''};
  emptyItem: ISelectBox = {id: 'empty', name: '', val: ''};
  isDefaultSet: Boolean;
  emptyItemComboText: string;

  constructor(private _elRef: ElementRef, private translate: TranslateService) {
    this.emptyItemComboText = this.translate.instant(Constants.EMPTY_ITEM_COMBO_TEXT);
  }

  ngOnInit() {
    this.setDefault();
    // TODO: selectedItem = items[i].selected
  }

  ngOnChanges(changes) {
    if (changes['defaultItem'] && changes['defaultItem'].currentValue) {
      this.setDefault();
    }
  }

  onEnter() {
    if (this.disabled) {
      return;
    }
    this.showItems = !this.showItems;
  }

  onSelect(item: ISelectBox) {
    this.onSelectItem.emit(item);
    this.selectedItem = item;
    this.showItems = false;
  }

  setDefault() {
    this.onSelect(this.defaultItem);
    /*this.showItems = false;
    if (this.defaultItem.id) {
      this.selectedItem = this.defaultItem;
    }*/
  }
}
