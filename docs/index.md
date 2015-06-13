---
layout: doc
title: Documentation
---

# Getting Started

[Download](https://github.com/SoapBox/jQuery-linkify/releases/download/v2.0.0-alpha.3/linkifyjs.zip) the latest release or install via [NPM](https://www.npmjs.com/)

```
npm install linkifyjs
```

or [Bower](http://bower.io/)

```
bower install linkifyjs
```

## Quick Start

Add linkify and linkify-jquery to your HTML following jQuery:

{% highlight html %}
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
<script src="linkify.min.js"></script>
<script src="linkify-jquery.min.js"></script>
{% endhighlight %}

### Find all links and convert them to anchor tags

{% highlight js %}
$('p').linkify();
$('#sidebar').linkify({
    target: "_blank"
});
{% endhighlight %}

### Find all links in the given string

{% highlight js %}
linkify.find('Any links to github.com here? If not, contact test@example.com');
{% endhighlight %}

Returns the following array

{% highlight js %}
[
  {
    type: 'url',
    value: 'github.com',
    href: 'http://github.com'
  },
  {
    type: 'email',
    value: 'test@example.com',
    href: 'mailto:test@example.com'
  }
]
{% endhighlight %}

See [all available options](options.html)


## Node.js/io.js/Browserify

```
npm install linkifyjs
```

{% highlight js %}
var linkify = require('linkifyjs');
require('linkifyjs/plugin/hashtag')(linkify); // optional
var linkifyStr = require('linkifyjs/string');
{% endhighlight %}

### Example string usage

{% highlight js %}
linkifyStr('The site github.com is #awesome.', {
  defaultProtocol: 'https'
});
{% endhighlight %}

Returns the following string

{% highlight js %}
'The site <a href="https://github.com">github.com</a> is <a href="#awesome">#awesome</a>.'
{% endhighlight %}

## AMD

{% highlight html %}
<script src="r.js"></script>
<script src="linkify.amd.js"></script>
<script src="linkify-plugin-hashtag.amd.js"></script> <!-- optional -->
<script src="linkify-element.amd.js"></script>
{% endhighlight %}

{% highlight js %}
require(['linkify'], function (linkify) {
  linkify.test('github.com'); // true
  linkify.test('github.com', 'email'); // false
});

require(['linkify-element'], function (linkifyElement) {

  // Linkify the #sidebar element
  linkifyElement(document.getElementById('sidebar'), {
    linkClass: 'my-link'
  });

  // Linkify all paragraph tags
  document.getElementsByTagName('p').map(linkifyElement);

});
{% endhighlight %}

Note that if you are using `linkify-jquery.amd.js`, a `jquery` module must be defined.

## Browser globals

{% highlight html %}
<script src="jquery.js"></script>
<script src="linkify.js"></script>
<script src="linkify-string.js"></script>
<script src="linkify-jquery.js"></script>
{% endhighlight %}

{% highlight js %}
linkify.test('dev@example.com'); // true
var htmlStr = linkifyStr('Check out soapboxhq.com it is great!');
$('p').linkify();
{% endhighlight %}
