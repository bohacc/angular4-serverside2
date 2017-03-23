import {Component, Input, Output, EventEmitter} from '@angular/core';
import {IConfiguratorPopup} from "../configurator-popup/configurator-popup.interface";
import {TranslateService} from "../pipes/translate/translate.service";

@Component({
  selector: 'configurator-popup2',
  templateUrl: 'configurator-popup2.template.html'
})

export class ConfiguratorPopup2 {
  @Input() isOpen: Boolean;
  @Input() options: IConfiguratorPopup;
  @Output() onClose = new EventEmitter();
  @Output() onFinish = new EventEmitter<IConfiguratorPopup>();

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

  setAmount() {
    if (this.options.amount === 0) {
      this.options.amount = 1;
    }
  }

  setValues() {
    this.setAmount();
    this.options.lengthValue = this.options.defaultValue;
  }

  translate(key: string) {
    return this.translateService.instant(key);
  }
}
