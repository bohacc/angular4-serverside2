import {LOCALE_ID, NgModule}                    from '@angular/core'
import { BrowserModule }               from '@angular/platform-browser'
import { APP_BASE_HREF, CommonModule } from '@angular/common'
import {FormsModule, ReactiveFormsModule}         from '@angular/forms'
import { HttpModule }                  from '@angular/http'
import { RouterModule }                from '@angular/router'

import { AuthModule, authReducer }      from './auth'
import { CreateModule }                 from './create/create.module'
import { DiscoverModule }               from './discover'
import { AboutModule }                  from './+about'
import { ContactModule }                from './+contact'
import { ExploreModule }                from './+explore/explore.module'
import { HelpModule }                   from './+help/help.module'
import { HighlightsModule }             from './+highlights/highlights.module'
import { JobsModule }                   from './+jobs/jobs.module'
import { ProjectModule }                from './+project/project.module'
import { SearchModule }                 from './+search/search.module'
import { SettingsModule }               from './+settings/settings.module'
import { TeamModule }                   from './+team/team.module'
import { TermsModule }                  from './+terms/terms.module'
import { TrendingModule }               from './+trending/trending.module'
import { UserModule }                   from './+user/user.module'

import { SharedModule }                 from './shared'

import { AppRoutingModule, AppComponent } from './'

import { Home } from './home/home.component';
import { MyFilterArray } from './pipes/my-filter-array.pipe';
import { SectionObject } from './section-object/section-object.component';
import { HtmlOutlet3 } from './html-outlet3/html-outlet3.component';
import { HtmlOutlet4 } from './html-outlet4/html-outlet4.component';
import { Test } from './test/test.component';
import { PageHeader } from './page-header/page-header.component';
import { ShopCategories } from './shop-categories/shop-categories.component';
import { LoginHeader } from './login-header/login-header.component';
import { SlidesComponent } from './slides/slides.component';
import { Carousel } from './carousel/carousel.component';
import { SlidesObj } from './slides-obj/slides-obj.component';
import {HomeStatic} from "./home-static/home-static.component";
import {LoginNewsletter} from "./login-newsletter/login-newsletter.component";
import {BannerMcled} from "./banner-mcled/banner-mcled.component";
import {DeliveryFree} from "./delivery-free/delivery-free.component";
import {ProductsHomepage} from "./products-homepage/products-homepage.component";
import {ArticlesHomepage} from "./articles-homepage/articles-homepage.component";
import {Copyright} from "./copyright/copyright.component";
import {Footer} from "./footer/footer.component";
import {CarouselPartners} from "./carousel-partners/carousel-partners.component";
import {Partners} from "./partners/partners.component";
import {LoginPage} from "./login-page/login-page.component";
import {RedirectNavigation} from "./redirect-navigation/redirect-navigation.component";
import {ListItem} from "./list-item/list-item.component";
import {List3Item} from "./list3-item/list3-item.component";
import {List4Item} from "./list4-item/list4-item.component";
import {SelectBox} from "./select-box/select-box.component";
import {List} from "./list/list.component";
import {Attachments} from "./attachments/attachments.component";
import {CarouselVertical} from "./carousel-vertical/carousel-vertical.component";
import {List2} from "./list2/list2.component";
import {ListFilter} from "./list-filter/list-filter.component";
import {ListFilterBasic} from "./list-filter-basic/list-filter-basic.component";
import {ListFilterAdvanced} from "./list-filter-advanced/list-filter-advanced.component";
import {ListFilterBasicCustom1} from "./list-filter-basic-custom-1/list-filter-basic-custom-1.component";
import {ListFilterBasicCustom2} from "./list-filter-basic-custom-2/list-filter-basic-custom-2.component";
import {ListFilterBasicCustom3} from "./list-filter-basic-custom-3/list-filter-basic-custom-3.component";
import {ListFilterBasicCustom4} from "./list-filter-basic-custom-4/list-filter-basic-custom-4.component";
import {ListFilterBasicCustom5} from "./list-filter-basic-custom-5/list-filter-basic-custom-5.component";
import {ListFilterBasicCustom6} from "./list-filter-basic-custom-6/list-filter-basic-custom-6.component";
import {ListFilterBasicCustom7} from "./list-filter-basic-custom-7/list-filter-basic-custom-7.component";
import {ListFilterBasicCustom8} from "./list-filter-basic-custom-8/list-filter-basic-custom-8.component";
import {ListFilterBasicCustom9} from "./list-filter-basic-custom-9/list-filter-basic-custom-9.component";
import {Pagination} from "./pagination/pagination.component";
import {SimilarProducts} from "./similar-products/similar-products.component";
import {Record} from "./record/record.component";
import {Configurator} from "./configurator/configurator.component";
import {ShopCategoriesObj} from "./shop-categories-obj/shop-categories-obj.component";
import {ShopCategoriesDevObj} from "./shop-categories-dev-obj/shop-categories-dev-obj.component";
import {ShopCategoriesDev} from "./shop-categories-dev/shop-categories-dev.component";
import {ListObj} from "./list-obj/list-obj.component";
import {List3Obj} from "./list3-obj/list3-obj.component";
import {List4Obj} from "./list4-obj/list4-obj.component";
import {ScrollBarWidth} from "./scrollbar-width/scrollbar-width";
import {AppWidth} from "./app-width/app-width.component";
import {MenuSetActive} from "./menu-set-active/menu-set-active.component";
import {Cart} from "./cart/cart.component";
import {CartPage} from "./cart-page/cart-page.component";
import {OrderHeader} from "./order-header/order-header.component";
import {Registration} from "./registration/registration.component";
import {OrderStep1} from "./order-step1/order-step1.component";
import {OrderStep2} from "./order-step2/order-step2.component";
import {OrderStep3} from "./order-step3/order-step3.component";
import {OrderStep4} from "./order-step4/order-step4.component";
import {OrderPersonalData} from "./order-personal-data/order-personal-data.component";
import {OrderShippingAndPayment} from "./order-shipping-and-payment/order-shipping-and-payment.component";
import {OrderSummary} from "./order-summary/order-summary.component";
import {OrderSuccess} from "./order-success/order-success.component";
import {SectionSW} from "./section-sw/section-sw.component";
import {RegistrationSuccess} from "./registration-success/registration-success.component";
import {Shipping} from "./shipping/shipping.component";
import {Payment} from "./payment/payment.component";
import {OrderSideBar} from "./order-side-bar/order-side-bar.component";
import {ShippingAndPayment} from "./shipping-and-payment/shipping-and-payment.component";
import {Login} from "./login/login.component";
import {RegistrationPage} from "./registration-page/registration-page.component";
import {SearchResultList} from "./search-result-list/search-result-list.component";
import {Slider} from "./slider/slider.component";
import {SliderCmp} from "./slider-cmp/slider-cmp.component";
import {RecordPart} from "./record-part/record-part.component";
import {ConfiguratorPopup} from "./configurator-popup/configurator-popup.component";
import {RecordTabs} from "./record-tabs/record-tabs.component";
import {Accessories} from "./accessories/accessories.component";
import {ConfiguratorPopup2} from "./configurator-popup2/configurator-popup2.component";
import {Assist} from "./assist/assist.component";
import {HttpInterceptor} from "./shared/http.service";
import {ApiService} from "./shared/api.service";
import {TranslatePipe} from "./pipes/translate/translate.pipe";
import {TRANSLATION_PROVIDERS} from "./pipes/translate/translation";
import {TranslateService} from "./pipes/translate/translate.service";
import {ListSimple} from "./list-simple/list-simple.component";
import {ShopCategoriesAt} from "./shop-categories-at/shop-categories-at.component";
import {ShopCategoriesObjAt} from "./shop-categories-obj-at/shop-categories-obj-at.component";
import {PageHeaderAt} from "./page-header-at/page-header-at.component";
import {List5Obj} from "./list5-obj/list5-obj.component";
import {ShippingAndDeliveryPopup} from "./shipping-and-delivery-popup/shipping-and-delivery-popup.component";
import {LostPassword} from "./lost-password/lost-password.component";



@NgModule({
  declarations: [
    AppComponent,
    Home,
    HomeStatic,
    SectionSW,
    MyFilterArray,
    SectionObject,
    HtmlOutlet3,
    HtmlOutlet4,
    PageHeader,
    ShopCategories,
    ShopCategoriesAt,
    LoginHeader,
    Test,
    SlidesComponent,
    Carousel,
    SlidesObj,
    LoginNewsletter,
    BannerMcled,
    DeliveryFree,
    ProductsHomepage,
    ArticlesHomepage,
    Copyright,
    Footer,
    CarouselPartners,
    Partners,
    LoginPage,
    RedirectNavigation,
    ListItem,
    List3Item,
    List4Item,
    SelectBox,
    List,
    Attachments,
    CarouselVertical,
    List2,
    ListFilter,
    ListFilterBasic,
    ListFilterAdvanced,
    ListFilterBasicCustom1,
    ListFilterBasicCustom2,
    ListFilterBasicCustom3,
    ListFilterBasicCustom4,
    ListFilterBasicCustom5,
    ListFilterBasicCustom6,
    ListFilterBasicCustom7,
    ListFilterBasicCustom8,
    ListFilterBasicCustom9,
    Pagination,
    SimilarProducts,
    Record,
    Configurator,
    ShopCategoriesObj,
    ShopCategoriesObjAt,
    ShopCategoriesDevObj,
    ShopCategoriesDev,
    ListObj,
    List3Obj,
    List4Obj,
    ScrollBarWidth,
    AppWidth,
    MenuSetActive,
    Cart,
    CartPage,
    OrderHeader,
    Registration,
    OrderStep1,
    OrderStep2,
    OrderStep3,
    OrderStep4,
    OrderPersonalData,
    OrderShippingAndPayment,
    OrderSummary,
    OrderSuccess,
    RegistrationSuccess,
    Shipping,
    Payment,
    OrderSideBar,
    ShippingAndPayment,
    Login,
    RegistrationPage,
    SearchResultList,
    Slider,
    SliderCmp,
    RecordPart,
    ConfiguratorPopup,
    RecordTabs,
    Accessories,
    ConfiguratorPopup2,
    Assist,
    TranslatePipe,
    ListSimple,
    PageHeaderAt,
    List5Obj,
    ShippingAndDeliveryPopup,
    LostPassword
  ],
  entryComponents: [
    Test,
    PageHeader,
    SlidesObj,
    Partners,
    PageHeader,
    LoginPage,
    RedirectNavigation,
    List,
    List2,
    Configurator,
    Record,
    ShopCategoriesObj,
    ShopCategoriesObjAt,
    ShopCategoriesDevObj,
    ListObj,
    List3Obj,
    List4Obj,
    SlidesComponent,
    CartPage,
    OrderStep1,
    OrderStep2,
    OrderStep3,
    OrderStep4,
    RegistrationSuccess,
    RegistrationPage,
    SearchResultList,
    ProductsHomepage,
    ListSimple,
    PageHeaderAt,
    LoginNewsletter,
    List5Obj,
    LostPassword
  ],
  imports: [
    SharedModule,
    AboutModule,
    AuthModule,
    ContactModule,
    CreateModule,
    DiscoverModule,
    ExploreModule,
    HelpModule,
    HighlightsModule,
    JobsModule,
    ProjectModule,
    SearchModule,
    SettingsModule,
    TeamModule,
    TermsModule,
    TrendingModule,
    UserModule,
    AppRoutingModule,
    FormsModule,
    BrowserModule,
  ],
	providers: [
    { provide: APP_BASE_HREF, useValue: '/'},
    ApiService,
    TRANSLATION_PROVIDERS,
    TranslateService,
    { provide: LOCALE_ID, useValue: "cs-CZ" },
  ],
})
export class AppModule {
}

export { AppComponent } from './app.component';
