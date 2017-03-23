//import { isBrowser } from 'angular2-universal';

import {Directive, ElementRef, Inject} from '@angular/core';

declare var $: any;

@Directive({
  selector: '[carousel]',
})

export class Carousel {
  constructor(private _elRef: ElementRef, @Inject('isBrowser') private isBrowser: Boolean) {}

  ngOnInit() {
    //this.init();
  }

  init() {
    if (this.isBrowser) {
      $(require('../../../tools/js/jquery/carousel/slick.min.js'));
      $(this._elRef.nativeElement).slick({
        slidesToShow: 5,
        slidesToScroll: 1,
        dots: false,
        arrows: true,
        prevArrow: $('.product_image_list .arrow.left'),
        nextArrow: $('.product_image_list .arrow.right'),
        autoplay: false,
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
              slidesToShow: 6,
              slidesToScroll: 1,
            }
          },
          {
            breakpoint: 767,
            settings: {
              slidesToShow: 5,
              slidesToScroll: 1
            }
          },
          {
            breakpoint: 500,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 1
            }
          }
        ]
      });
    }
  }
}
