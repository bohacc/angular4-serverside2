import {Component, Input, Output, EventEmitter} from "@angular/core";
import {ApiService} from "../shared/api.service";
import Constants = require('../../backend/constants');
import {TranslateService} from "../pipes/translate/translate.service";
import {Tools} from "../../backend/tools";

@Component({
  selector: 'assist',
  templateUrl: 'assist.template.html'
})

export class Assist {
  @Input() isOpen: Boolean;
  @Input() product: any = {};
  @Output() onClose = new EventEmitter();
  formData: any = {email: null, fullName: null, text: null, product: {}};

  constructor (private api: ApiService, private translate: TranslateService) {

  }

  save() {
    if (!this.verify()) {
      return;
    }
    this.formData.secure = Constants.SECURE_FORM_CODE;
    this.formData.product = this.product;
    this.api.post('/assist/message', this.formData)
      .subscribe(res => {
        let data: any = res.json();
        if (data.state == '1') {
          this.close();
          alert(this.translate.instant(Constants.MESSAGE_ASSIST_SUCCESS));
        } else {
          alert(this.translate.instant(Constants.MESSAGE_ASSIST_ERROR));
        }
      });
  }

  verify(): Boolean {
    let msg: string = '', state: Boolean = true;
    if (state && !this.formData.email) {
      state = false;
      msg = this.translate.instant(Constants.MESSAGE_EMAIL_NOT_FILLED);
    }
    if (state && this.formData.email && !Tools.validateEmail(this.formData.email)) {
      state = false;
      msg = this.translate.instant(Constants.MESSAGE_EMAIL_VALIDATE);
    }
    if (state && !this.formData.fullName) {
      state = false;
      msg = this.translate.instant(Constants.MESSAGE_FIRSTNAME_NOT_FILLED);
    }
    if (!state && msg) {
      alert(msg);
    }
    return state;
  }

  close() {
    this.onClose.emit();
  }
}
