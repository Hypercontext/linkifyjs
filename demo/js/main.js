(function ($) {

	var headerThreshold = 422;

	$(window).on('scroll', function () {

		var $this = $(this),
			isActive = !!$this.data('isHeaderActive'),
			scroll = $(this).scrollTop();

		if (isActive && scroll >= headerThreshold) {
			$('#page-title').removeClass('active');
			$('#navbar').addClass('top');
			$this.data('isHeaderActive', false);
		} else if (!isActive && scroll < headerThreshold) {
			$('#page-title').addClass('active');
			$('#navbar').removeClass('top');
			$this.data('isHeaderActive', true);
		}
	});

	$(window).on('load', function() {

		$('.linkifier').text('Linkify')
			.on('click', function () {

				var $this = $(this),
					$targets,
					id = $this.attr('id');

				if (!id) {
					return;
				}

				$targets = $('[data-linkify-demo-target="' + id + '"]');
				$targets.linkify();


				$this.prop('disabled', true)
					.text('Linkified!')
					.off('click');

			});

		// Set the value of the textfield to the referrer URL
		$('#demo-3-input').val(
			'Linkify the following URL: ' + (
				document.referrer || 'https://github.com/SoapBox/jQuery-linkify/'
			)
		);

		$('#demo-3-linkifier').on('click', function () {
			var $this = $(this),
				$input = $($this.attr('data-linkify-demo-input')),
				$output = $($this.attr('data-linkify-demo-output'));

			$output.html($input.val());
			$output.linkify({newLine: '<br>\n'});
		});

		prettyPrint();
		$(window).trigger('scroll');

	});

})(jQuery);
