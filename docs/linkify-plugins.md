---
layout: doc
title: Plugins · Documentation
---

Plugins provide no new interfaces but add additional detection functionality to Linkify. A custom plugin API is currently in the works.

**Note:** Plugins should be included before interfaces.

## General Installation

### Node.js/io.js/Browserify

```js
var linkify = require('linkifyjs')
require('linkifyjs/plugin/<name>')(linkify);
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
