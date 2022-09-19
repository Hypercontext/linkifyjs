---
layout: docv3
title: Keyword plugin · Documentation
toc: true
---

# Linkify Keyword Plugin

Adds support for detecting arbitrary words and highlighting them as links.

## Installation

### Node.js module

Install from the command line with NPM

```
npm install linkifyjs linkify-plugin-keyword
```

```js
const linkify = require("linkifyjs");
const linkifyRegisterKeywords = require("linkify-plugin-keyword");
```

or with ES6 modules

```js
import * as linkify from "linkifyjs";
import linkifyRegisterKeywords from "linkify-plugin-keyword";
```

### Browser globals

[Download linkify](https://github.com/{{ site.github_username }}/releases/download/v{{ site.version }}/linkifyjs.zip)
and extract the contents into your website's assets directory.
Include the following scripts in your HTML:

```html
<script src="linkify.js"></script>
<script src="linkify-plugin-keyword.js"></script>
```

## Usage

Register keywords by providing `linkifyRegisterKeywords` with an array of keywords to highlight:

```js
linkifyRegisterKeywords(["100%", "linkify", "okrs", "roi", "synergy"]);
```

Format with a linkify inteface:

```js
const options = {
  formatHref: {
    keyword: (keyword) => "/tags/" + keyword.toLowerCase(),
  },
};
linkifyHtml(
  "Use Linkify to complete your OKRs, increase ROI by 100% and create *synergy*",
  options
);
```

Returns the following string:

```js
'Use <a href="/tags/linkify">Linkify</a> to complete your <a href="/tags/okrs">OKRs</a>, increase <a href="/tags/roi">ROI</a> by <a href="/tags/100%">100%</a> and create *<a href="/tags/synergy">synergy</a>*'
```
