---
layout: doc
title: linkify-string · Documentation
---

Interface for replacing links within native strings with anchor tags. Note that this function will ***not*** parse HTML strings properly - use [`linkify-element`](#linkify-element) or [`linkify-jquery`](#linkify-jquery) instead.

## Installation

### Node.js/io.js/Browserify

```js
var linkifyStr = require('linkifyjs/string');
```

### AMD

```html
<script src="linkify.amd.js"></script>
<script src="linkify-string.amd.js"></script>
<script>
    require(['linkify-string'], function (linkifyStr) {
        // ...
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

