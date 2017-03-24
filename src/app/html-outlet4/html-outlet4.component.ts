//our root app component
import {
  NgModule, Component, Compiler, ViewContainerRef, ViewChild, Input, ComponentRef, ComponentFactory,
  ComponentFactoryResolver, ElementRef, LOCALE_ID, Inject, ReflectiveInjector, Injector
} from '@angular/core'
import { FormsModule } from '@angular/forms';
import {AppService} from "../app.service";
import {BrowserModule} from "@angular/platform-browser";
import {AppRoutingModule} from "../app-routing.module";
import {COMPILER_PROVIDERS} from "@angular/compiler";
import { AppModule } from '../';
import {APP_BASE_HREF} from "@angular/common";
import {CommonAppModule} from "../_platform/app.common.module";
import {Home} from "../home/home.component";
import {SectionSW} from "../section-sw/section-sw.component";
import {SectionObject} from "../section-object/section-object.component";
import {MyFilterArray} from "../pipes/my-filter-array.pipe";
import {HtmlOutlet3} from "../html-outlet3/html-outlet3.component";
import {RouterModule} from "@angular/router";
let Constants = require('../../backend/constants');

declare var $: any;

// Helper component to add dynamic components
@Component({
  selector: 'dcl-wrapper-other',
  template: `<div #target></div>`
})
export class HtmlOutlet4 {
  @ViewChild('target', {read: ViewContainerRef}) target;
  @Input() html;
  @Input() args;
  cmpRef: ComponentRef<any>;
  private isViewInitialized:boolean = false;
  appService: AppService;
  store: any;
  private injector: Injector;
  private compiler: Compiler;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    //private compiler: Compiler,
    @Inject('isBrowser') private isBrowser: Boolean,
    injector: Injector
  ){
    this.injector = ReflectiveInjector.resolveAndCreate(COMPILER_PROVIDERS, injector);
    this.compiler = this.injector.get(Compiler);
    this.appService = AppService.getInstance();
    this.store = this.appService.getStore();
  }

  updateComponent() {
    if(!this.isViewInitialized) {
      return;
    }
    if(this.cmpRef) {
      this.cmpRef.destroy();
    }
    if (!this.html) {
      return;
    }

    let html = this.html;
    let args = this.args;
    @Component({
      template: html
    })
    class TemplateComponent {
      @Input() args;
      isLoaded: Boolean = false;
      isAustria: Boolean = false;

      constructor(private _elRef: ElementRef, @Inject('isBrowser') private isBrowser: Boolean) {}

      ngOnInit() {
        this.init();
      }

      ngOnChanges() {
        this.init();
      }

      setLanguageCode() {
        this.isAustria = this.args.language == Constants.AUT_COUNTRY_CODE;
      }

      init() {
        this.setLanguageCode();
        if (this.isBrowser && html.indexOf('slides') > -1) {
          //$(this._elRef.nativeElement).find('.js-hide').removeClass('hide');
          //$(this._elRef.nativeElement).find('.js-default').addClass('hide');
          this.isLoaded = true;

          $(require('../../../tools/js/jquery/slideshow/jquery.slides.js'));
          let count = $(this._elRef.nativeElement).find('.slides').find('.item').length;
          $(this._elRef.nativeElement).find('.slides').slidesjs({
            width: "100%",
            height: "100%",
            play: {
              active: (count > 1),
              effect: "fade",
              interval: (count > 1 ? 7000 : 999999999),
              auto: true,
              swap: false,
              pauseOnHover: false,
              restartDelay: 7000
            },

            menu_titles: {
              active: (count > 1)
            }
          });
        } else {
          if (html.indexOf('slides') > -1) {
            //this._elRef.nativeElement.classList.remove("hide");
          }
        }
      }
    }
    @NgModule({
      declarations: [
        TemplateComponent,
        Home,
        SectionSW,
        SectionObject,
        MyFilterArray,
        HtmlOutlet3,
        HtmlOutlet4
      ],
      imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        RouterModule
        //AppModule,
        //CommonAppModule
      ],
      providers: [
        { provide: 'isBrowser', useValue: this.isBrowser },
        { provide: 'isServer', useValue: !this.isBrowser },
      ]
    })
    class TemplateModule {}
    const mod = this.compiler.compileModuleAndAllComponentsSync(TemplateModule);
    const factory = mod.componentFactories.find((comp) =>
      comp.componentType === TemplateComponent
    );

    this.cmpRef = this.target.createComponent(factory);
    this.cmpRef.instance.args = this.args || {};
  }

  ngOnChanges() {
    this.updateComponent();
  }

  ngAfterViewInit() {
    this.isViewInitialized = true;
    this.updateComponent();
  }

  ngOnDestroy() {
    if(this.cmpRef) {
      this.cmpRef.destroy();
    }
  }
}
