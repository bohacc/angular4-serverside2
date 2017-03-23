import {Component, ElementRef, Input} from '@angular/core';
import {AppService} from "../app.service";
import {ToolsService} from "../shared/tools.service";
import {ActivatedRoute, Router} from "@angular/router";
import {IConfiguratorPopup} from "../configurator-popup/configurator-popup.interface";
import Constants = require('../../backend/constants');
import {ApiService} from "../shared/api.service";
import {TranslateService} from "../pipes/translate/translate.service";
import {TranslatePipe} from "../pipes/translate/translate.pipe";

declare var $: any;

@Component({
  selector: 'configurator',
  templateUrl: 'configurator.template.html',
})

export class Configurator {
  @Input() type: number = 1;
  product: any = {};
  childs: Array<any> = [];
  accessories: Array<any> = [];
  tabsState: number;
  tabsStateHover: number;
  amount: string;
  redirect: string;
  toolsService: ToolsService;
  appService: AppService;
  inConfiguration: Boolean = true;
  configuration: any = {};
  popupShow: Boolean = false;
  optionsNotComplete: Boolean = false;
  inProcess: Boolean = false;
  formatNumber1: string;
  formatNumber2: string;

  constructor(
    private _elRef: ElementRef,
    private route: ActivatedRoute,
    private api: ApiService,
    private router: Router,
    private translate: TranslateService
  ) {
    this.formatNumber1 = Constants.FORMAT_NUMBER_1;
    this.formatNumber2 = Constants.FORMAT_NUMBER_2;
    this.toolsService = ToolsService.getInstance();
    this.appService = AppService.getInstance();
    this.initConfiguration();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.redirect = params['redirect'];
      this.getRecord();
    });
  }

  getRecord() {
    this.api.get('/products/' + this.redirect + '/configurator/' + this.type)
      .subscribe(res => {
        let data: any = res.json();
        this.product = data;
        this.initConfiguration();
        this.validateConfiguration();
        this.getChilds();
        this.getAccessories();
      });
  }

  validateConfiguration() {
    this.optionsNotComplete = !(
      this.configuration.id
      && this.configuration.code
      && this.configuration.price > 0
      && this.configuration.unit
      && (this.configuration.minValue > 0 || this.configuration.minValue === 0)
      && this.configuration.maxValue > 0
      && (this.configuration.defaultValue > 0 || this.configuration.defaultValue === 0)
      && this.configuration.step > 0
      && this.configuration.codeA
      && (this.configuration.priceA > 0 || this.type === 2)
      && this.configuration.unitA
      && (this.configuration.minValueA > 0 || this.configuration.minValueA === 0)
      && this.configuration.maxValueA > 0
      && (this.configuration.defaultValueA > 0 || this.configuration.defaultValueA === 0)
      && this.configuration.stepA > 0
      && this.configuration.codeB
      && (this.configuration.priceB > 0 || this.type === 2)
      && this.configuration.unitB
      && (this.configuration.minValueB > 0 || this.configuration.minValueB === 0)
      && this.configuration.maxValueB > 0
      && (this.configuration.defaultValueB > 0 || this.configuration.defaultValueB === 0)
      && this.configuration.stepB > 0
    );
  }

  initConfiguration() {
    this.configuration.id = this.product.id;
    this.configuration.currency = this.product.currency;
    this.configuration.code = this.product.code;
    this.configuration.price = this.product.price;
    this.configuration.priceComplete = 0;
    this.configuration.amount = 0;
    this.configuration.step = this.product.step;
    this.configuration.availability = this.product.availability;
    this.configuration.unit = 'mm';
    this.configuration.lengthValue = 0;
    this.configuration.value = 0;
    this.configuration.minValue = this.product.minValue;
    this.configuration.maxValue = (this.product.maxValue || (this.type == 1 ? 5000 : 2000));
    this.configuration.maxValue2 = (this.product.maxValue2 || 8000);
    this.configuration.defaultValue = this.product.defaultValue;
    this.configuration.unitA = 'm';
    this.configuration.priceA = this.product.priceA;
    this.configuration.codeA = this.product.codeA;
    this.configuration.stepA = 0.0500;
    this.configuration.lengthValueA = 0;
    this.configuration.valueA = 0;
    this.configuration.minValueA = 0.0500;
    this.configuration.maxValueA = 10;
    this.configuration.defaultValueA = 0.0500;
    this.configuration.unitB = 'm';
    this.configuration.priceB = this.product.priceB;
    this.configuration.codeB = this.product.codeB;
    this.configuration.stepB = 0.0500;
    this.configuration.lengthValueB = 0;
    this.configuration.valueB = 0;
    this.configuration.minValueB = 0.0500;
    this.configuration.maxValueB = 10;
    this.configuration.defaultValueB = 0.0500;
  }

  getAccessories() {
    if (!this.product.id) {
      return;
    }
    this.api.get('/products/' + this.product.id + '/accessories')
      .subscribe(res => {
        let data: any = res.json();
        this.accessories = data;
      });
  }

  getChilds() {
    if (!this.product.id) {
      return;
    }
    this.api.get('/products/' + this.product.id + '/childs')
      .subscribe(res => {
        let data: any = res.json();
        this.childs = data;
      });
  }

  open() {
    this.popupShow = true;
    $("html, body").animate({ scrollTop: 200 }, "slow");
  }

  close() {
    this.popupShow = false;
    $("html, body").animate({ scrollTop: $(".product_detail .footer").offset().top }, "slow");
  }

  scrollToSelect() {
    let obj = this._elRef.nativeElement;
    this.toolsService.scrollToSelect(obj, ".product_detail .footer");
  }

  plus(item: {amount: number}) {
    item.amount += 1;
    this.initSaveButton();
  }

  minus(item: {amount: number}) {
    if (item.amount === 0) {
      return;
    }
    item.amount -= 1;
    this.initSaveButton();
  }

  initSaveButton() {
    let iterAmount = function (el) {
      if (el.amount > 0) {
        entries += 1;
      }
    };
    let entries: number = 0;

    // CONFIGURATION
    entries = (this.configuration.lengthValue && this.configuration.lengthValueA) ? this.configuration.amount : 0;

    // CHILDS
    this.childs.map(iterAmount);

    // ACCESSORIES
    this.accessories.map(iterAmount);

    this.inConfiguration = entries === 0;
  }

  onDoneConfiguration(obj: IConfiguratorPopup) {
    this.recalculate(obj);
    this.inConfiguration = false;
  }

  recalculate(obj: IConfiguratorPopup) {
    let koef = 0.001;
    let koefA = 1;
    let koefB = 1;
    let lV = this.configuration.lengthValue * koef;
    let lVA = this.configuration.lengthValueA * koefA;
    let lVB = this.configuration.lengthValueB * koefB;
    let price = this.configuration.price;
    let priceA = this.configuration.priceA;
    let priceB = this.configuration.priceB;
    this.configuration.value = lV;
    this.configuration.valueA = lVA;
    this.configuration.valueB = lVB;
    this.configuration.priceComplete = ((lV * price) + (lVA * priceA) + (lVB * priceB)).toFixed(2);

  }

  getPrepareObjForCart(): any {
    let obj:any = {};
    let filter = function (el) {
      return el.amount > 0;
    };
    obj.configuration = this.configuration;
    obj.accessories = this.accessories.filter(filter);
    obj.childs = this.childs.filter(filter);
    return obj;
  }

  buy() {
    if (this.inProcess) {
      return;
    }
    this.inProcess = true;
    this.api.post('/configurator/cart', this.getPrepareObjForCart())
      .subscribe(
        res => {
          this.inProcess = false;
          let data:any = res.json();
          if (!data.error) {
           this.router.navigate([Constants.PATHS.CART]);
          } else {
           alert(this.translate.instant(Constants.ERROR_BUY));
          }
        },
        res=> {
          this.inProcess = false;
        }
      )
  }
}
