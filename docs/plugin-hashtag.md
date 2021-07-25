---
layout: docv3
title: \#Hashtag plugin · Documentation
toc: true
---

# Linkify #Hashtag Plugin

Adds basic support for Twitter-style hashtags.

See the [Plugins page](plugins.html#general-installation) for installation instructions (use `hashtag` instead of `[NAME]`).

```js
const options = {/* … */};
const str = "Linkify is #super #rad2021";

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
    value: "#rad2021",
    href: "#rad2021"
  }
]
```
