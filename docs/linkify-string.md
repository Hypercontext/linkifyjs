---
layout: doc
title: linkify-string · Documentation
---

Interface for replacing links within native strings with anchor tags. Note that this function will ***not*** parse HTML strings properly - use [`linkify-element`](linkify-element.html) or [`linkify-jquery`](linkify-jquery.html) instead.

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

**Params**

* _`String`_ **`str`** String to linkify
* _`Object`_ [**`options`**] [Options](options.html) hash

**Returns** _`String`_ Linkified string

