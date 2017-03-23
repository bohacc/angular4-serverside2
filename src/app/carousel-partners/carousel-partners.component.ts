//import { isBrowser } from 'angular2-universal';

import {Directive, ElementRef, OnInit, Input, Inject} from '@angular/core';

declare var $: any;

@Directive({
  selector: '[carousel-partners]',
})

export class CarouselPartners implements OnInit {
  @Input('init') init: Boolean;
  constructor(private _elRef: ElementRef, @Inject('isBrowser') private isBrowser: Boolean) {}

  ngOnInit() {
    if (this.isBrowser) {
      //noinspection TypeScriptUnresolvedFunction
      $(require('../../../tools/js/jquery/carousel/slick.min.js'));
    }
  }

  ngOnChanges(changes) {
    if (changes['init'].currentValue) {
      this.setCarousel();
    }
  }

  setCarousel() {
    if (this.isBrowser) {
      //$(require('../../../tools/js/jquery/carousel/slick.min.js'));

      $(this._elRef.nativeElement).slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        dots: false,
        arrows: true,
        prevArrow: $('.site_partners .arrow.left'),
        nextArrow: $('.site_partners .arrow.right'),
        autoplay: true,
        autoplaySpeed: 5500,
        responsive: [
          {
            breakpoint: 1300,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 1,
            }
          },
          {
            breakpoint: 991,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
            }
          },
          {
            breakpoint: 767,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ]
      });
    }
  }
}
