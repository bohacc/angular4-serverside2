import {Component, Input} from "@angular/core";
import {TranslateService} from "../pipes/translate/translate.service";
let Constants = require('../../backend/constants');

@Component({
  selector: 'record-tabs',
  templateUrl: 'record-tabs.template.html'
})

export class RecordTabs {
  @Input() product: any;
  tabsState: number;
  tabsStateHover: number;
  downloadAttType: string;

  constructor(private translate: TranslateService) {

  }

  ngOnInit() {
    this.tabsState = 1;
    this.setDownloadAttType();
  }

  public setTabState(index) {
    this.tabsState = index;
  }

  public setHover(index) {
    this.tabsStateHover = index;
  }

  setDownloadAttType() {
    if (this.translate.currentLang === Constants.AUT_COUNTRY_CODE) {
      this.downloadAttType = Constants.DOWNLOAD_TYPE_PRODUCT_AT;
    }
    if (this.translate.currentLang === Constants.CZECH_COUNTRY_CODE) {
      this.downloadAttType = Constants.DOWNLOAD_TYPE_PRODUCT_CZ;
    }
  }
}
