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
      document.referrer ? 'https://github.com/SoapBox/linkifyjs/'

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

    $(window).trigger 'scroll'

)(jQuery)
