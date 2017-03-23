import {Component, Input, EventEmitter, Output, ElementRef, ViewChild} from "@angular/core";
import {ToolsService} from "../shared/tools.service";
import {Router} from "@angular/router";
import Constants = require('../../backend/constants');
import {Carousel} from "../carousel/carousel.component";
import {ApiService} from "../shared/api.service";
import {AppService} from "../app.service";

@Component({
  selector: 'record-part',
  templateUrl: 'record-part.template.html'
})

export class RecordPart {
  @Input() product: any = {};
  @Input() type: number;
  @Input() inConfiguration: Boolean;
  @Output('onScrollToSelect') onScrollToSelect = new EventEmitter();
  @Output('onBuy') onBuy = new EventEmitter();
  @ViewChild(Carousel) carousel: Carousel;
  toolsService: ToolsService;
  amount: string;
  inProcess: Boolean = false;
  popupAssistShow: Boolean = false;
  smallPictures: Array<any> = [{}];
  bigPictures: Array<any> = [{}];
  isLoaded: Boolean = false;
  formatNumber1: string;
  formatNumber2: string;
  store: any = {user: {}};
  appService: AppService;

  constructor(private router: Router, private _elRef: ElementRef,  private api: ApiService) {
    this.appService = AppService.getInstance();
    this.toolsService = ToolsService.getInstance();
    this.formatNumber1 = Constants.FORMAT_NUMBER_1;
    this.formatNumber2 = Constants.FORMAT_NUMBER_2;
  }

  ngOnInit() {
    this.amount = '1';
    this.store = this.appService.getStore();
  }

  ngOnChanges(changes) {
    if (changes.product.currentValue && changes.product.currentValue.pictures) {
      this.isLoaded = true;
      this.smallPictures = changes.product.currentValue.pictures.filter(function (el) { return el.type === Constants.IMAGE_SMALL_TYPE});
      this.bigPictures = [];
      let arr = changes.product.currentValue.pictures.filter(function (el) { return el.type === Constants.IMAGE_BIG_TYPE});
      this.smallPictures.map((el, i) => {
        this.bigPictures.push(arr[i] || {fileName: Constants.EMPTY_IMAGE_FILENAME2});
      });
      setTimeout(()=> {
        this.initJqueryTools();
        this.carousel.init();
      }, 200);
    }
  }

  initJqueryTools() {
    let el = this._elRef.nativeElement;
    this.toolsService.initZoom(el);
    this.toolsService.initProductPreview(el);
    this.toolsService.initProductLightBox(el);
    this.toolsService.initVerticalPreview(el);
  }

  scrollToSelect() {
    this.onScrollToSelect.emit();
  }

  public minus() {
    if (parseInt(this.amount, 10) === 1) {
      this.amount = '1';
    } else {
      this.amount = String(parseInt(this.amount, 10) - 1);
    }
  }

  public plus() {
    this.amount = String(parseInt(this.amount, 10) + 1);
  }

  buy() {
    this.inProcess = true;
    this.api.post('/products/' + this.product.id + '/buy', {item: this.product, amount: this.amount})
      .subscribe(
        res => {
          this.inProcess = false;
          let data: any = res.json() || [];
          this.router.navigate([Constants.PATHS.CART]);
        },
        err => {
          this.inProcess = false;
          console.log(Constants.PRODUCT_ADD_TO_CART_ERROR);
        }
      );
  }

  extBuy() {
    this.onBuy.emit();
  }

  closeAssist() {
    this.popupAssistShow = false;
  }

  openAssist() {
    this.popupAssistShow = true;
  }
}
