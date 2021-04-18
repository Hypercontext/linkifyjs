---
---

options =
  rel: 'nofollow noreferrer nopenner'
  formatHref:
    hashtag: (val) ->
      "https://www.twitter.com/hashtag/#{val.substr(1)}"
    mention: (val) ->
      "https://github.com/#{val.substr(1)}"

beforeEl = document.getElementById('linkify-demo-textarea')
outputEl = document.getElementById('linkify-demo-result')

outputEl.innerHTML = linkifyStr(beforeEl.value, options)
beforeEl.addEventListener 'input', ->
  outputEl.innerHTML = linkifyStr(beforeEl.value, options)
