// OPEN/CLOSE POPUP
//$(document).ready(function () {
	// OPEN POPUP
	/*$(".event_open_config_popup").each(function(e){
		$(this).click(function(e){
			e.preventDefault();
			$(".product_detail_config_popup").addClass("opened");
			$("html, body").animate({ scrollTop: 200 }, "slow");
		});
	});*/

	// CLOSE POPUP
	/*$(".event_close_config_popup").each(function(e){
		$(this).click(function(e){
			e.preventDefault();
			$(".product_detail_config_popup").removeClass("opened");
			$("html, body").animate({ scrollTop: $(".product_detail .footer").offset().top }, "slow");
		});
	});*/
	/*$(".show_second_power_cable").each(function(e){
		$(this).click(function(e){
			$(".secondary_power_cable").show();
		});
	});
	$(".hide_second_power_cable").each(function(e){
		$(this).click(function(e){
			$(".secondary_power_cable").hide();
		});
	});*/



//});

//product_detail_config_popup

// LOAD CONFIGURATOR SLIDER
/*
function configuration_slideshow(options){
	// INIT JQUERY SLIDER
	options.ranger.slider({
		value: options.default,
		min: options.min,
		max: options.max,
		step: options.step,
		slide: function(event, ui) {
			// PUT CURRENT VALUT FROM SLIDER INTO INPUT
			options.input.val(ui.value.toString().replace(/\./g, ',') + options.postfix);
		}
	});

	// PUT CURRENT VALUT FROM SLIDER INTO INPUT
	options.input.val(options.ranger.slider("value").toString().replace(/\./g, ',') + options.postfix);

	// PLUS BUTTON
	options.button_increase.click(function() {
		var sliderCurrentValue = options.ranger.slider("value") + options.step;
		if(sliderCurrentValue<=options.max){
			options.ranger.slider("value", sliderCurrentValue);
			if(options.round){
				options.input.val(sliderCurrentValue.toFixed(2).toString().replace(/\./g, ',') + options.postfix);
			}
			else {
				options.input.val(sliderCurrentValue.toString().replace(/\./g, ',') + options.postfix);
			}
		}
	});

	// MINUS BUTTON
	options.button_decrease.click(function() {
		var sliderCurrentValue = options.ranger.slider("value") - options.step;
		if(sliderCurrentValue>=options.min){
			options.ranger.slider("value", sliderCurrentValue);
			if(options.round){
				options.input.val(sliderCurrentValue.toFixed(2).toString().replace(/\./g, ',') + options.postfix);
			}
			else {
				options.input.val(sliderCurrentValue.toString().replace(/\./g, ',') + options.postfix);
			}
		}
	});
}
*/

