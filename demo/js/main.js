(function ($) {

	$(window).on('scroll', function () {

		var $this = $(this),
			isActive = !!$this.data('isActive'),
			scroll = $(this).scrollTop();

		if (isActive && scroll >= 400) {
			$('#page-title').removeClass('active');
			$this.data('isActive', false);
		} else if (!isActive && scroll < 400) {
			$('#page-title').addClass('active');
			$this.data('isActive', true);
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
		$('#demo-2-linkifier').on('click', function () {
			var $this = $(this),
				$input = $($this.attr('data-linkify-demo-input')),
				$output = $($this.attr('data-linkify-demo-output'));

			$output.text($input.val());
			$output.linkify({newLine: '<br>\n'});
		});

		prettyPrint();

		$(window).trigger('scroll');
	});

})(jQuery);
