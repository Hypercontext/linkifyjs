# Linkify

[![npm version](https://badge.fury.io/js/linkifyjs.svg)](https://www.npmjs.com/package/linkifyjs)
[![Dependency Status](https://gemnasium.com/SoapBox/linkifyjs.svg)](https://gemnasium.com/SoapBox/linkifyjs)
[![Build Status](https://travis-ci.org/SoapBox/linkifyjs.svg)](https://travis-ci.org/SoapBox/linkifyjs)
[![Coverage Status](https://coveralls.io/repos/SoapBox/linkifyjs/badge.svg)](https://coveralls.io/r/SoapBox/linkifyjs)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/nfrasser.svg)](https://saucelabs.com/u/nfrasser)

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
- [API Documentation](#api-documentation)
- [Caveats](#caveats)
- [Contributing](#contributing)
- [License](#license)

## Features

* **Accuracy**<br>Linkify uses a (close to) complete list of valid top-level domains to ensure that only valid URLs and email addresses are matched.
* **Speed**<br>Each string is analyzied exactly once to detect every kind of linkable entity
* **Extensibility**<br>Linkify is designed to be fast and lightweight, but comes with a powerful plugin API that lets you detect even more information like #hashtags and @mentions.
* **Small footprint**<br>Linkify and its jQuery interface clock in at approximately 15KB minified (5KB gzipped) - approximately 50% the size of Twitter Text
* **Modern implementation**<br>Linkify is written in ECMAScript6 and compiles to ES5 for modern JavaScript runtimes.
  * Linkify is compatible with all modern browsers, as well as Internet Explorer 9 and up. Full IE8 support coming soon.

## Demo
[Launch demo](http://soapbox.github.io/linkifyjs/)

## Installation and Usage

[View full documentation](http://soapbox.github.io/linkifyjs/docs/).

[Download](#downloads) the latest below or install via [NPM](https://www.npmjs.com/)

```
npm install linkifyjs
```

or [Bower](http://bower.io/)

```
bower install linkifyjs
```

### Quick Start

Add [linkify](https://github.com/nfrasser/linkify-shim/raw/master/linkify.min.js) and [linkify-jquery](https://github.com/nfrasser/linkify-shim/raw/master/linkify-jquery.min.js) to your HTML following jQuery:

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

See [all available options](http://soapbox.github.io/linkifyjs/docs/options.html)


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
  linkifyElement(document.getElementById('sidebar'), {
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

**[linkify](http://soapbox.github.io/linkifyjs/docs/linkify.html)** _(required)_<br> [`.min.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify.min.js) · [`.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify.js) · [`.amd.min.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify.amd.min.js) · [`.amd.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify.amd.js)

**Plugins** _(optional)_

* **[hashtag](http://soapbox.github.io/linkifyjs/docs/plugin-hashtag.html)**<br> [`.min.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify-plugin-hashtag.min.js) · [`.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify-plugin-hashtag.js) · [`.amd.min.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify-plugin-hashtag.amd.min.js) · [`.amd.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify-plugin-hashtag.amd.js)

**Interfaces** _(recommended - include at least one)_

* **[string](http://soapbox.github.io/linkifyjs/docs/linkify-string.html)**<br> [`.min.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify-string.min.js) · [`.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify-string.js) · [`.amd.min.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify-string.amd.min.js) · [`.amd.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify-string.amd.js)
* **[jquery](http://soapbox.github.io/linkifyjs/docs/linkify-jquery.html)**<br> [`.min.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify-jquery.min.js) · [`.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify-jquery.js) · [`.amd.min.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify-jquery.amd.min.js) · [`.amd.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify-jquery.amd.js)
* **[element](http://soapbox.github.io/linkifyjs/docs/linkify-element.html)** _(Included with linkify-jquery)_<br> [`.min.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify-element.min.js) · [`.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify-element.js) · [`.amd.min.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify-element.amd.min.js) · [`.amd.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify-element.amd.js)


## API Documentation

View full documentation at [soapbox.github.io/linkifyjs/docs/](http://soapbox.github.io/linkifyjs/docs/).

## Caveats

The core linkify library (excluding plugins) attempts to find emails and URLs that match RFC specifications. However, it doesn't always get it right.

Here are a few of the known issues.

* Non-standard email local parts delimited by " (quote characters)
  * Emails with quotes in the localpart are detected correctly, unless the quotes contain certain characters like `@`.
* Slash characters in email addresses
* Non-latin domains or TLDs are not supported (support may be added via plugin in the future)

## Contributing

Check out [CONTRIBUTING.md](https://github.com/SoapBox/linkifyjs/blob/master/CONTRIBUTING.md).

## License

MIT

## Authors

Linkify is built with Love™ and maintained by [SoapBox Innovations](http://soapboxhq.com).
