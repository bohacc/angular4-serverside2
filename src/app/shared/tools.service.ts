import {Inject, Injectable} from '@angular/core';

//import { isBrowser } from 'angular2-universal';
import {AppService} from "../app.service";
import Constants = require('../../backend/constants');

declare var $: any;

@Injectable()
export class ToolsService {
  static instance: ToolsService;
  static isCreating: boolean = false;
  store: any;
  appService: AppService;
  @Inject('isBrowser') private isBrowser: Boolean;

  constructor() {
    this.appService = AppService.getInstance();
    if (!ToolsService.isCreating) {
      throw new Error("You can't call new in Singleton instances! Call SingletonService.getInstance() instead.");
    }
  }

  static getInstance() {
    if (ToolsService.instance == null) {
      ToolsService.isCreating = true;
      ToolsService.instance = new ToolsService();
      ToolsService.isCreating = false;
    }

    return ToolsService.instance;
  }

  zoomImage(el) {
    //let obj = $(el).find(".product_detail .product_image_main a");
    let obj = $(el).find(".product_image_main a");
    obj.mouseover(function() {
      var container = obj;
      var offset = container.offset();
      var container_width = container.width();
      var container_height = container.height();
      var zoom_img = container.children("img.zoom_image");

      var max_left = (zoom_img.width() - container_width) * -1;
      var max_top = (zoom_img.height() - container_height) * -1;

      $(this).mousemove(function (e) {
        var cursor_left = (e.pageX - offset.left) * -1;
        var cursor_top = (e.pageY - offset.top) * -1;

        if (max_left < cursor_left) {
          $(zoom_img).css("margin-left", cursor_left);
        }
        if (max_top < cursor_top) {
          $(zoom_img).css("margin-top", cursor_top);
        }
      });
    });
  }

  initZoom(el) {
    if (this.isBrowser) {
      this.zoomImage(el);

      let width = this.appService.getAppWidth() + this.appService.getScrollBarWidth();
      if (width >= 992) {
        //$(el).find(".product_detail .product_image_main a").mouseover(()=> {
        $(el).find(".product_image_main a").mouseover(()=> {
          this.zoomImage(el);
        });
      }
      $(window).resize(()=> {
        var width = this.appService.getAppWidth() + this.appService.getScrollBarWidth();
        if (width >= 992) {
          //$(el).find(".product_detail .product_image_main a").mouseover(()=> {
          $(el).find(".product_image_main a").mouseover(()=> {
            this.zoomImage(el);
          });
        }
      });
    }
  }

  initVerticalPreview(el) {
    if (this.isBrowser) {
      $(el).find(".vertical_gallery_list .content div").each(function () {
        $(this).click(function (e) {
          // RESET ACTIVE STATE FOR OTHER ITEMS
          $(this).siblings().removeClass("active");

          // SOURCE
          var image = $(this).find("img");
          //var image_nth = $(this).attr("data-nth-child");
          //var image_main = image.attr("data-main-src");
          var image_full = image.attr("data-full-src");

          // TARGET
          //var image_main_a = $(".vertical_gallery_preview div");
          var image_main_src = $(el).find(".vertical_gallery_preview div img");

          // SET ATTRIBUTES
          //image_main_a.attr("href",image_full);
          //image_main_a.attr("data-image-nth",image_nth);
          image_main_src.attr("src", image_full);

          // MAKE CURRENT ITEM IN CAROUSEL ACTIVE
          image.parent().addClass("active");
        });
      });
    }
  }

  initProductPreview(el) {
    if (this.isBrowser) {
      //$(el).find(".product_detail .product_image_list .content div").each(function () {
      $(el).find(".product_image_list .content div").each(function () {
        $(this).click(function (e) {
          // RESET ACTIVE STATE FOR OTHER ITEMS
          $(this).siblings().removeClass("active");

          // SOURCE
          var image = $(this).find("img");
          var image_nth = $(this).attr("data-nth-child");
          //console.log("nth-child: " + image_nth);
          var image_main = image.attr("data-main-src");
          //console.log('image_main: ' + image_main);
          var image_full = image.attr("data-full-src");
          //console.log('image_full: ' + image_full);

          // TARGET
          //var image_main_a = $(el).find(".product_detail .product_image_main a");
          var image_main_a = $(el).find(".product_image_main a");
          //var image_main_src = $(el).find(".product_detail .product_image_main a img.main_image");
          var image_main_src = $(el).find(".product_image_main a img.main_image");
          //console.log('image_main_src');
          //console.log(image_main_src);
          //var image_zoom_src = $(el).find(".product_detail .product_image_main a img.zoom_image");
          var image_zoom_src = $(el).find(".product_image_main a img.zoom_image");
          //console.log('image_zoom_src');
          //console.log(image_zoom_src);

          // SET ATTRIBUTES
          //image_main_a.attr("href",image_full);
          image_main_a.attr("data-image-nth", image_nth);
          image_main_src.attr("src", image_main);
          image_zoom_src.attr("src", image_full);

          // MAKE CURRENT ITEM IN CAROUSEL ACTIVE
          image.parent().addClass("active");
        });
      });
    }
  }

  get_popup_height(el){
    let popup_height = $(el).find(".product_detail_img_popup .sidebar").outerHeight();
    if (popup_height > 400){
      return popup_height;
    }
    else {
      return 400;
    }
  }

  popup_load_image(el, image) {
    // RESET ACTIVE STATE FOR OTHER ITEMS
    $(image).siblings().removeClass("active");

    // SOURCE
    var popup = $(el).find(".product_detail_img_popup");
    var image = $(image).find("img");
    var image_full_src = image.attr("data-full-src");

    // TARGET
    var image_full = $(el).find(".product_detail_img_popup .image .data img");

    image_full.parent().addClass("loading");

    image_full.attr("src", image_full_src);
    image.parent().addClass("active");

    $(image_full).load(()=> {
      image_full.parent().removeClass("loading");

      // SET MAG HEIGHT BASED ON POPUP
      var popup_height = this.get_popup_height(el);
      image_full.css("max-height", popup_height);

      $(window).resize(()=> {
        var popup_height = this.get_popup_height(el);
        image_full.css("max-height", popup_height);
      });

    }).attr('src', image_full_src);
  }

  initProductLightBox(el) {
    if (this.isBrowser) {
      let _this = this;
      let product_detail_img_popup = $(el).find(".js-product_detail_img_popup");
      let event_close_img_popup = $(el).find(".js-event_close_img_popup");

      $(el).find(".product_detail_img_popup .image .next").each(function () {
        $(this).click(function (e) {
          let image = $(el).find(".product_detail_img_popup .images div.active");
          if ($(image).is(':last-child')) {
            image = image.siblings().first(".item");
          }
          else {
            image = image.next(".item");
          }
          _this.popup_load_image(el, image);
        });
      });

      $(el).find(".product_detail_img_popup .image .prev").each(function () {
        $(this).click(function (e) {
          let image = $(el).find(".product_detail_img_popup .images div.active");
          if ($(image).is(':first-child')) {
            image = image.siblings().last(".item");
          }
          else {
            image = image.prev(".item");
          }
          _this.popup_load_image(el, image);
        });
      });

      $(el).find(".event_open_img_popup").each(function (e) {
        $(this).click(function (e) {
          e.preventDefault();
          product_detail_img_popup.addClass("opened");


          let image_nth = $(this).attr("data-image-nth");
          if (image_nth) {
            let image = $(el).find(String(".product_detail_img_popup .images div:nth-child(") + image_nth + String(")"));
            _this.popup_load_image(el, image);
          }
        });
        return false;
      });

      event_close_img_popup.each(function (e) {
        $(this).click(function (e) {
          e.preventDefault();
          product_detail_img_popup.removeClass("opened");
        });
      });

      $(el).find(".product_detail_img_popup .images div").each(function () {
        $(this).click(function (e) {
          _this.popup_load_image(el, this);
        });
      });
    }
  }

  scrollToSelect(el, selector) {
    if (this.isBrowser) {
      $("html, body").animate({scrollTop: $(el).find(selector).offset().top}, "slow");
    }
  }
}
