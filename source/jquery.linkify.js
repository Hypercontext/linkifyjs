/*
 * jQuery Linkify Plugin - Version 0.0.1
 * https://github.com/HitSend/jQuery-Linkify
 *
 * Copyright 2013, HitSend, Inc
 * http://hitsend.ca
 *
 */

(function($) {
	"use strict";

	var linkify = function (inputText, newline) {

		if ($.type(inputText) !== 'string') {
			return inputText;
		}
		var replacedText = inputText.replace(/(\s)/g, '$1$1'), // 1 space -> 2 spaces

			attrPattern = /<(a)(?:[^>]*(\shref=['\"][^'\"]*['\"]))?[^>]*?(\/?)>/gi,
			//imgPattern = /((http|https):\/\/.+\.(jpg|jpeg|gif|png))/gi,
			urlPattern = new RegExp("("+										// 1. Character before the link
							"\\s|[^a-zA-Z0-9.\\+_\\/\"\\>\\-]|^"+
							")(?:"+		//Main group
							"("+									// 2. Email address (optional)
							"[a-zA-Z0-9\\+_\\-]+"+
							"(?:"+
							"\\.[a-zA-Z0-9\\+_\\-]+"+
											")*@"+
										")?("+									// 3. Protocol (optional)
											"http:\\/\\/|https:\\/\\/|ftp:\\/\\/"+
										")?("+									// 4. www (optional)
											"www\\."+
										")?("+									// 5. Domain
											"(?:(?:[a-z0-9][a-z0-9_%\\-_+]*\\.)+)"+
										")("+									// 6. Top-level domain - http://en.wikipedia.org/wiki/List_of_Internet_top-level_domains
											"(?:com|ca|co|edu|gov|net|org|dev|biz|cat|int|pro|tel|mil|aero|asia|coop|info|jobs|mobi|museum|name|post|travel|local|[a-z]{2})"+
										")("+									// 7. Query string (optional)
											"(?:"+
												"[\\/|\\?]"+
												"(?:"+
													"[\\-a-zA-Z0-9_%#*&+=~!?,;:.\\/]*"+
												")*"+
											")"+
											"[\\-\\/a-zA-Z0-9_%#*&+=~]"+
										"|"+
											"\\/?"+
										")?"+
									")("+										// 8. Character after the link
										"[^a-zA-Z0-9\\+_\\/\"\\<\\-]|$"+
									")", 'g'),

			// Will be applied after the standard links
			emailPattern = /(<a href=")(http:\/\/)([a-zA-Z0-9\+_\-]+(?:\.[a-zA-Z0-9\+_\-]+)*@)/g;

		// remove title attributes
		//replacedText = replacedText.replace(/(<a *?href=")(*?)("*?>)(*?)(<\/a>)/, '');

		// Clear all attributes
		replacedText = replacedText.replace(attrPattern, '<$1$2 target="_blank" $3>');

		replacedText = replacedText.replace(urlPattern, '$1<a href="http://$2$4$5$6$7" target="_blank">$2$3$4$5$6$7</a>$8');
		replacedText = replacedText.replace(emailPattern, '$1mailto:$3');

		// 2 spaces -> back to 1 space
		replacedText = replacedText.replace(/(\s){2}/g, '$1');

		if(typeof newline !== 'undefined' && newline){
			replacedText = replacedText.replace( /\n/gim, '<br>');
		}


		return replacedText;
	};

	$.linkify = linkify; // Is this a bad practice?
	$.fn.linkify = function(content, text) {

		var _this = this, // The DOM element being called, if any.
			options = {
				newLine: '',
			};

		if ($.type(content) === 'string') {
			return linkify(content)
		} else if ($.type(content) === 'object') {
			options = $.extend(options, content);

			if ($.type(text) === 'string') {
				return linkify(text);
			}
		}

		return _this.each(function() {
			var item = $(this); // jQuery Object
			return item.html(function(index, oldHtml) {
				return linkify(oldHtml);
			});
		});
	};

 })(jQuery);