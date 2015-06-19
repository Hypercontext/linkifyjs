---
layout: doc
title: Options · Documentation
---

Linkify is applied with the following default options. Below is a description of each.

{% highlight js %}
var options = {
  defaultProtocol: 'http',
  events: null,
  format: function (value, type) {
    return value;
  },
  formatHref: function (href, type) {
    return href;
  },
  linkAttributes: null,
  linkClass: null,
  nl2br: false,
  tagName: 'a',
  target: function (href, type) {
    return type === 'url' ? '_blank' : null;
  }
};
{% endhighlight %}

#### Jump to

* [defaultProtocol](#defaultprotocol)
* [events](#events)
* [format](#format)
* [formatHref](#formathref)
* [linkAttributes](#linkattributes)
* [linkClass](#linkclass)
* [nl2br](#nl2br)
* [tagName](#tagname)
* [target](#target)

## Usage

{% highlight js %}
linkifyStr(str, options); // or `str.linkify(options)`
linkifyElement(document.getElementById('id'), options);
$(selector).linkify(options);
{% endhighlight %}

### defaultProtocol

* **Type**: `String`
* **Default**: `'http'`
* **Values**: `'http'`, `'https'`, `'ftp'`, `'ftps'`, etc.
* **Data API**: `data-linkify-default-protocol`

Protocol that should be used in `href` attributes for URLs without a protocol (e.g., `github.com`).

### events

* **Type**: `Object | Function (String href, String type)`
* **Default**: `null`

Add event listeners to newly created link elements. Takes a hash where each key is an [standard event](https://developer.mozilla.org/en-US/docs/Web/Events) name and the value is an event handler.

Also accepts a function that takes the link type (e.g., `'url'`, `'email'`, etc.) and returns the hash.

**Note:** Not applicable to linkify-string.

{% highlight js %}
$('p').linkify({
  events: {
    click: function (e) {
      alert('Link clicked!');
    },
    mouseover: function (e) {
      alert('Link hovered!');
    }
  }
});
{% endhighlight %}

### format

* **Type**: `Function (String value, String type)`
* **Default**: `null`

Format the text displayed by a linkified entity. e.g., truncate a long URL.

{% highlight js %}
'http://github.com/SoapBox/linkifyjs/search/?q=this+is+a+really+long+query+string'.linkify({
  format: function (value, type) {
    if (type === 'url' && value.length > 50) {
      value = value.slice(0, 50) + '…';
    }
    return value;
  }
});
{% endhighlight %}

### formatHref

* **Type**: `Function (String href, String type)`
* **Default**: `null`

Similar to [format](#format), except the result of this function will be used as the `href` attribute of the new link.

This is useful when finding hashtags, where you don't necessarily want the default to be a link to a named anchor.

{% highlight js %}
'This site is #rad'.linkify({
  formatHref: function (value, type) {
    if (type === 'hashtag') {
      value = 'https://twitter.com/hashtag/' + value.substring(1);
    }
    return value;
  }
});
{% endhighlight %}

### linkAttributes

* **Type**: `Object | Function (String href, String type)`
* **Default**: `null`

Hash of attributes to add to each new link. **Note:** the [`class`](#linkClass) and [`target`](#target) attributes have dedicated options.

Also accepts a function that takes the link type (e.g., `'url'`, `'email'`, etc.) and returns the hash.


{% highlight js %}
'github.com'.linkify({
  linkAttributes: {
    rel: 'nofollow'
  }
});
{% endhighlight %}

### linkClass

* **Type**: `String | Function (String href, String type)`
* **Default**: `'linkified'` (may be removed in future releases)
* **Data API**: `data-linkify-linkclass`

`class` attribute to use for newly created links.

Also accepts a function that takes the link type (e.g., `'url'`, `'email'`, etc.) and returns the string.

{% highlight js %}
'github.com'.linkify({
  linkClass: 'new-link'
});
{% endhighlight %}

Returns

{% highlight html %}
<a href="http://github.com" class="new-link">github.com</a>
{% endhighlight %}

### nl2br

* **Type**: `Boolean`
* **Default**: `false`
* **Data API**: `data-linkify-nl2br`

If true, `\n` line breaks will automatically be converted to `<br>` tags.

### tagName

* **Type**: `String | Function (String href, String type)`
* **Default**: `a`
* **Data API**: `data-linkify-tagname`

The tag name to use for each link. For cases where you can't use anchor tags.

{% highlight js %}
'github.com'.linkify({
  tagName: 'span'
});
{% endhighlight %}

Returns

{% highlight html %}
<span href="http://github.com">github.com</span>
{% endhighlight %}

### target

* **Type**: `String | Function (String href, String type)`
* **Default**: `'_blank'` for URLs, `null` for everything else
* **Data API**: `data-linkify-target`

`target` attribute for generated link.

{% highlight js %}
'github.com'.linkify({
  target: '_parent'
});
{% endhighlight %}
