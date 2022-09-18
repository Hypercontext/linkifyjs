---
layout: docv3
title: linkify-element · Documentation
toc: true
---

# Linkify DOM Element Interface

`linkify-element` is an interface for replacing links within native DOM elements
with anchor tags. Note that `linkify-element` is included with `linkify-jquery`,
so you do not have to install it if you are using `linkify-jquery`.

## Installation

### Node.js module

Install from the command line with NPM

```
npm install linkifyjs linkify-element
```

Import into your JavaScript with `require`

```js
const linkifyElement = require("linkify-element");
```

or with ES6 modules

```js
import linkifyElement from "linkify-element";
```

### Browser globals

[Download linkify](https://github.com/{{ site.github_username }}/releases/download/v{{ site.version }}/linkifyjs.zip)
and extract the contents into your website's assets directory.
Include the following scripts in your HTML:

```html
<script src="linkify.js"></script>
<script src="linkify-element.js"></script>
```

## Usage

```js
const options = {
  /* … */
};
linkifyElement(document.getElementById("id"), options, document);
```

This recursively finds links in text nodes within element `#id`.

**Params**

- _`HTMLElement`_ **`element`** DOM Element to linkify
- _`Object`_ [**`options`**] [Options](options.html) object
- _`HTMLDocument`_ [**`doc`**] Explicitly pass in the document object or document implementation if on a non-browser environment like Node.js

**Returns** _`HTMLElement`_ **`element`** The same element provided as input
