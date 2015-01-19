# Linkify

[![Node Dependencies](https://david-dm.org/SoapBox/jQuery-linkify/dev-status.png)](https://david-dm.org/SoapBox/jQuery-linkify#info=devDependencies&view=table)

Linkify is a small yet comprehensive JavaScript plugin for finding URLs in plain-text and converting them to HTML links. It works with all valid URLs and email addresses.

__Jump to__

- [Features](#features)
- [Demo](#demo)
- [Installation and Usage](#installation-and-usage)
  - [Quick Start](#quick-start)
  - [Usage](#usage)
    - [Node.js/Browserify](#node-js-browserify)
    - [AMD Modules](#amd-modules)
    - [Browser](#browser)
- [API](#api)
  - [`string`](#string)
  - [`jquery`](#string)
  - [Options](#options)
- [Contributing](#contributing)
  [Authors](#authors)
- [License](#license)

## Features

* **Accuracy**<br>Linkify uses a (close to) complete list of valid top-level domains to ensure that only valid URLs and email addresses are matched.
* **Speed**<br>Each string is analyzied exactly once to detect every kind of linkable entity
* **Extensibility**<br>Linkify is designed to be fast and lightweight, but comes with a powerful plugin API that lets you detect even more information like #hashtags and @mentions.
* **Small footprint**<br>Linkify and its jQuery interface clock in at approximately 15KB minified (5KB gzipped) - approximately 50% the size of Twitter Text
* **Modern implementation**<br>Linkify is written in ECMAScript6 and compiles to ES5 for modern JavaScript runtimes.

## Demo
[Launch demo](http://soapbox.github.io/jQuery-linkify/)

## Installation and Usage

### Quick Start

Add [linkify](#) and [linkify-jquery](#) to your HTML following jQuery:

```html
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
<script src="linkify.min.js"></script>
<script src="linkify-jquery.min.js"></script><!-- interface -->
<script>
  (function ($) { $(document).ready({

    var links = linkify.find('Any links to github.com here?');
    console.log(links);
    // [{type: 'url', value: 'github.com', href: 'http://github.com'}]

    // Find links and emails in paragraphs and `#sidebar`
    // and converts them to anchors
    $('p').linkify();
    $('#sidebar').linkify({
        target: "_blank"
    });

  }) })(jQuery);
</script>
```

### Node.js/Browserify

```js
var linkify = require('linkifyjs');
var linkifyInterface = require('linkifyjs/<interface>');
require('linkifyjs/plugin/<plugin1>')(linkify);

linkify.find('github.com');
linkifyInterface(target, options); // varies
```

### AMD

```html
<script src="r.js"></script>
<script src="linkify.amd.js"></script>
<script src="linkify-<interface>.amd.js"></script>
<script src="linkify-plugin-<plugin1>.amd.js"></script> <!-- optional -->
<script>
    require(['linkify'], function (linkify) {
        var links = linkify.find("github.com");
        console.log(link);
    });

    require(['linkify-<interface>'], function (linkifyInterface) {
        var linkified = linkifyInterface(target, options); // varies
        console.log(linkified);
    });

</script>
```

### Browser

```html
<script src="linkify.js"></script>
<script src="linkify-<interface>.js"></script>
<script src="linkify-plugin-<plugin1>.js"></script> <!-- optional -->
```

## Downloads

**[linkify](#api)** _(required)_<br> [`.min.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify.min.js) · [`.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify.js) · [`.amd.min.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify.amd.min.js) · [`.amd.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify.amd.js)

**Interfaces** _(recommended - include at least one)_

* **[string](#linkify-string)**<br> [`.min.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify-string.min.js) · [`.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify-string.js) · [`.amd.min.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify-string.amd.min.js) · [`.amd.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify-string.amd.js)


**Plugins** _(optional)_

* **[hashtag](#linkify-plugin-hashtag)**<br> [`.min.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify-plugin-hashtag.min.js) · [`.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify-plugin-hashtag.js) · [`.amd.min.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify-plugin-hashtag.amd.min.js) · [`.amd.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify-plugin-hashtag.amd.js)

## API

```js
// Node.js/Browserify usage
var linkify = require('linkifyjs');
```

```html
<!-- Global `linkify` -->
<script src="linkify.js"></script>

<!-- AMD -->
<script src="linkify.amd.js"></script>
<script>
    require(['linkify'], function (linkify) {
        // ...
    });
</script>
```

#### linkify.find _(str)_

Finds all links in the given string

**Params**

* `String` **`str`** Search string

**Returns** _`Array`_ List of links where each element is a hash with properties `type`, `value`, and `href`

```js
linkify.find('For help with GitHub.com, please email support@github.com');
/** // returns
[{
    type: 'url',
    value: 'GitHub.com',
    href: 'http://github.com',
}, {
    type: 'email',
    value: 'support@github.com',
    href: 'mailto:support@github.com'
}]
*/
```

#### linkify.test _(str)_

Is the given string a link? Not to be used for strict validation - See [Caveats](#)

**Params**

* `String` **`str`** Test string

**Returns** _`Boolean`_

```js
linkify.test('google.com'); // true
linkify.test('google.com', 'email'); // false
```

#### linkify.tokenize _(str)_

Internal method used to perform lexicographical analysis on the given string and output the resulting array tokens.

**Params**

* `String` **`str`**

**Returns** _`Array`_

### Interfaces

#### linkify-jquery

Provides the Linkify jQuery plugin.

```js
// TODO: How do you build a Browserify jQuery plugin??
var $ = require('jquery');
require('linkifyjs/jquery')($);
```

```html
<script src="jquery.js"></script>

<!-- Global jQuery -->
<script src="linkify.js"></script>
<script src="linkify-jquery.js"></script>

<!-- AMD -->
<script>define(['jquery'], function () { return window.jQuery; });</script>
<script src="linkify.amd.js"></script>
<script src="linkify-string.amd.js"></script>
<script>
require(['linkify-string'], function (linkifyStr) {
  // ...
});
</script>
```

**Usage**

```js
$(selector).linkify(options);
```

**DOM Data API**

```html
<!-- Find and links all entitires in this div -->
<div data-linkify="this">...</div>

<!-- Find and linkifies the paragraphs and `#footer` element in the body -->
<body data-linkify="p, #footer">...</body>
```

**Params**

* `Object` [**`options`**] [Options hash](#)


#### linkify-string

Interface for replacing links within native strings with anchor tags. Note that this function will **not** parse HTML strings - use [linkify-dom](#) or [linkify-jquery](#) instead.

```js
// Node.js/Browserify usage
var linkifyStr = require('linkifyjs/string'),;
```

```html
<!-- Global `linkifyStr` -->
<script src="linkify.js"></script>
<script src="linkify-string.js"></script>

<!-- AMD -->
<script src="linkify.amd.js"></script>
<script src="linkify-string.amd.js"></script>
<script>
    require(['linkify-string'], function (linkifyStr) {
        // ...
    });
</script>
```

**Usage**

```js
var options = {/* ... */};
linkifyStr('For help with GitHub.com, please email support@github.com');
// returns "For help with <a href="http://github.com" target="_blank">GitHub.com</a>, please email <a href="mailto:support@github.com">support@github.com</a>
```

or

```js
var options = {/* ... */};
'For help with GitHub.com, please email support@github.com'.linkify(options);
```

**Params**

* `String` **`str`** String to linkify
* `Object` [**`options`**] [Options hash](#)

**Returns** _`String`_ Linkified string


### Plugins

Plugins provide no new interfaces but add additional detection functionality to Linkify. A plugic plugin API is currently in the works.

#### hashtag

Adds basic support for Twitter-style hashtags.

```js
// Node.js/Browserify
var linkify = require('linkifyjs');
require('linkifyjs/plugins/hashtag')(linkify);
```

```html
<!-- Global `linkifyStr` -->
<script src="linkify.js"></script>
<script src="linkify-plugin-hashtag.js"></script>

<!-- AMD -->
<script src="linkify.amd.js"></script>
<script src="linkify-plugin-hashtag.amd.js"></script>
<script>
    require(['linkify'], function (linkify) {
        // ...
    });
</script>
```

**Usage**

```js
var options = {/* ... */};
var str = "Linkify is #super #rad";

linkify.find(str);
/* [
 {type: 'hashtag', value: "#super", href: "#super"},
 {type: 'hashtag', value: "#rad", href: "#rad"}
] */

// If the linkifyStr interface has also been included
linkifyStr(str)

```


## Options

Linkify is applied with the following default options. Below is a description of each.

```js
var options = {
  tagName: 'span',
  defaultProtocol: 'https',
  target: '_parent',
  nl2br: true,
  linkClass: 'a-new-link',
  linkAttributes: {
    rel: 'nofollow'
  },
  format: function (link, type) {
    if (type === 'hashtag') {
      link = link.toLowerCase();
    }
    return link;
  },
  formatHref: function (link, type) {
    if (type === 'hashtag') {
      link = 'https://twitter.com/hashtag/' + link.replace('#', '');
    }
    return link;
  }
};

// jQuery
$('selector').linkify(options);

// String
linkifyStr(str, options);
str.linkify(options);
```


## Contributing


## Authors
Linkify is handcrafted with Love by [SoapBox Innovations, Inc](http://soapboxhq.com).
