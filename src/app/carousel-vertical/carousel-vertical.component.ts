//import { isBrowser } from 'angular2-universal';

import {Directive, ElementRef, Inject, OnInit} from '@angular/core';

declare var $: any;

@Directive({
  selector: '[carousel-vertical]',
})

export class CarouselVertical implements OnInit {
  constructor(private _elRef: ElementRef, @Inject('isBrowser') private isBrowser: Boolean) {}

  ngOnInit() {
    if (this.isBrowser) {
      //noinspection TypeScriptUnresolvedFunction
      $(require('../../../tools/js/jquery/ui/ui.product.img.previews.js'));
      //noinspection TypeScriptUnresolvedFunction
      $(require('../../../tools/js/jquery/ui/ui.vertical.img.previews.js'));
      //$(require('../../../tools/js/jquery/ui/ui.product.img.lightbox.js'));

      //noinspection TypeScriptUnresolvedFunction
      $(require('../../../tools/js/jquery/carousel/slick.min.js'));

      // .vertical_gallery_list .content
      $(this._elRef.nativeElement).slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        dots: false,
        arrows: true,
        prevArrow: $('.vertical_gallery_list .arrow.left'),
        nextArrow: $('.vertical_gallery_list .arrow.right'),
        autoplay: false,
        vertical: true,
        autoplaySpeed: 5500,
        responsive: [
          {
            breakpoint: 1300,
            settings: {
              slidesToShow: 4,
              slidesToScroll: 1,
              vertical: false,
            }
          },
          {
            breakpoint: 991,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 1,
              vertical: false,
            }
          },
          {
            breakpoint: 767,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 1,
              vertical: false,
            }
          },
          {
            breakpoint: 500,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 1,
              vertical: false,
            }
          }
        ]
      });
    }
  }
}
