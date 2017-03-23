import {Component, AfterViewInit, Inject} from '@angular/core';
import {ActivatedRoute, Router, NavigationStart} from '@angular/router';

let Constants = require('../../backend/constants');
import { AppService } from '../app.service';
import {ApiService} from "../shared/api.service";
import {TranslateService} from "../pipes/translate/translate.service";
import {Title, DOCUMENT} from "@angular/platform-browser";
//import {isBrowser} from "angular2-universal";
import {MetaService} from "../shared/meta.service";

declare var $: any;

@Component({
  selector: 'home',
  templateUrl: 'home.template.html',
  providers: [
    MetaService
  ]
})

export class Home implements AfterViewInit {
  objects: any;
  appService: AppService;
  bodyClass: Boolean = false;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private translate: TranslateService,
    private metaService: MetaService,
    private router: Router,
    @Inject('isBrowser') private isBrowser: Boolean
  ){
    this.appService = AppService.getInstance();
  }

  ngOnInit() {
    this.initScroll();
    this.objects = {"content": []};
    this.route.params.subscribe(params => {
      let code = params['code'] || 'homepage';
      this.api.get('/load-objects/redirect/' + code)
        .subscribe(res => {
            let data: any = res.json();
            // SET TRANSLATE
            this.translate.use(data.language);
            this.metaService.setTitle(data);
            this.metaService.setMeta();
            this.objects.content = data.items;
            this.bodyClass = data.items[0] ? data.items[0].bodyClass == 1 : false;
            this.appService.setPageId(data.items[0] ? data.items[0].idPage : null);
            this.appService.setTableName(data.items[0] ? data.items[0].tableName : null);
            this.appService.setLanguage(data.language);
            this.appService.setPasswordPattern(data.passwordPattern);
          },
          res => {
            console.log(res);
          });
      this.appService.setPath(code);
    });
  }

  ngAfterViewInit() {
    this.appService.refreshWidth();
  }

  onResize(event) {
    this.appService.setAppWidth(event.target.innerWidth);
    this.appService.refreshWidth();
  }

  initScroll() {
    if (this.isBrowser) {
      this.route.fragment.subscribe(f => {
        if (f) {
          setTimeout(function () {
            var aTag = $('#' + f);
            let pos = (aTag.offset() ? aTag.offset().top : 0) || 0;
            $('html,body').animate({scrollTop: pos}, 0);
          }, 1000);
        }
      });

      this.router.events.subscribe((event) => {
        if(event instanceof NavigationStart) {
          if (event.url && event.url.indexOf(Constants.HASH) < 0) {
            $('html,body').animate({scrollTop: 0}, 0);
          }
        }
      });
    }
  }
}
