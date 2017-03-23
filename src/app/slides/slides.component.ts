//import { isBrowser } from 'angular2-universal';

import {Component, ElementRef, Inject, OnInit} from '@angular/core';

declare var $: any;

@Component({
  selector: '[slides]',
  template: '<ng-content></ng-content>'
})
export class SlidesComponent implements OnInit {
  constructor(private _elRef: ElementRef, @Inject('isBrowser') private isBrowser: Boolean) {}

  ngOnInit() {
    if (this.isBrowser) {
      $(require('../../../tools/js/jquery/slideshow/jquery.slides.js'));
      let count = $(this._elRef.nativeElement).find('.item').length;

      $(this._elRef.nativeElement).slidesjs({
        width: "100%",
        height: "100%",
        play: {
          active: (count > 1),
          effect: "fade",
          interval: 7000,
          auto: true,
          swap: false,
          pauseOnHover: false,
          restartDelay: 7000
        },

        menu_titles: {
          active: (count > 1)
        }
      });
    }
  }
}
