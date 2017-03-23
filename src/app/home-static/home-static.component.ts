import { Component } from '@angular/core';

import { AppService } from '../app.service';
import {ApiService} from "../shared/api.service";
import {TranslateService} from "../pipes/translate/translate.service";
let Constants = require('../../backend/constants');

@Component({
  selector: 'home-static',
  templateUrl: 'home-static.template.html',
})
export class HomeStatic {
  appService: AppService;
  bodyClass: Boolean = false;

  constructor(private api: ApiService, private translate: TranslateService) {
    this.appService = AppService.getInstance();
    //this.translate.use(Constants.CZECH_COUNTRY_CODE);
    this.api.get('/language')
      .subscribe(res => {
        let data: any = res.json();
        this.translate.use(data.language);
      });
  }

  ngOnInit() {
    /*this.api.get('/language')
      .subscribe(res => {
        let data: any = res.json();
        this.translate.use(data.language);
      });*/
  }

  onResize(event) {
    //this.appService.setAppWidth(event.target.innerWidth);
    //this.appService.refreshWidth();
  }
}
