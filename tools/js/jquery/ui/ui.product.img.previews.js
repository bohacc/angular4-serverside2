/*
$(document).ready(function () {
	// PRODUCT DETAIL - CAROUSEL MAIN IMAGE HANDLER
	// preloads images for slideshow
	$(".product_detail .product_image_list .content div").each(function(){
		$(this).click(function(e){
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
			var image_main_a = $(".product_detail .product_image_main a");
			var image_main_src = $(".product_detail .product_image_main a img.main_image");
      //console.log('image_main_src');
      //console.log(image_main_src);
			var image_zoom_src = $(".product_detail .product_image_main a img.zoom_image");
      //console.log('image_zoom_src');
      //console.log(image_zoom_src);

			// SET ATTRIBUTES
			//image_main_a.attr("href",image_full);
			image_main_a.attr("data-image-nth",image_nth);
			image_main_src.attr("src",image_main);
			image_zoom_src.attr("src",image_full);

			// MAKE CURRENT ITEM IN CAROUSEL ACTIVE
			image.parent().addClass("active");
		});
	});
});
*/
