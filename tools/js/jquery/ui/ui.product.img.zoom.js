//$(document).ready(function () {


	// JQUERY ACTUAL VIEWPORT
	function getScrollBarWidth () {
		var $outer = $('<div>').css({visibility: 'hidden', width: 100, overflow: 'scroll'}).appendTo('body'),
			widthWithScroll = $('<div>').css({width: '100%'}).appendTo($outer).outerWidth();
		$outer.remove();
		return 100 - widthWithScroll;
	};

	function zoom_image(){
		var container = $(".product_detail .product_image_main a");
		var offset = container.offset();
		var container_width = container.width();
		var container_height = container.height();
		var zoom_img = container.children("img.zoom_image");

		var max_left = (zoom_img.width() - container_width) * -1;
		var max_top = (zoom_img.height() - container_height) * -1;

		$(this).mousemove(function(e){
			var cursor_left = (e.pageX - offset.left) * -1;
			var cursor_top = (e.pageY - offset.top) * -1;

			// DEBUG:
			//$("#offset_x").attr("value","left:"+cursor_left+"  (max:"+max_left+")");
			//$("#offset_y").attr("value","top:"+cursor_top+"  (max:"+max_top+")");

			if(max_left<cursor_left){
				$(zoom_img).css("margin-left",cursor_left);
			}
			if(max_top<cursor_top){
				$(zoom_img).css("margin-top",cursor_top);
			}
		});

	}


	var width = $(document).width() + getScrollBarWidth();
	if(width>=992){
		$(".product_detail .product_image_main a").mouseover(function(){
			zoom_image();
		});
	}
	$(window).resize(function () {
		var width = $(document).width() + getScrollBarWidth();
		if(width>=992){
			$(".product_detail .product_image_main a").mouseover(function(){
				zoom_image();
			});
		}
	});
//});
