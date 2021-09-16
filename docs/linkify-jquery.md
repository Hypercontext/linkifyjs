---
layout: docv3
title: linkify-jquery · Documentation
toc: true
---

# Linkify jQuery Interface

`linkify-jquery` is an provides the Linkify jQuery plugin. This functionality is
also available in vanilla JavaScript via
[linkify-element](linkify-element.html).

## Installation

### Node.js module

Install from the command line with NPM

```
npm install linkifyjs linkify-jquery
```

Import into your JavaScript with `require`

```js
const $ = require('jquery');
require('linkify-jquery')
```

or with ES modules

```js
import $ from 'jquery';
import 'linkify-jquery';
```

If a `window.document` global is not available in your environment, provide it
manually instead as follows.

With `require`:
```js
require('linkify-jquery')($, document);
```

or with ES modules:
```js
import linkifyJq from 'linkify-jquery';
linkifyJq($, document);
```

### Browser globals

[Download linkify](https://github.com/{{ site.github_username }}/releases/download/v{{ site.version }}/linkifyjs.zip)
and extract the contents into your website's assets directory.
Include the following scripts in your HTML:

```html
<script src="jquery.js"></script>
<script src="linkify.js"></script>
<script src="linkify-jquery.js"></script>
```

## Usage

```js
const options = { /* … */ };
$(selector).linkify(options);
```

**Params**

* _`Object`_ [**`options`**] [Options](options.html) object

See [all available options](options.html).

### DOM Data API

The jQuery plugin also provides a DOM data/HTML API - no extra JavaScript required after import!

```html
<!-- Find and linkify all entities in this div -->
<div data-linkify="this">…</div>

<!-- Find and linkify the paragraphs and `#footer` element in the body -->
<body data-linkify="p, #footer" data-linkify-target="_parent">…</body>
```

[Additional data options](options.html) are available.
