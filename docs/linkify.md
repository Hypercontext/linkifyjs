---
layout: doc
title: Standard linkify · Documentation
---

#### Jump to...

* [Installation](#installation)
  * [Node.js/io.js/Browserify](#nodejsiojsbrowserify)
  * [AMD](#amd)
  * [Browser Globals](#browser-globals)
* [Methods](#methods)
  * [linkify.find](#linkifyfind-str--type)
  * [linkify.test](#linkifytest-str--type)
  * [linkify.tokenize](#linkifytokenize-str)

## Installation

### Node.js/io.js/Browserify

{% highlight js %}
var linkify = require('linkifyjs');
{% endhighlight %}

### AMD

{% highlight html %}
<script src="linkify.amd.js"></script>
<script>
  require(['linkify'], function (linkify) {
    // ...
  });
</script>
{% endhighlight %}

### Browser globals
{% highlight html %}
<script src="linkify.js"></script>
{% endhighlight %}

## Methods

### linkify.find _(str [, type])_

Finds all links in the given string

**Params**

* _`String`_ **`str`** Search string
* _`String`_ [**`type`**] only find links of the given type

**Returns** _`Array`_ List of links where each element is a hash with properties type, value, and href:

* **type** is the type of entity found. Possible values are
  - `'url'`
  - `'email'`
  - `'hashtag'` (with Hashtag plugin)
* **value** is the original entity substring.
* **href** should be the value of this link's `href` attribute.

{% highlight js %}
linkify.find('For help with GitHub.com, please email support@github.com');
{% endhighlight %}

Returns the array

{% highlight js %}
[
  {
    type: 'url',
    value: 'GitHub.com',
    href: 'http://github.com',
  },
  {
    type: 'email',
    value: 'support@github.com',
    href: 'mailto:support@github.com'
  }
]
{% endhighlight %}

### linkify.test _(str [, type])_

Is the given string a link? Not to be used for strict validation - See [Caveats](#)

**Params**

* _`String`_ **`str`** Test string
* _`String`_ [**`type`**] returns `true` only if the link is of the given type (see `linkify.find`),

**Returns** _`Boolean`_

{% highlight js %}
linkify.test('google.com'); // true
linkify.test('google.com', 'email'); // false
{% endhighlight %}

### linkify.tokenize _(str)_

Internal method used to perform lexicographical analysis on the given string and output the resulting token array.

**Params**

* _`String`_ **`str`**

**Returns** _`Array`_
