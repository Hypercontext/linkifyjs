---
layout: doc
title: linkify-html · Documentation
---

Interface for replacing links with anchor tags within JavaScript strings containing HTML.

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
var linkifyHtml = require('linkifyjs/html');
{% endhighlight %}

### AMD

{% highlight html %}
<script src="linkify.amd.js"></script>
<script src="linkify-html.amd.js"></script>
<script>
  require(['linkify-html'], function (linkifyHtml) {
    // …
  });
</script>
{% endhighlight %}

### Browser globals

{% highlight html %}
<script src="linkify.js"></script>
<script src="linkify-html.js"></script>
{% endhighlight %}

## Usage

{% highlight js %}
var options = {/* … */};
var str = '<p>For help with GitHub.com, please email support@github.com</p>';
linkifyHtml(str, options);
{% endhighlight %}

Returns

{% highlight js %}
'<p>For help with <a href="http://github.com" target="_blank">GitHub.com</a>, please email <a href="mailto:support@github.com">support@github.com</a></p>'
{% endhighlight %}

**Params**

* _`String`_ **`str`** String to linkify
* _`Object`_ [**`options`**] [Options](options.html) hash

**Returns** _`String`_ Linkified htmlString
