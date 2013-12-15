(function ($) {

	var headerThreshold = 447;

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
