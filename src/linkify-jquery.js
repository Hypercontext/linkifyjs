import $ from 'jquery';
import linkifyElement from './linkify-element';

// Applies the plugin to jQuery
export default function apply($, doc = false) {

	$.fn = $.fn || {};

	try {
		doc = doc || document || window && window.document || global && global.document;
	} catch (e) { /* do nothing for now */ }

	if (!doc) {
		throw new Error(
			'Cannot find document implementation. ' +
			'If you are in a non-browser environment like Node.js, ' +
			'pass the document implementation as the second argument to linkify/jquery'
		);
	}

	if (typeof $.fn.linkify === 'function') {
		// Already applied
		return;
	}

	function jqLinkify(opts) {
		opts = linkifyElement.normalize(opts);
		return this.each(function () {
			linkifyElement.helper(this, opts, doc);
		});
	}

	$.fn.linkify = jqLinkify;

	$(doc).ready(function () {
		$('[data-linkify]').each(function () {
			let $this = $(this);
			let data = $this.data();
			let target = data.linkify;
			let nl2br = data.linkifyNlbr;
			let options = {
				linkAttributes:		data.linkifyAttributes,
				defaultProtocol: 	data.linkifyDefaultProtocol,
				events: 			data.linkifyEvents,
				format:				data.linkifyFormat,
				formatHref:			data.linkifyFormatHref,
				newLine:			data.linkifyNewline, // deprecated
				nl2br:				!!nl2br && nl2br !== 0 && nl2br !== 'false',
				tagName:			data.linkifyTagname,
				target:				data.linkifyTarget,
				linkClass:			data.linkifyLinkclass,
				validate:			data.linkifyValidate,
				ignoreTags:			data.linkifyIgnoreTags
			};
			let $target = target === 'this' ? $this : $this.find(target);
			$target.linkify(options);
		});
	});
}

// Try assigning linkifyElement to the browser scope
try { let a = !define && (window.linkifyElement = linkifyElement); } catch (e) {}
