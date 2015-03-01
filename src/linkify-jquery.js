import jQuery from 'jquery';
import { linkifyElement } from './linkify-element';
export default apply;

// Applies the plugin to jQuery
function apply($, doc=null) {

	function jqLinkify(options) {
		return this.each(function () {
			linkifyElement(this, options, doc);
		});
	}

	$.fn.linkify = jqLinkify;

	$(window).on('load', function () {
		$('[data-linkify]').each(function () {
			let
			$this = $(this),
			data = $this.data(),
			target = data.linkify,
			options = {
				linkAttributes:		data.linkifyAttributes,
				defaultProtocol: 	data.linkifyDefaultProtocol,
				format:				data.linkifyFormat,
				formatHref:			data.linkifyFormatHref,
				newLine:			data.linkifyNewline, // deprecated
				nl2br:				data.linkifyNl2br,
				tagName:			data.linkifyTagname,
				target:				data.linkifyTarget,
				linkClass:			data.linkifyLinkclass,
			};

			let $target = target === 'this' ? $this : $this.find(target);
			$target.linkify(options);

		});
	});
}

if (typeof jQuery !== 'undefined') {
	apply(jQuery);
}
