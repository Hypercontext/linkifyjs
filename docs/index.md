---
layout: docv3
title: Documentation
---

# Installation and Getting Started

[Download](https://github.com/{{ site.github_username }}/releases/download/v{{ site.version }}/linkifyjs.zip) the latest release or install via [NPM](https://www.npmjs.com/)

```
npm install linkifyjs linkify-html
```

## Quick Start

### Option 1: Import with a module loader

When developing in an environment with JavaScript module loader such as Webpack,
use an `import` statement:

```js
import * as linkify from "linkifyjs";
import linkifyHtml from "linkify-html";
```

Or in Node.js with CommonJS modules

```js
const linkify = require("linkifyjs");
const linkifyHtml = require("linkify-html");
```

### Option 2: Download and import for direct use in the browser

If using JavaScript directly in the browser, [download the latest release](https://github.com/{{ site.github_username }}/releases/download/v{{ site.version }}/linkifyjs.zip)
and add `linkify` and `linkify-html` scripts to your HTML:

```html
<script src="linkify.min.js"></script>
<script src="linkify-html.min.js"></script>
```

**Note:** When linkify-ing text that does not contain HTML, install and use the
`linkify-string` package instead of `linkify-html`. [Read more about Linkify's
interfaces](interfaces.html).

### Option 3: Import from a CDN

Include Linkify in your HTML from any NPM-compatible CDN such as
[jsDelivr](https://www.jsdelivr.com/package/npm/linkifyjs?path=dist). The latest
browser scripts are located in the `dist` subdirectory. This applies
to `linkifyjs` and all related modules such as `linkify-react` or
`linkify-plugin-hashtag`

```html
<script src="https://cdn.jsdelivr.net/npm/linkifyjs@{{ site.version }}/dist/linkify.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/linkify-html@{{ site.version }}/dist/linkify-html.min.js"></script>
```

This also creates global variables `linkify` and `linkifyHtml`

## Usage

### Example 1: Convert all links to &lt;a&gt; tags in the given string

```js
const options = { defaultProtocol: "https" };
linkifyHtml(
  "Any links to github.com here? If not, contact test@example.com",
  options
);
```

Returns the following string:

```js
'Any links to <a href="https://github.com">github.com</a> here? If not, contact <a href="mailto:test@example.com">test@example.com</a>';
```

To modify the resulting links with a target attribute, class name and more, [use
the available options](options.html).

### Example 2: Find all links in the given string

```js
linkify.find("Any links to github.com here? If not, contact test@example.com");
```

Returns the following array

```js
[
  {
    type: "url",
    value: "github.com",
    isLink: true,
    href: "http://github.com",
    start: 13,
    end: 23,
  },
  {
    type: "email",
    value: "test@example.com",
    isLink: true,
    href: "mailto:test@example.com",
    start: 46,
    end: 62,
  },
];
```

### Example 3: Check whether a string is a valid link:

Check if as string is a valid URL or email address:

```js
linkify.test("github.com"); // true
```

Check if a string is a valid email address:

```js
linkify.test("github.com", "email"); // false
linkify.test("noreply@github.com", "email"); // true
```

## Usage with React, jQuery or the browser DOM

[Read the interface documentation](interfaces.html) to learn how to use linkify
when working with a specific JavaScript environment such as React.

## Plugins for @mentions, #hashtags and more

By default Linkify will only detect and highlight web URLs and e-mail addresses.
Plugins for @mentions, #hashtags and more may be installed separately. [Read the
plugin documentation](plugins.html).

## Browser Support

Linkify natively supports all modern browsers. Linkify is tested on Internet
Explorer 11 and above.
