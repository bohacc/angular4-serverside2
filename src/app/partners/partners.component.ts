import {Component, ElementRef, Inject} from '@angular/core';
import {ApiService} from "../shared/api.service";
//import {isBrowser} from "angular2-universal";

declare var $: any;
declare var Zone: any;

@Component({
  selector: 'partners',
  templateUrl: 'partners.template.html',
})
export class Partners {
  items: Array<Object>;
  isInit: Boolean = false;
  showDefault: Boolean = true;

  constructor(private api: ApiService, private _elRef: ElementRef, @Inject('isBrowser') private isBrowser: Boolean) {

  }

  ngOnInit() {
    this.getData();
    if (this.isBrowser) {
      this.showDefault = false;
    }
  }

  getData() {
    this.api.get('/partners')
      .subscribe(res => {
        let data: any = res.json() || [];
        this.items = data;
        setTimeout(()=> {
          this.isInit = true;
        }, 300);
      });
  }
}
