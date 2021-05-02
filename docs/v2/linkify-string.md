---
layout: doc
title: linkify-string · Documentation
toc: true
---

# Linkify String Interface

`linkify-string` is an interface for replacing links with anchor tags within
JavaScript strings.

Note that this function will ***not*** parse HTML strings properly - use
[`linkify-html`](linkify-html.html) instead. Alternatively, if you're using
linkify with a DOM, use [`linkify-jquery`](linkify-html.html) or
[`linkify-element`](linkify-element.html)


## Installation

### Node.js/Browserify

```
npm install linkifyjs
```

```js
var linkifyStr = require('linkifyjs/string');
```
or with ES6 modules

```js
import linkifyStr from 'linkifyjs/string';
```

### AMD

```html
<script src="linkify.amd.js"></script>
<script src="linkify-string.amd.js"></script>
<script>
  require(['linkify-string'], function (linkifyStr) {
    // …
  });
</script>
```

### Browser globals

```html
<script src="linkify.js"></script>
<script src="linkify-string.js"></script>
```

## Usage

```js
var options = {/* … */};
var str = 'For help with GitHub.com, please email support@github.com';
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
var options = {/* … */};
var str = '<p>For help with GitHub.com, please email support@github.com</p>';
linkifyStr(str, options);
// or
str.linkify(options);
```

Returns

```js
'&lt;p&gt;For help with <a href="http://github.com" class="linkified" target="_blank">GitHub.com</a>, please email <a href="mailto:support@github.com" class="linkified">support@github.com</a>&lt;/p&gt;'
```

See [Caveats](caveats.html#cross-site-scripting) for more about linkify and XSS.

Use [`linkify-html`](linkify-html.html) if you'd like to preserve all HTML
entities.

**Params**

* _`String`_ **`str`** String to linkify
* _`Object`_ [**`options`**] [Options](options.html) object

**Returns** _`String`_ Linkified string
