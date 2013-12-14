(function ($) {

	$(document).ready(function() {

	});

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

})(jQuery);
