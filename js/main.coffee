---
---

(($) ->

  headerThreshold = 422;

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
      document.referrer ? 'https://github.com/SoapBox/jQuery-linkify/'

    $('#demo-3-linkifier').on 'click', ->
      $this = $(this)
      $input = $($this.attr 'data-linkify-demo-input')
      $output = $($this.attr 'data-linkify-demo-output')

      $output.html $input.val()
      $output.linkify
        nl2br: true

    $(window).trigger 'scroll'

)(jQuery)
