import { Component } from '@angular/core';
import { Router } from '@angular/router';

import Constants = require('../../backend/constants');
import { AppService } from '../app.service';

@Component({
  selector: 'login-page',
  templateUrl: 'login-page.template.html',
})
export class LoginPage {
/*  loginName: string;
  password: string;
  isError: Boolean;
  isFilled: Boolean = true;
  appService: AppService;

  constructor(private router: Router, private api: ApiService) {
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
        let data: any = res.json();
        if (data.isLogged) {
          this.appService.setLogged(true);
          this.appService.setLoginName(this.loginName);
          this.appService.setUser(data);

          this.router.navigate([Constants.PATHS.HOMEPAGE]);
        } else {
          this.isError = true;
          this.appService.setLogged(false);
        }
      });
  }

  onSubmit() {
    this.login();
  }*/
}
