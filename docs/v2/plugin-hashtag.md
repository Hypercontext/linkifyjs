---
layout: doc
title: hashtag plugin · Documentation
---

Adds basic support for Twitter-style hashtags.

See the [Plugins page](plugins.html#general-installation) for installation instructions.

```js
var options = {/* … */};
var str = "Linkify is #super #rad2015";

linkify.find(str);
```

Returns the following array

```js
[
  {
    type: 'hashtag',
    value: "#super",
    href: "#super"
  },
  {
    type: 'hashtag',
    value: "#rad2015",
    href: "#rad2015"
  }
]
```
