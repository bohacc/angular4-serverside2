import {Component, Input, Output, EventEmitter} from '@angular/core';
import {IConfiguratorPopup} from "./configurator-popup.interface";
import {TranslateService} from "../pipes/translate/translate.service";

@Component({
  selector: 'configurator-popup',
  templateUrl: 'configurator-popup.template.html'
})

export class ConfiguratorPopup {
  @Input() isOpen: Boolean;
  @Input() options: IConfiguratorPopup;
  @Output() onClose = new EventEmitter();
  @Output() onFinish = new EventEmitter<IConfiguratorPopup>();
  typeAB: number = 1;

  constructor (private translateService: TranslateService) {

  }

  close() {
    this.onClose.emit();
  }

  finish() {
    this.setValues();
    this.onFinish.emit(this.options);
    this.close();
  }

  onChange(event: number) {
    this.options.selectedValue = event;
  }

  onChangeA(event: number) {
    this.options.selectedValueA = event;
  }

  onChangeB(event: number) {
    this.options.selectedValueB = event;
  }

  setAmount() {
    if (this.options.amount === 0) {
      this.options.amount = 1;
    }
  }

  setValues() {
    this.setAmount();
    this.options.lengthValue = this.options.selectedValue;
    this.options.lengthValueA = this.options.selectedValueA;
    this.options.lengthValueB = this.typeAB === 2 ? this.options.selectedValueB : 0;
  }

  translate(key: string) {
    return this.translateService.instant(key);
  }
}
