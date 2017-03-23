import {Component, Input, Output, EventEmitter} from '@angular/core';
import {AppService} from "../app.service";
import {Router} from "@angular/router";
import Constants = require('../../backend/constants');
import {ApiService} from "../shared/api.service";
import {TranslateService} from "../pipes/translate/translate.service";

@Component({
  selector: 'login',
  templateUrl: 'login.template.html'
})

export class Login {
  @Input() pathAfterLogin: string;
  @Output() onLogin = new EventEmitter<any>();
  loginName: string;
  password: string;
  isError: Boolean;
  isFilled: Boolean = true;
  appService: AppService;

  constructor(private router: Router, private api: ApiService, private translate: TranslateService) {
    this.appService = AppService.getInstance();
  }

  ngOnInit() {

  }

  login() {
    this.isError = false;

    this.isFilled = true;
    if (!this.loginName || !this.password) {
      this.isFilled = false;
      return;
    }

    this.api.post('/login', {login: this.loginName, password: this.password})
      .subscribe(res => {
        let data:any = res.json();
        if (data.isLogged) {
          this.onLogin.emit(data);

          let url = (this.pathAfterLogin || Constants.PATHS.HOMEPAGE);
          this.router.navigate([url]);
        } else {
          if (data.user && data.user.b2bWrongWebsite) {
            alert(
              this.translate.instant(Constants.B2B_WRONG_WEBSITE) +
              this.translate.instant(data.user.b2bState) +
              Constants.JS_END +
              this.translate.instant(Constants.B2B_WRONG_WEBSITE2) +
              data.user.b2bWebsiteUrl
            );
          }
          this.isError = true;
        }
      });
  }

  onSubmit() {
    this.login();
  }
}
