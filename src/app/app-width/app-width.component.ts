//import { isBrowser } from 'angular2-universal';

import {Directive, ElementRef, Inject, OnInit} from '@angular/core';

import { AppService } from '../app.service';

declare var $: any;

@Directive({
  selector: '[app-width]'
})

export class AppWidth implements OnInit {
  constructor(private _elRef: ElementRef, @Inject('isBrowser') private isBrowser: Boolean) {}

  ngOnInit() {
    if (this.isBrowser) {
      let appWidth = $(this._elRef.nativeElement).outerWidth();
      AppService.getInstance().setAppWidth(appWidth);
    }
  }
}
