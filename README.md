# Linkify

[![npm version](https://badge.fury.io/js/linkifyjs.svg)](https://www.npmjs.com/package/linkifyjs)
[![CI](https://github.com/Hypercontext/linkifyjs/actions/workflows/ci.yml/badge.svg)](https://github.com/Hypercontext/linkifyjs/actions/workflows/ci.yml)
[![BrowserStack Status](https://automate.browserstack.com/badge.svg?badge_key=Nm10R2lEUWhlNllCbCtqZ0U0Ky9rdGpTTTlocWdvd1RJbmFncTI3QUsybz0tLTZsZmpwV2ZpMWVJSnZxZGc4endOV3c9PQ==--19d1fef3f3d126c4c5f379fd323c9087f07202ba)](https://automate.browserstack.com/public-build/Nm10R2lEUWhlNllCbCtqZ0U0Ky9rdGpTTTlocWdvd1RJbmFncTI3QUsybz0tLTZsZmpwV2ZpMWVJSnZxZGc4endOV3c9PQ==--19d1fef3f3d126c4c5f379fd323c9087f07202ba)
[![Coverage Status](https://coveralls.io/repos/github/Hypercontext/linkifyjs/badge.svg?branch=main)](https://coveralls.io/github/Hypercontext/linkifyjs?branch=main)

Linkify is a JavaScript plugin. Use Linkify to find links in plain-text and
convert them to HTML &lt;a&gt; tags. It automatically highlights URLs,
#hashtags, @mentions and more.

__Jump to__

- [Features](#features)
- [Demo](#demo)
- [Installation and Usage](#installation-and-usage)
- [Browser Support](#browser-support)
- [Node.js Support](#nodejs-support)
- [Downloads](#downloads)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Features

* Detect URLs and email addresses
* #hashtag, @mention and #-ticket plugins
* React and jQuery support
* Multi-language and emoji support
* Custom link plugins
* Fast, accurate and small footprint (~30kB minified, ~15kB gzipped)
* 99% test coverage
* Compatible with all modern browsers (Internet Explorer 11 and up)

## Demo
[Launch demo](https://linkify.js.org/#demo)

## Installation and Usage

[View full documentation](https://linkify.js.org/docs/).

Download the [latest release](https://github.com/Hypercontext/linkifyjs/releases) for direct use in the browser, or install via [NPM](https://www.npmjs.com/):

```
npm install linkifyjs linkify-html
```

### Quick Start

When developing in an environment with JavaScript module loader such as Webpack,
use an `import` statement:

```js
import * as linkify from 'linkifyjs';
import linkifyHtml from 'linkify-html';
```

Or in Node.js with CommonJS modules

```js
const linkify = require('linkifyjs');
const linkifyHtml = require('linkify-html');
```

**Note:** When linkify-ing text that does not contain HTML, install and use the
`linkify-string` package instead of `linkify-html`. [Read more about Linkify's
interfaces](https://linkify.js.org/docs/interfaces.html).

### Usage

#### Example 1: Convert all links to &lt;a&gt; tags in the given string

```js
const options = { defaultProtocol: 'https' };
linkifyHtml('Any links to github.com here? If not, contact test@example.com', options);
```

Returns the following string:

```js
'Any links to <a href="https://github.com">github.com</a> here? If not, contact <a href="mailto:test@example.com">test@example.com</a>'
```

To modify the resulting links with a target attribute, class name and more, [use
the available options](https://linkify.js.org/docs/options.html).

#### Example 2: Find all links in the given string

```js
linkify.find('Any links to github.com here? If not, contact test@example.com');
```

Returns the following array

```js
[
  {
    type: 'url',
    value: 'github.com',
    isLink: true,
    href: 'http://github.com',
    start: 13,
    end: 23
  },
  {
    type: 'email',
    value: 'test@example.com',
    isLink: true,
    href: 'mailto:test@example.com',
    start: 46,
    end: 62
  }
]
```

#### Example 3: Check whether a string is a valid link:

Check if as string is a valid URL or email address:

```js
linkify.test('github.com'); // true
```

Check if a string is a valid email address:

```js
linkify.test('github.com', 'email'); // false
linkify.test('noreply@github.com', 'email'); // true
```

### Usage with React, jQuery or the browser DOM

[Read the interface documentation](https://linkify.js.org/docs/interfaces.html)  to learn how to use linkify when working with a specific JavaScript environment such as React.

### Plugins for @mentions, #hashtags and more

By default Linkify will only detect and highlight web URLs and e-mail addresses.
Plugins for @mentions, #hashtags and more may be installed separately. [Read the
plugin documentation](https://linkify.js.org/docs/plugins.html).

## Browser Support

Linkify natively supports all modern browsers. Linkify is tested on Internet
Explorer 11 and above.

## Node.js Support

Linkify is tested on Node.js 10 and up. Older versions are unofficially supported.

## Downloads

Download the [**latest release**](https://github.com/Hypercontext/linkifyjs/releases)

## API Documentation

View full documentation at [linkify.js.org/docs](https://linkify.js.org/docs/)

## Contributing

Check out [CONTRIBUTING.md](https://github.com/Hypercontext/linkifyjs/blob/main/CONTRIBUTING.md).

## License

MIT

## Authors

Linkify is made with ❤️ by [Hypercontext](https://hypercontext.com/) and [@nfrasser](https://github.com/nfrasser)
