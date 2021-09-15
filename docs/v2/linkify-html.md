---
layout: doc
title: linkify-html · Documentation
---

# Linkify HTML String Interface

`linkify-html` is an interface for replacing links with anchor tags within
JavaScript strings containing HTML.

## Installation

### Node.js/Browserify

```
npm install linkifyjs
```

```js
var linkifyHtml = require('linkifyjs/html');
```

or with ES6 modules

```js
import linkifyHtml from 'linkifyjs/html';
```

### AMD

```html
<script src="linkify.amd.js"></script>
<script src="linkify-html.amd.js"></script>
<script>
  require(['linkify-html'], function (linkifyHtml) {
    // …
  });
</script>
```

### Browser globals

```html
<script src="linkify.js"></script>
<script src="linkify-html.js"></script>
```

## Usage

```js
var options = {/* … */};
var str = '<p>For help with GitHub.com, please email support@github.com</p>';
linkifyHtml(str, options);
```

Returns

```js
'<p>For help with <a href="http://github.com" target="_blank">GitHub.com</a>, please email <a href="mailto:support@github.com">support@github.com</a></p>'
```

**Params**

* _`String`_ **`str`** String to linkify
* _`Object`_ [**`options`**] [Options](options.html) object

**Returns** _`String`_ Linkified htmlString
