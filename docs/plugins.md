---
layout: doc
title: Plugins · Documentation
---

Plugins provide no new interfaces but add additional detection functionality to
Linkify. A custom plugin API is currently in the works.

Plugins are available for the following link types:

* [Twitter-style hashtags](plugin-hashtag.html)
* ["@" Mentions](plugin-mention.html)
* [GitHub-style ticket/issue numbers](plugin-ticket.html)

## General Installation

### Node.js/Browserify

```js
var linkify = require('linkifyjs')
require('linkifyjs/plugin/<name>')(linkify);
```

or with ES6 modules

```js
import * as linkify from 'linkifyjs';;
import plugin from 'linkifyjs/plugin/<name>';
plugin(linkify);
```

### AMD

```html
<script src="linkify.amd.js"></script>
<script src="linkify-plugin-<name>.amd.js"></script>
```

### Browser globals

```html
<script src="linkify.js"></script>
<script src="linkify-plugin-<name>.js"></script>
```
