# Linkify

[![npm version](https://badge.fury.io/js/linkifyjs.svg)](https://www.npmjs.com/package/linkifyjs)
[![Build Status](https://travis-ci.org/SoapBox/linkifyjs.svg)](https://travis-ci.org/SoapBox/linkifyjs)
[![Sauce Test Status](https://saucelabs.com/buildstatus/nfrasser)](https://saucelabs.com/u/nfrasser)
[![Coverage Status](https://coveralls.io/repos/SoapBox/linkifyjs/badge.svg?branch=master)](https://coveralls.io/r/SoapBox/linkifyjs?branch=master)

[![Build Status](https://saucelabs.com/open_sauce/build_matrix/nfrasser.svg)](https://saucelabs.com/beta/builds/c63720f642964f77927b2fda198b4a94)

Linkify is a small yet comprehensive JavaScript plugin for finding URLs in plain-text and converting them to HTML links. It works with all valid URLs and email addresses.

**A build repository is maintained [here](https://github.com/nfrasser/linkify-shim).**

__Jump to__

- [Features](#features)
- [Demo](#demo)
- [Installation and Usage](#installation-and-usage)
  - [Quick Start](#quick-start)
  - [Node.js/Browserify](#nodejsbrowserify)
  - [AMD Modules](#amd)
  - [Browser](#browser-globals)
- [Browser Support](#browser-support)
- [Node.js Support](#nodejs-support)
- [Downloads](#downloads)
- [API Documentation](#api-documentation)
- [Caveats](#caveats)
- [Contributing](#contributing)
- [License](#license)

## Features

* **Accuracy**<br>Linkify uses a (close to) complete list of valid top-level domains to ensure that only valid URLs and email addresses are matched.
* **Speed**<br>Each string is analyzed exactly once to detect every kind of linkable entity
* **Extensibility**<br>Linkify is designed to be fast and lightweight, but comes with a powerful plugin API that lets you detect even more information like #hashtags and @mentions.
* **Small footprint**<br>Linkify and its jQuery interface clock in at approximately 15KB minified (5KB gzipped) - approximately 50% the size of Twitter Text
* **Modern implementation**<br>Linkify is written in ECMAScript6 and compiles to ES5 for modern JavaScript runtimes.
  * Linkify is compatible with all modern browsers, as well as Internet Explorer 9 and up.

## Demo
[Launch demo](http://soapbox.github.io/linkifyjs/)

## Installation and Usage

[View full documentation](http://soapbox.github.io/linkifyjs/docs/).

Download the [latest release](https://github.com/SoapBox/linkifyjs/releases), or install via [NPM](https://www.npmjs.com/)

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
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<script src="linkify.min.js"></script>
<script src="linkify-jquery.min.js"></script>
```

**Note:** A [polyfill](#browser-support) is required for Internet Explorer 8.

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


### Node.js/Browserify

```js
var linkify = require('linkifyjs');
require('linkifyjs/plugins/hashtag')(linkify); // optional
var linkifyHtml = require('linkifyjs/html');
```

#### Example string usage

```js
linkifyHtml('The site github.com is #awesome.', {
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
    className: 'my-link'
  });

  // Linkify all paragraph tags
  document.getElementsByTagName('p').map(linkifyElement);
});

```

Note that if you are using `linkify-jquery.amd.js`, a `jquery` module must be defined.

### Browser globals

```html
<script src="react.js"></script>
<script src="react-dom.js"></script>
<script src="linkify.js"></script>
<script src="linkify-react.js"></script>
```

```jsx
linkify.test('dev@example.com'); // true

ReactDOM.render(
  <Linkify options={{ignoreTags: ['style']}}>
    Check out soapboxhq.com it is great!
  </Linkify>,
  document.getElementById('#container');
);
```

## Browser Support

Linkify works on all modern brwosers.

Linkify natively supports Internet Explorer 9 and above. Internet Explorer 8 is unofficially supported with a polyfill.

You can use either [es5-shim](https://github.com/es-shims/es5-shim) (sham also required) or the provided `linkify-polyfill.js`:

```html
<script src="jquery.js"></script>

<!--[if IE 8]>
<script src="linkify-polyfill.js"></script>
<![endif]-->
<script src="linkify.js"></script>
<script src="linkify-jquery.js"></script>
```

## Node.js Support

Linkify is tested on Node.js 8 and up. Older versions are unofficially supported.

## Downloads

Download the [**latest release**](https://github.com/SoapBox/linkifyjs/releases) or clone the [**build repository**](https://github.com/nfrasser/linkify-shim).

**[linkify](http://soapbox.github.io/linkifyjs/docs/linkify.html)** _(required)_<br> [`.min.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify.min.js) · [`.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify.js) · [`.amd.min.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify.amd.min.js) · [`.amd.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify.amd.js)

**Plugins** _(optional)_

* **[hashtag](http://soapbox.github.io/linkifyjs/docs/plugin-hashtag.html)**<br> [`.min.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify-plugin-hashtag.min.js) · [`.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify-plugin-hashtag.js) · [`.amd.min.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify-plugin-hashtag.amd.min.js) · [`.amd.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify-plugin-hashtag.amd.js)

**Interfaces** _(recommended - include at least one)_

* **[react](http://soapbox.github.io/linkifyjs/docs/linkify-react.html)**<br> [`.min.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify-react.min.js) · [`.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify-react.js) · [`.amd.min.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify-react.amd.min.js) · [`.amd.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify-react.amd.js)
* **[jquery](http://soapbox.github.io/linkifyjs/docs/linkify-jquery.html)**<br> [`.min.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify-jquery.min.js) · [`.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify-jquery.js) · [`.amd.min.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify-jquery.amd.min.js) · [`.amd.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify-jquery.amd.js)
* **[html](http://soapbox.github.io/linkifyjs/docs/linkify-html.html)**<br> [`.min.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify-html.min.js) · [`.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify-html.js) · [`.amd.min.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify-html.amd.min.js) · [`.amd.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify-html.amd.js)
* **[element](http://soapbox.github.io/linkifyjs/docs/linkify-element.html)** _(Included with linkify-jquery)_<br> [`.min.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify-element.min.js) · [`.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify-element.js) · [`.amd.min.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify-element.amd.min.js) · [`.amd.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify-element.amd.js)
* **[string](http://soapbox.github.io/linkifyjs/docs/linkify-string.html)**<br> [`.min.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify-string.min.js) · [`.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify-string.js) · [`.amd.min.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify-string.amd.min.js) · [`.amd.js`](https://github.com/nfrasser/linkify-shim/raw/master/linkify-string.amd.js)


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
