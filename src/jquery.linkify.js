// Plugin definition
$.fn.linkify = function (options) {
	return this.each(function () {

		var linkified;

		if (linkified = $.data(this, 'plugin-linkify')) {

			// Relinkify
			linkified.setOptions(options);
			linkified.init();

		} else {

			// Linkify
			$.data(
				this,
				'plugin-linkify',
				new Linkified(this, options)
			);

		}
	});
};

// Maintain access to the constructor from the plugin
$.fn.linkify.Constructor = Linkified;

// DOM data- API setup
$(window).on('load', function () {
	$('[data-linkify]').each(function () {
		var $this = $(this),
			$target,
			target = $this.attr('data-linkify'),
			options = {
				tagName: $this.attr('data-linkify-tagname') || undefined,
				newLine: $this.attr('data-linkify-newline') || undefined,
				target: $this.attr('data-linkify-target') || undefined,
				linkClass: $this.attr('data-linkify-linkclass') || undefined
			};

		$target = target === 'this' ? $this : $this.find(target);
		$target.linkify(options);

	});
});

// Setup click events for linkified elements
$('body').on('click', '.linkified', function () {
	var $link = $(this),
		url = $link.attr('href'),
		isEmail = /^mailto:/i.test(url),
		target = $link.attr('target');

	if (isEmail) {

		// mailto links ignore the target
		window.location.href = url;

	} else {
		window.open(url, target);
	}

	return false;
});

