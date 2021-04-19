---
---
beforeEl = document.getElementById('linkify-demo-before')
afterEl = document.getElementById('linkify-demo-after')

options =
  rel: 'nofollow noreferrer nopenner'
  formatHref:
    hashtag: (val) ->
      "https://www.twitter.com/hashtag/#{val.substr(1)}"
    mention: (val) ->
      "https://github.com/#{val.substr(1)}"

afterEl.innerHTML = linkifyStr(beforeEl.value, options)
beforeEl.addEventListener 'input', ->
  afterEl.innerHTML = linkifyStr(beforeEl.value, options)
