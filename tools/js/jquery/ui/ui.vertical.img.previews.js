/*
$(document).ready(function () {
	// PRODUCT DETAIL - CAROUSEL MAIN IMAGE HANDLER
	// preloads images for slideshow
	$(".vertical_gallery_list .content div").each(function(){
		$(this).click(function(e){
			// RESET ACTIVE STATE FOR OTHER ITEMS
			$(this).siblings().removeClass("active");

			// SOURCE
			var image = $(this).find("img");
			//var image_nth = $(this).attr("data-nth-child");
			//var image_main = image.attr("data-main-src");
			var image_full = image.attr("data-full-src");

			// TARGET
			//var image_main_a = $(".vertical_gallery_preview div");
			var image_main_src = $(".vertical_gallery_preview div img");

			// SET ATTRIBUTES
			//image_main_a.attr("href",image_full);
			//image_main_a.attr("data-image-nth",image_nth);
			image_main_src.attr("src",image_full);

			// MAKE CURRENT ITEM IN CAROUSEL ACTIVE
			image.parent().addClass("active");
		});
	});
});
*/
