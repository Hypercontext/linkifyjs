---
layout: docv3
title: IP Address plugin · Documentation
toc: true
---

# Linkify IP Address Plugin

Adds support for detecting IPv4 and IPv6 (limited) addresses.

## Installation

### Node.js module

Install from the command line with NPM

```
npm install linkifyjs linkify-plugin-ip
```

```js
const linkify = require("linkifyjs");
require("linkify-plugin-ip");
```

or with ES6 modules

```js
import * as linkify from "linkifyjs";
import "linkify-plugin-ip";
```

### Browser globals

[Download linkify](https://github.com/{{ site.github_username }}/releases/download/v{{ site.version }}/linkifyjs.zip)
and extract the contents into your website's assets directory.
Include the following scripts in your HTML:

```html
<script src="linkify.js"></script>
<script src="linkify-plugin-ip.js"></script>
```

## Usage

Once imported, works automatically with all linkify interfaces such as `linkify-html`:

```js
linkifyHtml("No place like 127.0.0.1");
```

Returns the following string:

```js
'No place like <a href="http://127.0.0.1">127.0.0.1</a>';
```
