import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { Tools } from '../../backend/tools';
import Constants = require('../../backend/constants');
import {TranslateService} from "../pipes/translate/translate.service";

@Component({
  selector: 'login-newsletter',
  templateUrl: 'login-newsletter.template.html',
})
export class LoginNewsletter {
  aEmail: string;

  constructor(private http: Http, private translate: TranslateService) {
  }

  loginNews() {
    if (this.aEmail && Tools.validateEmail(this.aEmail)) {
      this.http.post('/newsletter/login', {email: this.aEmail})
        .subscribe(res => {
          this.aEmail = '';
          alert(this.translate.instant(Constants.MESSAGE_NEWSLETTER_SUCCESS));
        });
    } else {
      alert(this.translate.instant(Constants.MESSAGE_NEWSLETTER_INVALID));
    }
  }
}
