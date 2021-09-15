---
layout: doc
title: linkify-jquery · Documentation
toc: true
---

# Linkify jQuery Interface

`linkify-jquery` is an provides the Linkify jQuery plugin. This functionality is
also available in vanilla JavaScript via
[linkify-element](linkify-element.html).

## Installation

### Node.js/Browserify

```
npm install linkifyjs
```

```js
var $ = require('jquery');
require('linkifyjs/jquery')($, document);
```

or with ES6 modules

```js
import $ from 'jquery';
import linkifyJq from 'linkifyjs/jquery';
linkifyJq($, document);
```

Where the second argument is your `window.document` implementation (not required for Browserify).

### AMD

Note that `linkify-jquery` requires a `jquery` module.

```html
<script src="jquery.amd.js"></script>
<script src="linkify.amd.js"></script>
<script src="linkify-jquery.amd.js"></script>
```

```js
require(['jquery'], function ($) {
  // …
});
```

### Browser globals

```html
<script src="jquery.js"></script>
<script src="linkify.js"></script>
<script src="linkify-jquery.js"></script>
```

## Usage

```js
var options = { /* … */ };
$(selector).linkify(options);
```

**Params**

* _`Object`_ [**`options`**] [Options](options.html) object

See [all available options](options.html).

## DOM Data API

The jQuery plugin also provides a DOM data/HTML API - no extra JavaScript required!

```html
<!-- Find and linkify all entities in this div -->
<div data-linkify="this">…</div>

<!-- Find and linkify the paragraphs and `#footer` element in the body -->
<body data-linkify="p, #footer" data-linkify-target="_parent">…</body>
```

[Additional data options](options.html) are available.
