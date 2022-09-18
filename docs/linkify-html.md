---
layout: docv3
title: linkify-html · Documentation
toc: true
---

# Linkify HTML String Interface

Use `linkify-html` to highlight links within strings that contain HTML markup.

## Installation

### Node.js module

Install from the command line with NPM

```
npm install linkifyjs linkify-html
```

Import into your JavaScript with `require`

```js
const linkifyHtml = require("linkify-html");
```

or with ES modules

```js
import linkifyHtml from "linkify-html";
```

### Browser globals

[Download linkify](https://github.com/{{ site.github_username }}/releases/download/v{{ site.version }}/linkifyjs.zip)
and extract the contents into your website's assets directory.
Include the following scripts in your HTML:

```html
<script src="linkify.js"></script>
<script src="linkify-html.js"></script>
```

## Usage

```js
const options = {
  /* … */
};
const str = "<p>For help with GitHub.com, please email support@github.com</p>";
linkifyHtml(str, options);
```

Returns

```js
'<p>For help with <a href="http://github.com" target="_blank">GitHub.com</a>, please email <a href="mailto:support@github.com">support@github.com</a></p>';
```

**Params**

- _`string`_ **`str`** string to linkify
- _`Object`_ [**`options`**] [Options](options.html) object

**Returns** _`string`_ Linkified HTML string
