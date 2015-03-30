---
layout: doc
title: linkify-element · Documentation
---

Interface for replacing links within native DOM elements with anchor tags. Note that `linkify-element` is included with `linkify-jquery`, so you do not have to install it if you are using `linkify-jquery`.

## Installation

### Node.js/io.js/Browserify

```js
var linkifyElement = require('linkifyjs/element');
```

### AMD

```html
<script src="linkify.amd.js"></script>
<script src="linkify-element.amd.js"></script>
<script>
    require(['linkify-element'], function (linkifyElement) {
        // ...
    });
</script>
```

### Browser globals

```html
<script src="linkify.js"></script>
<script src="linkify-element.js"></script>
```

## Usage

```js
var options = {/* ... */};
linkifyElement(document.getElementById('id'), options, document);
```

This recursively finds links in text nodes within element `#id`.

**Params**

* _`HTMLElement`_ **`element`** DOM Element to linkify
* _`Object`_ [**`options`**]  [Options](#) hash
* _`HTMLDocument`_ [**`doc`**] Explicitly pass in the document object or document implementation if on a non-browser environment like Node.js

**Returns** _`HTMLElement`_ **`element`** The same element provided as input

