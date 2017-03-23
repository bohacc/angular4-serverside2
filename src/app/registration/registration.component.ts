import {Component, Input} from '@angular/core';
import {Router} from "@angular/router";

import {AppService} from "../app.service";
import { Tools } from '../../backend/tools';
import { ISelectBox } from '../select-box/select-box.interface';
import {ApiService} from "../shared/api.service";
import {TranslateService} from "../pipes/translate/translate.service";
import {ISelectBoxSex} from "../select-box/ISelectBoxSex";
let Constants = require('../../backend/constants');

@Component({
  selector: 'registration',
  templateUrl: 'registration.template.html'
})

export class Registration {
  @Input() type: number;
  @Input() userCache: any;
  appService: AppService;
  user: any;
  httpSubscription: any;
  inProcess: Boolean = false;
  countries: Array<ISelectBox> = [];
  countriesDelivery: Array<ISelectBox> = [];
  sex: Array<ISelectBoxSex> = [];
  isOpenConditions: Boolean = false;
  defaultSex: ISelectBoxSex;
  placeholderRegId: string;
  placeholderVatId: string;
  store: any = {user: {b2b: null}};

  constructor (private api: ApiService, private router: Router, private translate: TranslateService) {
    this.appService = AppService.getInstance();
    this.user = {
      login: '',
      password: '',
      passwordConfirm: '',
      firstName: '',
      LastName: '',
      email: '',
      phone: '',
      city: '',
      street: '',
      zip: '',
      country: '',
      companyName: '',
      regId: '',
      vatId: '',
      firstNameDelivery: '',
      lastNameDelivery: '',
      companyNameDelivery: '',
      cityDelivery: '',
      streetDelivery: '',
      zipDelivery: '',
      countryDelivery: '',
      saveAsNewUser: false,
      note: '',
      newsletter: true,
      sex: '',
      sexNamePrefix: '',
      bussinesScope: '',
      webAddr: '',
      conditions: true
    };

    this.sex = Constants.SEX;
  }

  ngOnInit() {
    this.store = this.appService.getStore();
    if (this.userCache) {
      this.user = this.userCache;
      this.setDefault();
    } else {
      this.getUser();
    }
    this.getCountries();
    this.setLocalize();
  }

  ngOnChanges(changes) {
    if (changes.userCache && changes.userCache.currentValue) {
      this.user = changes.userCache.currentValue;
      this.setDefault();
    }
  }

  getUser() {
    this.api.get('/user')
      .subscribe(res => {
        let data: any = res.json();
        this.user = data;
        this.setDefault();
      })
  }

  save() {
    if (this.user.isLogged) {
      this.put();
    } else {
      this.post();
    }
  }

  saveCurrent() {
    if (this.user.saveAsNewUser) {
      this.user.login = this.user.email;
    }
    this.postCurrent();
  }

  post() {
    this.user.saveAsNewUser = true;
    if (!this.validatePost()) {
      return;
    }
    if (this.httpSubscription) {
      this.httpSubscription.unsubscribe();
    }
    this.inProcess = true;
    this.httpSubscription = this.api.post('/user', this.user)
      .subscribe(
        res => {
          this.inProcess = false;
          let data:any = res.json();
          if (data.error) {
            /*if (data.message) {
              alert(this.translate.instant(data.message));
            } else {
              alert(this.translate.instant(Constants.MESSAGE_CREATE_USER_ERROR));
            }*/
            alert(this.translate.instant(Constants.MESSAGE_CREATE_USER_ERROR));
            return;
          }
          if (data.userExist) {
            alert(this.translate.instant(Constants.MESSAGE_EXIST_USER));
            return;
          }
          // IF CONDITIONS B2B THEN OPEN DIALOG THEN REG SUCCESS
          this.registrationSuccess();
        },
        res => {
          this.inProcess = false;
        }
      );
  }

  put() {
    if (!this.validatePut()) {
      return;
    }
    if (this.httpSubscription) {
      this.httpSubscription.unsubscribe();
    }
    this.inProcess = true;
    this.httpSubscription = this.api.put('/user', this.user)
      .subscribe(
        res => {
          this.inProcess = false;
          let data:any = res.json();
          if (data.error) {
            /*if (data.message) {
              alert(this.translate.instant(data.message));
            } else {
              alert(this.translate.instant(Constants.MESSAGE_UPDATE_USER_ERROR));
            }*/
            alert(this.translate.instant(Constants.MESSAGE_UPDATE_USER_ERROR));
            return;
          }
          alert(this.translate.instant(Constants.MESSAGE_UPDATE_USER_SUCCESS));
        },
        res => {
          this.inProcess = false;
        }
      );
  }

  postCurrent() {
    if (this.inProcess) {
      return;
    }
    if (!this.validatePost()) {
      return;
    }
    if (this.httpSubscription) {
      this.httpSubscription.unsubscribe();
    }
    this.inProcess = true;
    this.httpSubscription = this.api.post('/user/current', this.user)
      .subscribe(
        res => {
          this.inProcess = false;
          let data:any = res.json();
          if (data.userExist) {
            alert(this.translate.instant(Constants.MESSAGE_EXIST_USER_EMAIL));
          } else {
            this.router.navigate([Constants.PATHS.ORDER_SHIPPING_AND_PAYMENT]);
          }
        },
        res => {
          this.inProcess = false;
        }
      );
  }

  validateLogin(): Boolean {
    if (!this.user.saveAsNewUser) {
      return true;
    }
    if (!this.user.login) {
      alert(this.translate.instant(Constants.MESSAGE_LOGIN_NOT_FILLED));
      return false;
    }
    if (!Tools.validateEmail(this.user.login)) {
      alert(this.translate.instant(Constants.MESSAGE_LOGIN_VALIDATE));
      return false;
    }
    if (!this.user.password) {
      alert(this.translate.instant(Constants.MESSAGE_PASSWORD_NOT_FILLED));
      return false;
    }
    if (this.store.passwordPattern && !(new RegExp(this.store.passwordPattern)).test(this.user.password)) {
      alert(this.translate.instant(Constants.MESSAGE_PASSWORD_NOT_VALID));
      return false;
    }
    if (!this.user.confirmPassword) {
      alert(this.translate.instant(Constants.MESSAGE_CONFIRM_PASSWORD_NOT_FILLED));
      return false;
    }
    if (this.user.password != this.user.confirmPassword) {
      alert(this.translate.instant(Constants.MESSAGE_CONFIRM_PASSWORD_NOT_SAME));
      return false;
    }

    return true;
  }

  validateUser(): Boolean {
    if (!this.user.firstName) {
      alert(this.translate.instant(Constants.MESSAGE_FIRSTNAME_NOT_FILLED));
      return false;
    }
    if (!this.user.lastName) {
      alert(this.translate.instant(Constants.MESSAGE_LASTNAME_NOT_FILLED));
      return false;
    }
    // ONLY FOR TYPE 2, NO REGISTRATION, THERE IS LOGIN EMAIL
    if (!this.user.email && this.type==2) {
      alert(this.translate.instant(Constants.MESSAGE_EMAIL_NOT_FILLED));
      return false;
    }
    if (!Tools.validateEmail(this.user.email)) {
      alert(this.translate.instant(Constants.MESSAGE_EMAIL_VALIDATE));
      return false;
    }
    if (!this.user.phone) {
      alert(this.translate.instant(Constants.MESSAGE_PHONE_NOT_FILLED));
      return false;
    }
    if (this.user.phone && !Tools.validatePhone(this.user.phone)) {
      alert(this.translate.instant(Constants.MESSAGE_PHONE_VALIDATE));
      return false;
    }
    if (!this.user.city) {
      alert(this.translate.instant(Constants.MESSAGE_CITY_NOT_FILLED));
      return false;
    }
    if (!this.user.street) {
      alert(this.translate.instant(Constants.MESSAGE_STREET_NOT_FILLED));
      return false;
    }
    if (!this.user.zip) {
      alert(this.translate.instant(Constants.MESSAGE_ZIP_NOT_FILLED));
      return false;
    }
    if (this.user.zip && !Tools.validateZip(this.user.zip)) {
      alert(this.translate.instant(Constants.MESSAGE_ZIP_VALIDATE));
      return false;
    }
    if (this.user.toCompany && !this.validateCompany()) {
      return false;
    }

    // DELIVERY
    if (this.user.deliveryIsNotInvoice && this.type==2 && !this.user.firstNameDelivery) {
      alert(this.translate.instant(Constants.MESSAGE_FIRSTNAME_NOT_FILLED));
      return false;
    }
    if (this.user.deliveryIsNotInvoice && this.type==2 && !this.user.lastNameDelivery) {
      alert(this.translate.instant(Constants.MESSAGE_LASTNAME_NOT_FILLED));
      return false;
    }
    if (this.user.deliveryIsNotInvoice && !this.user.cityDelivery) {
      alert(this.translate.instant(Constants.MESSAGE_CITY_NOT_FILLED));
      return false;
    }
    if (this.user.deliveryIsNotInvoice && !this.user.streetDelivery) {
      alert(this.translate.instant(Constants.MESSAGE_STREET_NOT_FILLED));
      return false;
    }
    if (this.user.deliveryIsNotInvoice && !this.user.zipDelivery) {
      alert(this.translate.instant(Constants.MESSAGE_ZIP_NOT_FILLED));
      return false;
    }
    if (this.user.deliveryIsNotInvoice && this.user.zipDelivery && !Tools.validateZip(this.user.zipDelivery)) {
      alert(this.translate.instant(Constants.MESSAGE_ZIP_VALIDATE));
      return false;
    }

    return true;
  }

  validateCompany() {
    if (!this.user.companyName) {
      alert(this.translate.instant(Constants.MESSAGE_COMPANY_NAME_NOT_FILLED));
      return false;
    }
    if (this.user.conditions) {
      if (!this.user.regId) {
        alert(this.translate.instant(Constants.MESSAGE_REGID_NOT_FILLED));
        return false;
      }
      if (!this.user.vatId) {
        alert(this.translate.instant(Constants.MESSAGE_VATID_NOT_FILLED));
        return false;
      }
      if (this.store.isAustria && this.user.vatId && (this.user.vatId.length < 7 || this.user.vatId.length > 12)) {
        alert(this.translate.instant(Constants.MESSAGE_VATID_VALIDATE));
        return false;
      }
    }
    return true;
  }

  validatePost(): Boolean {
    if (!this.validateLogin()) {
      return false;
    }
    if (!this.validateUser()) {
      return false;
    }
    return true;
  }

  validatePut(): Boolean {
    if (!this.validateUser()) {
      return false;
    }
    return true;
  }

  orderSaveUser() {
    this.saveCurrent();
  }

  onSelectState(item: ISelectBox, model: string) {
    this.user[model] = item.val;
  }

  onSelectSex(item: any, model: string) {
    this.user[model] = item.sex;
    this.user.sexNamePrefix = this.translate.instant(item.val);
  }

  getCountries() {
    this.api.get('/user/countries')
      .subscribe(res => {
        var data: any = res.json();
        this.countries = data.countries;
        this.countriesDelivery = data.countriesDelivery;
      });
  }

  openConditionsDialog() {
    this.isOpenConditions = (this.user.conditions ? true : false);
    return this.isOpenConditions;
  }

  closeDialogConditions() {
    this.isOpenConditions = false;
    this.successPage();
  }

  registrationSuccess() {
    if (!this.openConditionsDialog()) {
      this.successPage();
    };
  }

  successPage() {
    this.router.navigate([Constants.PATHS.NEW_USER_SUCCESS]);
  }

  setDefault() {
    if (!this.user.isLogged) {
      this.user.saveAsNewUser = true;
    }
    this.setDefaultSex();
  }

  setDefaultSex() {
    let _this = this;
    this.defaultSex = this.sex.filter(function(el) {
      return _this.user.sex === el.sex;
    })[0];
  }

  onLoginChange() {
    if (this.type == 1)  {
      this.user.email = this.user.login;
    }
  }

  setLocalize() {
    this.placeholderRegId = this.store.isAustria ? 'FN 99999d' : '';
    this.placeholderVatId = this.store.isAustria ? 'ATU 99999999' : '';
  }
}
