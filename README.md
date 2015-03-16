# Linkify

[![npm version](https://badge.fury.io/js/linkifyjs.svg)](https://www.npmjs.com/package/linkifyjs)
[![Dependency Status](https://gemnasium.com/SoapBox/jQuery-linkify.svg)](https://gemnasium.com/SoapBox/jQuery-linkify)
[![Build Status](https://travis-ci.org/SoapBox/jQuery-linkify.svg)](https://travis-ci.org/SoapBox/jQuery-linkify)
[![Coverage Status](https://coveralls.io/repos/SoapBox/jQuery-linkify/badge.svg)](https://coveralls.io/r/SoapBox/jQuery-linkify)

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
- [Plugin API](#plugin-api)
- [Caveats](#caveats)
- [Contributing](#contributing)
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
<script src="linkify-jquery.min.js"></script>
```

#### Find all links and convert them to anchor tags

```js
$('p').linkify();
$('#sidebar').linkify({
    target: "_blank"
});
```

#### Find all links in the given string

```js
linkify.find('Any links to github.com here? If not, contact test@example.com');
```

Returns the following array

```js
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
```


See [all available options](#options)


### Node.js/io.js/Browserify

```js
var linkify = require('linkifyjs');
require('linkifyjs/plugin/hashtag')(linkify); // optional
var linkifyStr = require('linkifyjs/string');
```

#### Example string usage

```js
linkifyStr('The site github.com is #awesome.', {
  defaultProtocol: 'https'
});
```

Returns the following string

```js
'The site <a href="https://github.com">github.com</a> is <a href="#awesome">#awesome</a>.'
```

### AMD

```html
<script src="r.js"></script>
<script src="linkify.amd.js"></script>
<script src="linkify-plugin-hashtag.amd.js"></script> <!-- optional -->
<script src="linkify-element.amd.js"></script>
```

```js
require(['linkify'], function (linkify) {
  linkify.test('github.com'); // true
  linkify.test('github.com', 'email'); // false
});

require(['linkify-element'], function (linkifyElement) {

  // Linkify the #sidebar element
  linkifyElement(document.getElementById('#sidebar'), {
    linkClass: 'my-link'
  });

  // Linkify all paragraph tags
  document.getElementsByTagName('p').map(linkifyElement);

});

```

Note that if you are using `linkify-jquery.amd.js`, a `jquery` module must be defined.

### Browser globals

```html
<script src="jquery.js"></script>
<script src="linkify.js"></script>
<script src="linkify-string.js"></script>
<script src="linkify-jquery.js"></script>
```

```js
linkify.test('dev@example.com'); // true
var htmlStr = linkifyStr('Check out soapboxhq.com it is great!');
$('p').linkify();
```

## Downloads

**[linkify](#api)** _(required)_<br> [`.min.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify.min.js) · [`.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify.js) · [`.amd.min.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify.amd.min.js) · [`.amd.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify.amd.js)

**Plugins** _(optional)_

* **[hashtag](#linkify-plugin-hashtag)**<br> [`.min.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify-plugin-hashtag.min.js) · [`.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify-plugin-hashtag.js) · [`.amd.min.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify-plugin-hashtag.amd.min.js) · [`.amd.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify-plugin-hashtag.amd.js)

**Interfaces** _(recommended - include at least one)_

* **[string](#linkify-string)**<br> [`.min.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify-string.min.js) · [`.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify-string.js) · [`.amd.min.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify-string.amd.min.js) · [`.amd.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify-string.amd.js)
* **[jquery](#linkify-jquery)**<br> [`.min.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify-jquery.min.js) · [`.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify-jquery.js) · [`.amd.min.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify-jquery.amd.min.js) · [`.amd.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify-jquery.amd.js)
* **[element](#linkify-element)** _(Included with linkify-jquery)_<br> [`.min.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify-element.min.js) · [`.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify-element.js) · [`.amd.min.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify-element.amd.min.js) · [`.amd.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify-element.amd.js)


## API

**Jump To**

* [Standard](#standard-linkify)
* [`string`](#linkify-string)
* [`jquery`](#linkify-jquery)
  - [DOM Data API](#dom-data-api)
* [`element`](#linkify-element)
* [Options](#options)
* [Plugins](#plugins)

### Standard `linkify`

#### Installation

##### Node.js/io.js/Browserify

```js
var linkify = require('linkifyjs');
```

##### AMD

```html
<script src="linkify.amd.js"></script>
<script>
    require(['linkify'], function (linkify) {
        // ...
    });
</script>
```

##### Browser globals
```html
<script src="linkify.js"></script>
```

#### Methods

##### `linkify.find` _(`str` [, `type`])_

Finds all links in the given string

**Params**

* _`String`_ **`str`** Search string
* _`String`_ [**`type`**] (Optional) only find links of the given type

**Returns** _`Array`_ List of links where each element is a hash with properties `type`, `value`, and `href`.

* `type` is the type of entity found. Possible values are
  - `'url'`
  - `'email'`
  - `'hashtag'` (with Hashtag plugin)
* `value` is the original entity substring.
* `href` should be the value of this link's `href` attribute.

```js
linkify.find('For help with GitHub.com, please email support@github.com');
```

Returns the array

```js
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
```

##### `linkify.test` _(`str` [, `type`])_

Is the given string a link? Not to be used for strict validation - See [Caveats](#)

**Params**

* _`String`_ **`str`** Test string
* _`String`_ [**`type`**] (Optional) returns `true` only if the link is of the given type (see `linkify.find`),

**Returns** _`Boolean`_

```js
linkify.test('google.com'); // true
linkify.test('google.com', 'email'); // false
```

#### `linkify.tokenize` _(`str`)_

Internal method used to perform lexicographical analysis on the given string and output the resulting token array.

**Params**

* _`String`_ **`str`**

**Returns** _`Array`_


### `linkify-jquery`

Provides the Linkify jQuery plugin.

#### Installation

##### Node.js/io.js/Browserify

```js
var $ = require('jquery');
require('linkifyjs/jquery')($, document);
```

Where the second argument is your `window.document` implementation (not required for Browserify).

##### AMD

Note that `linkify-jquery` requires a `jquery` module.

```html
<script src="jquery.amd.js"></script>
<script src="linkify.amd.js"></script>
<script src="linkify-jquery.amd.js"></script>
```

```js
require(['jquery'], function ($) {
  // ...
});
```

##### Browser globals

```html
<script src="jquery.js"></script>
<script src="linkify.js"></script>
<script src="linkify-jquery.js"></script>
```

#### Usage

```js
var options = { /* ... */ };
$(selector).linkify(options);
```

**Params**

* _`Object`_ [**`options`**] [Options hash](#options)

See [all available options](#options).

#### DOM Data API

The jQuery plugin also provides a DOM data/HTML API - no extra JavaScript required!

```html
<!-- Find and linkify all entities in this div -->
<div data-linkify="this">...</div>

<!-- Find and linkify the paragraphs and `#footer` element in the body -->
<body data-linkify="p, #footer">...</body>
```

[Additional data options](#options) are available.

### `linkify-string`

Interface for replacing links within native strings with anchor tags. Note that this function will ***not*** parse HTML strings properly - use [`linkify-element`](#linkify-element) or [`linkify-jquery`](#linkify-jquery) instead.

#### Installation

##### Node.js/io.js/Browserify

```js
var linkifyStr = require('linkifyjs/string');
```

##### AMD

```html
<script src="linkify.amd.js"></script>
<script src="linkify-string.amd.js"></script>
<script>
    require(['linkify-string'], function (linkifyStr) {
        // ...
    });
</script>
```

##### Browser globals

```html
<script src="linkify.js"></script>
<script src="linkify-string.js"></script>
```

#### Usage

```js
var options = {/* ... */};
var str = 'For help with GitHub.com, please email support@github.com';
linkifyStr(str, options);
// or
str.linkify(options);
```

Returns

```js
'For help with <a href="http://github.com" target="_blank">GitHub.com</a>, please email <a href="mailto:support@github.com">support@github.com</a>'
```

**Params**

* _`String`_ **`str`** String to linkify
* _`Object`_ [**`options`**] [Options hash](#)

**Returns** _`String`_ Linkified string


### Plugins

Plugins provide no new interfaces but add additional detection functionality to Linkify. A custom plugin API is currently in the works.

**Note:** Plugins should be included before interfaces.

#### General Installation

##### Node.js/io.js/Browserify

```js
var linkify = require('linkifyjs')
require('linkifyjs/plugin/<name>')(linkify);
```

##### AMD

```html
<script src="linkify.amd.js"></script>
<script src="linkify-plugin-<name>.amd.js"></script>
```

##### Browser globals

```html
<script src="linkify.js"></script>
<script src="linkify-plugin-<name>.js"></script>
```

#### `hashtag` Plugin

Adds basic support for Twitter-style hashtags.

```js
var linkify = require('linkifyjs');
require('linkifyjs/plugins/hashtag')(linkify);
```

```js
var options = {/* ... */};
var str = "Linkify is #super #rad2015";

linkify.find(str);
```

Returns the following array

```js
[
  {
    type: 'hashtag',
    value: "#super",
    href: "#super"
  },
  {
    type: 'hashtag',
    value: "#rad2015",
    href: "#rad2015"
  }
]
```

## Options

Linkify is applied with the following default options. Below is a description of each.

```js
var options = {
  defaultProtocol: 'http',
  format: null,
  formatHref: null,
  linkAttributes: null,
  linkClass: 'linkified',
  nl2br: false,
  tagName: 'a',
  target: function (type) {
    return type === 'url' ? '_blank' : null;
  }
};
```

### Usage

```js
linkifyStr(str, options); // or `str.linkify(options)`
linkifyElement(document.getElementById(id), options);
$(selector).linkify(options);
```

#### `defaultProtocol`

**Type**: `String`<br>
**Default**: `'http'`<br>
**Values**: `'http'`, `'https'`, `'ftp'`, `'ftps'`, etc.<br>
**Data API**: `data-linkify-default-protocol`<br>

Protocol that should be used in `href` attributes for URLs without a protocol (e.g., `github.com`).

#### `format`

**Type**: `Function (String value, String type)`<br>
**Default**: `null`<br>

Format the text displayed by a linkified entity. e.g., truncate a long URL.

```js
'http://github.com/SoapBox/linkifyjs/search/?q=this+is+a+really+long+query+string'.linkify({
  format: function (value, type) {
    if (type === 'url' && value.length > 50) {
      value = value.slice(0, 50) + '…';
    }
    return value;
  }
});
```

#### `formatHref`

#### `nl2br`

#### `tagName`

#### `target`

#### `linkAttributes`

#### `linkClass`

## Plugin API

Coming soon

## Caveats

## Contributing

## Authors
Linkify is handcrafted with Love by [SoapBox Innovations, Inc](http://soapboxhq.com).
