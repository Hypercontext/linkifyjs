---
layout: doc
title: ticket plugin · Documentation
---

Adds basic support for Github-style tickets/issues.

See the [Plugins page](plugins.html#general-installation) for installation instructions.

```js
var options = {/* … */};
var str = "Check out issues #42 and #101 for further reference";

linkify.find(str);
```

Returns the following array

```js
[
  {
    type: 'ticket',
    value: "#42",
    href: "#42"
  },
  {
    type: 'ticket',
    value: "#101",
    href: "#101"
  }
]
```
