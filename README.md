# Linkify

[![npm version](https://badge.fury.io/js/linkifyjs.svg)](https://www.npmjs.com/package/linkifyjs)
[![CI](https://github.com/Soapbox/linkifyjs/actions/workflows/ci.yml/badge.svg)](https://github.com/Soapbox/linkifyjs/actions/workflows/ci.yml)
[![BrowserStack Status](https://automate.browserstack.com/badge.svg?badge_key=MEY1aklrOVlacVR3UFlQSXJ1cnd2Q3E4ckF3SWYwU1QwUTdhYlB2WHgxST0tLWcxUlhVckFiQUN3YkYrZHJQRHUyZ0E9PQ==--b974ce8f45b084b7e3a8eea67d8307971a829ab8)](https://automate.browserstack.com/public-build/MEY1aklrOVlacVR3UFlQSXJ1cnd2Q3E4ckF3SWYwU1QwUTdhYlB2WHgxST0tLWcxUlhVckFiQUN3YkYrZHJQRHUyZ0E9PQ==--b974ce8f45b084b7e3a8eea67d8307971a829ab8)
[![Coverage Status](https://coveralls.io/repos/github/Soapbox/linkifyjs/badge.svg?branch=master)](https://coveralls.io/github/Soapbox/linkifyjs?branch=master)

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
* **Internationalization**<br>Linkify detects Internationalized Domains, hashtags and more in any language
* **Extensibility**<br>Linkify is designed to be fast and lightweight, but comes with a powerful plugin API that lets you detect even more information like #hashtags and @mentions.
* **Small footprint**<br>Linkify and its string element interface clock in at approximately 30KB minified (15KB gzipped)
* **Modern implementation**<br>Linkify is written in ECMAScript 2015+ and compiles to ES5 for modern JavaScript runtimes.
  * Linkify is compatible with all modern browsers, as well as Internet Explorer 11 and up.

## Demo
[Launch demo](http://soapbox.github.io/linkifyjs/)

## Installation and Usage

[View full documentation](http://soapbox.github.io/linkifyjs/docs/).

Download the [latest release](https://github.com/SoapBox/linkifyjs/releases), or install via [NPM](https://www.npmjs.com/)

```
npm install --save linkifyjs
```

or [Yarn](https://yarnpkg.com/)

```
yarn add linkifyjs
```

### Quick Start

Add [linkify](https://github.com/nfrasser/linkify-shim/raw/master/linkify.min.js) and [linkify-element](https://github.com/nfrasser/linkify-shim/raw/master/linkify-element.min.js) to your HTML following jQuery:

```html
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<script src="linkify.min.js"></script>
<script src="linkify-element.min.js"></script>
```

#### Find all links and convert them to anchor tags

```js
// Linkify single element
linkifyElement(document.getElementById('content'));

// Linkify all paragraphs
for (const element of document.querySelectorAll('p')) {
  linkifyElement(element);
}

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

### ES Modules

```js
import * as linkify from 'linkifyjs';
import 'linkifyjs/plugins/hashtag'; // optional
import linkifyHtml from 'linkifyjs/html';
```

### Node.js / CommonJS modules

```js
const linkify = require('linkifyjs');
require('linkifyjs/plugins/hashtag'); // optional
const linkifyHtml = require('linkifyjs/html');
```

### Example string usage

```js
linkifyHtml('The site github.com is #awesome.', {
  defaultProtocol: 'https'
});
```

Returns the following string

```js
'The site <a href="https://github.com">github.com</a> is <a href="#awesome">#awesome</a>.'
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

Linkify works on all modern browsers and Internet Explorer 11.

## Node.js Support

Linkify is tested on Node.js 10 and up. Older versions are unofficially supported.

## Downloads

Download the [**latest release**](https://github.com/SoapBox/linkifyjs/releases)

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

## Contributing

Check out [CONTRIBUTING.md](https://github.com/SoapBox/linkifyjs/blob/master/CONTRIBUTING.md).

## License

MIT

## Authors

Linkify is built with Love™ and maintained by [SoapBox Innovations](http://soapboxhq.com).
