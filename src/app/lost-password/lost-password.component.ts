import {Component} from "@angular/core";
import {ApiService} from "../shared/api.service";
import {TranslateService} from "../pipes/translate/translate.service";
import {Tools} from "../../backend/tools";
let Constants = require('../../backend/constants');

@Component({
  selector: 'lost-password',
  templateUrl: 'lost-password.template.html'
})

export class LostPassword {
  inProcess: Boolean = false;
  user: any = {email: null};

  constructor(private api: ApiService, private translate: TranslateService) {}

  validate() {
    if (!this.user.email) {
      alert(this.translate.instant(Constants.MESSAGE_EMAIL_NOT_FILLED));
      return false;
    }
    if (!Tools.validateEmail(this.user.email)) {
      alert(this.translate.instant(Constants.MESSAGE_EMAIL_VALIDATE));
      return false;
    }

    return true;
  }

  send() {
    if (!this.validate()) {
      return;
    }
    if (this.inProcess) {
      return;
    }
    this.inProcess = true;
    this.api.post('/lost-password', this.user)
      .subscribe(
        res => {
          this.inProcess = false;
          let data: any = res.json();
          if (data.error) {
            alert(this.translate.instant(Constants.MESSAGE_ERROR_LOST_PASSWORD));
          } else {
            alert(this.translate.instant(Constants.MESSAGE_SUCCESS_LOST_PASSWORD));
          }
        },
        res => {
          this.inProcess = false;
        }
      );
  }
}
