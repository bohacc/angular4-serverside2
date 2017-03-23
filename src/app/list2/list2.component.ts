//import { isBrowser } from 'angular2-universal';

import {Component, Inject, Input} from '@angular/core';

import { AppService } from '../app.service';
import {ApiService} from "../shared/api.service";


declare var $: any;

@Component({
  selector: 'list2',
  templateUrl: 'list2.template.html',
})

export class List2 {
  @Input() args: any;
  tabsState: number = 1;
  tabsStateHover: number;
  appService: AppService;
  category: any = {id: null};

  constructor(private api: ApiService, @Inject('isBrowser') private isBrowser: Boolean) {
    this.appService = AppService.getInstance();
  }

  ngOnInit() {
    if (this.isBrowser) {
      //noinspection TypeScriptUnresolvedFunction
      $(require('../../../tools/js/jquery/ui/ui.product.img.previews.js'));
      //noinspection TypeScriptUnresolvedFunction
      $(require('../../../tools/js/jquery/ui/ui.vertical.img.previews.js'));
      //noinspection TypeScriptUnresolvedFunction
      $(require('../../../tools/js/jquery/ui/ui.product.img.lightbox.js'));
    }
    this.getData();
  }
  public setTabState(index: number) {
    this.tabsState = index;
  }

  public setHoverIn(index: number) {
    this.tabsStateHover = index;
  }

  public setHoverOut() {
    this.tabsStateHover = this.tabsState;
  }

  getData() {
    this.api.get('/cats/' + this.appService.getPath())
      .subscribe(res => {
        let data: any = res.json();
        this.category = data || {};
      });
  }
}
