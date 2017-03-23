/*
$(document).ready(function () {

	// POPUP HEIGHT - SETUP MAXIMUM IMAGE HEIGHT (JAVASCRIPT WORKAROUND)
	function get_popup_height(){
		var popup_height = $(".product_detail_img_popup .sidebar").outerHeight();
		if(popup_height>400){
			return popup_height;
		}
		else {
			return 400;
		}
	}

	// PRODUCT DETAIL - LIGHTBOX IMAGE HANDLER
	function popup_load_image(image){
		// RESET ACTIVE STATE FOR OTHER ITEMS
		$(image).siblings().removeClass("active");

		// SOURCE
		var popup = $(".product_detail_img_popup");
		var image = $(image).find("img");
		var image_full_src = image.attr("data-full-src");

		// TARGET
		var image_full = $(".product_detail_img_popup .image .data img");

		image_full.parent().addClass("loading");

		image_full.attr("src",image_full_src);
		image.parent().addClass("active");

		$(image_full).load(function() {
			image_full.parent().removeClass("loading");

			// SET MAG HEIGHT BASED ON POPUP
			var popup_height = get_popup_height();
			image_full.css("max-height", popup_height);

			$(window).resize(function() {
				var popup_height = get_popup_height();
				image_full.css("max-height", popup_height);
			});

		}).attr('src', image_full_src);
	}



	$(".product_detail_img_popup .image .next").each(function(){
		$(this).click(function(e){
			var image = $(".product_detail_img_popup .images div.active");
			if($(image).is(':last-child')){
				var image = image.siblings().first(".item");
			}
			else {
				var image = image.next(".item");
			}
			popup_load_image(image);
		});
	});

	$(".product_detail_img_popup .image .prev").each(function(){
		$(this).click(function(e){
			var image = $(".product_detail_img_popup .images div.active");
			if($(image).is(':first-child')){
				var image = image.siblings().last(".item");
			}
			else {
				var image = image.prev(".item");
			}
			popup_load_image(image);
		});
	});

	$(".event_open_img_popup").each(function(e){
		$(this).click(function(e){
			e.preventDefault();
			$(".product_detail_img_popup").addClass("opened");


			var image_nth = $(this).attr("data-image-nth");
			if(image_nth){
				image = $(".product_detail_img_popup .images div:nth-child("+image_nth+")");
				popup_load_image(image);
			}
		});
		return false;
	});

	$(".event_close_img_popup").each(function(e){
		$(this).click(function(e){
			e.preventDefault();
			$(".product_detail_img_popup").removeClass("opened");

		});
	});

	$(".product_detail_img_popup .images div").each(function(){
		$(this).click(function(e){
			popup_load_image(this);
		});
	});
});
*/
