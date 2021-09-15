---
layout: doc
title: \@Mention plugin · Documentation
---

# Linkify @Mention Plugin

Adds basic support for Twitter- and GitHub- style "at"-mentions.

See the [Plugins page](plugins.html#general-installation) for installation instructions.

```js
var options = {/* … */};
var str = "Linkify needs @you and @someone else";

linkify.find(str);
```

Returns the following array

```js
[
  {
    type: 'mention',
    value: "@you",
    href: "/you"
  },
  {
    type: 'mention',
    value: "@someone",
    href: "/someone"
  }
]
```
