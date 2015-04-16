---
layout: doc
title: linkify-jquery · Documentation
---

Provides the Linkify jQuery plugin.

#### Jump to

* [Installation](#installation)
  * [Node.js/io.js/Browserify](#nodejsiojsbrowserify)
  * [AMD](#amd)
  * [Browser globals](#browser-globals)
* [Usage](#usage)
* [DOM Data API](#dom-data-api)

## Installation

### Node.js/io.js/Browserify

```
npm install linkifyjs
```

{% highlight js %}
var $ = require('jquery');
require('linkifyjs/jquery')($, document);
{% endhighlight %}

Where the second argument is your `window.document` implementation (not required for Browserify).

### AMD

Note that `linkify-jquery` requires a `jquery` module.

{% highlight html %}
<script src="jquery.amd.js"></script>
<script src="linkify.amd.js"></script>
<script src="linkify-jquery.amd.js"></script>
{% endhighlight %}

{% highlight js %}
require(['jquery'], function ($) {
  // …
});
{% endhighlight %}

### Browser globals

{% highlight html %}
<script src="jquery.js"></script>
<script src="linkify.js"></script>
<script src="linkify-jquery.js"></script>
{% endhighlight %}

## Usage

{% highlight js %}
var options = { /* … */ };
$(selector).linkify(options);
{% endhighlight %}

**Params**

* _`Object`_ [**`options`**] [Options](options.html) hash

See [all available options](options.html).

## DOM Data API

The jQuery plugin also provides a DOM data/HTML API - no extra JavaScript required!

{% highlight html %}
<!-- Find and linkify all entities in this div -->
<div data-linkify="this">…</div>

<!-- Find and linkify the paragraphs and `#footer` element in the body -->
<body data-linkify="p, #footer" data-linkify-target="_parent">…</body>
{% endhighlight %}

[Additional data options](options.html) are available.
