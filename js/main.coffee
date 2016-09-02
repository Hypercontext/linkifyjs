---
---


(($) ->

  headerThreshold = if $('#page-header.offset').length then 422 else 75;

  $(window).on 'scroll', ->

    $this = $(this)
    isActive = !!$this.data 'isHeaderActive'
    scroll = $(this).scrollTop()

    if isActive and scroll >= headerThreshold
      $('#page-title').removeClass 'active'
      $('#navbar').addClass 'top'
      $this.data 'isHeaderActive', false

    else if  !isActive and scroll < headerThreshold
      $('#page-title').addClass 'active'
      $('#navbar').removeClass 'top'
      $this.data 'isHeaderActive', true

  $(window).on 'load', ->

    $('.linkifier').text 'Linkify'
    .on 'click', ->

      $this = $(this)
      $targets
      id = $this.attr 'id'

      return unless id

      $targets = $("[data-linkify-demo-target=#{id}]")
      $targets.linkify()


      $this.prop 'disabled', true
      .text 'Linkified!'
      .off 'click'


    # Set the value of the textfield to the referrer URL
    $('#demo-3-input').val 'Linkify the following URL: ' + \
      (document.referrer || 'https://github.com/SoapBox/linkifyjs/')

    $('#demo-3-linkifier').on 'click', ->
      $this = $(this)
      $input = $($this.attr 'data-linkify-demo-input')
      $output = $($this.attr 'data-linkify-demo-output')

      $output.text $input.val()
      $output.linkify
        nl2br: true

    # TODO: Get this from GitHub
    $('.version').html '{{ site.version }}'
    $('.version-download').attr 'href', 'https://github.com/SoapBox/linkifyjs/releases/download/{{ site.version }}/linkifyjs.zip'

    # Show new release banner, if required
    do ->
      $banner = $('#new-release-banner')
      return if $banner.length == 0

      version = $banner.data('version')
      if !localStorage || localStorage.getItem("linkify_seen_announcement_#{version}")
        $banner.remove()
        return

      $('body').addClass 'with-announcement-banner'
      $banner.find('.close').on 'click', ->
        $banner.remove()
        localStorage.setItem("linkify_seen_announcement_#{version}", true)
        $('body').removeClass 'with-announcement-banner'
        false

    # Fix scroll position when using named anchors (the top navigation is tall)
    $(window).on 'hashchange', ->
      $w = $(window)
      height = $('#navbar').height() + $('#new-release-banner').height()
      scrollDistance = $w.scrollTop()
      newScrollDistance = scrollDistance - height - 15
      $w.scrollTop(Math.max(newScrollDistance, 0))

    # Check if header in the right place on page load
    $(window).trigger 'scroll'
    $(window).trigger 'hashchange' if location.hash?

)(jQuery)
