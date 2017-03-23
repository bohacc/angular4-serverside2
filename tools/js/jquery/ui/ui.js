$(document).ready(function () {


	// JQUERY ACTUAL VIEWPORT
	function getScrollBarWidth () {
		var $outer = $('<div>').css({visibility: 'hidden', width: 100, overflow: 'scroll'}).appendTo('body'),
			widthWithScroll = $('<div>').css({width: '100%'}).appendTo($outer).outerWidth();
		$outer.remove();
		return 100 - widthWithScroll;
	};


	// MAIN MENU - OPEN/CLOSE JS
	$(".shop_categories li .toggle").each(function () {
		$(this).click(function () {
			$(this).parent().toggleClass('opened');
		});
	});

	// OPEN/HIDE ALL CATS ON MOBILE/TABLET
	$(".shop_categories > h2").click(function () {
		$(this).parent().toggleClass('opened');
	});


	// MOVE CATEGORIES INTO HEADER ON SIDEBAR BASED ON CURRENT RESOLUTION
	function cats2header(){
		$(".shop_categories").detach().appendTo('#shop_cats_mobile');
	}
	function cats2side(){
		$(".shop_categories").detach().appendTo('#shop_cats_full');
	}
	function setCatsPosition(){
		if(width<=991){
			cats2header();
		}
		else if(width>=992){
			cats2side();
		}
	}
	var width = $(document).width() + getScrollBarWidth();
	setCatsPosition();

	$(window).resize(function () {
		var width = $(document).width() + getScrollBarWidth();
		if(width<=991){
			cats2header();
		}
		else if(width>=992){
			cats2side();
		}
	});

	// SHOP CATEGORY DESCRIPTION TOGGLER
	$(".shop_category_description .more button").each(function () {
		$(this).click(function () {
			$(this).toggleClass('active');
			$(this).closest('.shop_category_description').toggleClass('opened');
		});
	});

	// SHOP FILTER TAB SWITCH
	$(".shop_filter .switch .item").each(function () {
		$(this).click(function () {
			$(this).siblings().removeClass('active'); // RESET STATE
			$(this).addClass('active'); // SET THIS ACTIVE

			var tab = $(this).attr('data-tab');
			$(this).closest('.shop_filter').children('.content').children().removeClass('opened'); // RESET STATE
			$(this).closest('.shop_filter').children('.content').children('.'+tab).addClass('opened'); // SET NEW ACTIVE
		});
	});

	// CUSTOM SELECTS
	$("select.make_lui_select").each(function () {
		$(this).parent().append('<div class="ui-js-dropdown"><div class="inside"></div></div>');
		var dropdown = $(this).siblings(".ui-js-dropdown").children(".inside");
		$(this).selectmenu({appendTo: dropdown});
	});

	// TABS HANDLED BY JQUERY UI
	/*$(".make_tabs").each(function () {
		$(this).tabs();
	});*/


	// INPUT NUMBER WITH PLUS AND MINUS BUTTONS
	/*$(".ui_input_number").each(function(){
		$(this).children(".plus").click(function(e){
			e.preventDefault();
			var current_value = $(this).siblings("input").val();
			if (!isNaN(current_value)) {
				var new_value = parseInt(current_value) + parseInt("1");
				$(this).siblings("input").val(new_value);
			}
			else {
				$(this).siblings("input").val(0);
			}
		});
		$(this).children(".minus").click(function(e){
			e.preventDefault();
			var current_value = $(this).siblings("input").val();
			if (!isNaN(current_value) && current_value > 0) {
				var new_value = parseInt(current_value) - parseInt("1");
				$(this).siblings("input").val(new_value);
			}
			else {
				$(this).siblings("input").val(0);
			}
		});
	});*/


	// FORM PREFIX / POSTFIX

	// TODO: CHECK STRANGE WIDTH CALCULATIONS FOR POSTFIX/PREFIX ELEMENTS
	$(window).load(function () {
		function prefix_calc() {
			$(".lui_form .item .input.prefix input").each(function () {
				var prefix_element = $(this).siblings(".lui_prefix").outerWidth(true);
				var prefix_width = $(this).parent().width() - prefix_element
				$(this).css('width', prefix_width).css('margin-left', prefix_element);
			})
		};

		function postfix_calc() {
			$(".lui_form .item .input.postfix input").each(function () {
				var postfix_element = $(this).siblings(".lui_postfix").outerWidth(true);
				var postfix_width = $(this).parent().width() - postfix_element
				$(this).css('width', postfix_width);
			})
		};

		prefix_calc();
		postfix_calc();
		$(window).resize(function () {
			setTimeout(
				function () {
					prefix_calc();
					postfix_calc();
				}, 450);
		});
	});

	// ORDER USER PASSWORD
	$(".order_w_register_toggle").each(function(){
		$(this).click(function(){
			$(".order_w_register_inputs").slideToggle("display");
		});
	});


	// ORDER - TOGGLE NEWSLETTER CHECKBOXES
	$(".newsletter_cats_toggle").each(function(){
		$(this).click(function(){
			var checkBoxes = $(".newsletter_cats_inputs input");
			checkBoxes.prop("checked", !checkBoxes.prop("checked"));
		});
	});

	// CHECK MASTER IF CLICKED ON CHILD
	$(".newsletter_cats_inputs label > input").each(function(){
		$(this).click(function(){
			//console.log("clicked");
			$(document).find(".newsletter_cats_toggle").attr('checked','checked');
		});
	});
});
