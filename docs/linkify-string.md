---
layout: doc
title: linkify-string · Documentation
---

Interface for replacing links with anchor tags within JavaScript strings.

Note that this function will ***not*** parse HTML strings properly - use [`linkify-html`](linkify-html.html) instead. Alternatively, if you're using linkify with a DOM, use [`linkify-jquery`](linkify-html.html) or [`linkify-element`](linkify-element.html)

#### Jump to

* [Installation](#installation)
  * [Node.js/io.js/Browserify](#nodejsiojsbrowserify)
  * [AMD](#amd)
  * [Browser globals](#browser-globals)
* [Usage](#usage)

### Installation

### Node.js/io.js/Browserify

```
npm install linkifyjs
```

{% highlight js %}
var linkifyStr = require('linkifyjs/string');
{% endhighlight %}

### AMD

{% highlight html %}
<script src="linkify.amd.js"></script>
<script src="linkify-string.amd.js"></script>
<script>
  require(['linkify-string'], function (linkifyStr) {
    // …
  });
</script>
{% endhighlight %}

### Browser globals

{% highlight html %}
<script src="linkify.js"></script>
<script src="linkify-string.js"></script>
{% endhighlight %}

## Usage

{% highlight js %}
var options = {/* … */};
var str = 'For help with GitHub.com, please email support@github.com';
linkifyStr(str, options);
// or
str.linkify(options);
{% endhighlight %}

Returns

{% highlight js %}
'For help with <a href="http://github.com" target="_blank">GitHub.com</a>, please email <a href="mailto:support@github.com">support@github.com</a>'
{% endhighlight %}

## Usage with html string

`linkify-string` automatically escapes HTML input.

{% highlight js %}
var options = {/* … */};
var str = '<p>For help with GitHub.com, please email support@github.com</p>';
linkifyStr(str, options);
// or
str.linkify(options);
{% endhighlight %}

Returns

{% highlight js %}
'&lt;p&gt;For help with <a href="http://github.com" class="linkified" target="_blank">GitHub.com</a>, please email <a href="mailto:support@github.com" class="linkified">support@github.com</a>&lt;/p&gt;'
{% endhighlight %}

**Params**

* _`String`_ **`str`** String to linkify
* _`Object`_ [**`options`**] [Options](options.html) hash

**Returns** _`String`_ Linkified string
