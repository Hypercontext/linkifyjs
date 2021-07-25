---
layout: docv3
title: linkify-string · Documentation
toc: true
---

# Linkify String Interface

Use `linkify-string` to replace links in plain-text strings with anchor tags.

This function will ***not*** parse strings with HTML. Use one of the
following instead, depending on your application:

* [`linkify-html`](linkify-html.html)
* [`linkify-element`](linkify-element.html)
* [`linkify-jquery`](linkify-html.html)

## Installation

### Node.js module

Install from the command line with NPM
```
npm install linkifyjs linkify-string
```

Import into your JavaScript with `require`
```js
const linkifyStr = require('linkify-string');
```

or with ES modules
```js
import linkifyStr from 'linkify-string';
```

### Browser globals

[Download linkify](https://github.com/SoapBox/linkifyjs/releases/download/v{{ site.version }}/linkifyjs.zip)
and extract the contents into your website's assets directory.
Include the following scripts in your HTML:

```html
<script src="linkify.js"></script>
<script src="linkify-string.js"></script>
```

## Usage

```js
const options = {/* … */};
const str = 'For help with GitHub.com, please email support@github.com';
linkifyStr(str, options);
// or
str.linkify(options);
```

Returns

```js
'For help with <a href="http://github.com" target="_blank">GitHub.com</a>, please email <a href="mailto:support@github.com">support@github.com</a>'
```

## Usage with HTML

`linkify-string` automatically escapes HTML input.

```js
const options = {/* … */};
const str = '<p>For help with GitHub.com, please email support@github.com</p>';
linkifyStr(str, options);
// or
str.linkify(options);
```

Returns

```js
'&lt;p&gt;For help with <a href="http://github.com">GitHub.com</a>, please email <a href="mailto:support@github.com">support@github.com</a>&lt;/p&gt;'
```

See [Cross-Site Scripting](xss.html) for more about linkify and XSS.

Use [`linkify-html`](linkify-html.html) if you'd like to preserve all HTML
entities.

**Params**

* _`string`_ **`str`** String to linkify
* _`Object`_ [**`options`**] [Options](options.html) object

**Returns** _`string`_ Linkified string
