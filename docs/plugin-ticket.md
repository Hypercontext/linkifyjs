---
layout: docv3
title: \#-Ticket plugin · Documentation
toc: true
---

# Linkify #-Ticket Plugin

Adds basic support for GitHub-style tickets/issues.

## Installation

### Node.js module

Install from the command line with NPM

```
npm install linkifyjs linkify-plugin-ticket
```
```js
const linkify = require('linkifyjs')
require('linkify-plugin-ticket');
```

or with ES6 modules

```js
import * as linkify from 'linkifyjs';;
import 'linkify-plugin-ticket';
```

### Browser globals

[Download linkify](https://github.com/{{ site.github_username }}/releases/download/v{{ site.version }}/linkifyjs.zip)
and extract the contents into your website's assets directory.
Include the following scripts in your HTML:

```html
<script src="linkify.js"></script>
<script src="linkify-plugin-ticket.js"></script>
```

## Usage

Use the `formatHref` option with your preferred [interface](interfaces.html) to
correctly resolve a ticket. Example linking to GitHub issues with
`linkifyHtml`:

```js
const options = {
  formatHref: {
    ticket: (href) => 'https://github.com/Hypercontext/linkifyjs/issues/' + href.substr(1)
  }
}
linkifyHtml('This is related to #42.')
```

The last line returns the following string:

```js
'This is related to <a href="https://github.com/Hypercontext/linkifyjs/issues/42">#42</a>.'
```
