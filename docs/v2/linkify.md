---
layout: doc
title: Core linkify · Documentation
---

# Core Linkify

## Installation

### Node.js/Browserify

```js
var linkify = require('linkifyjs');
```

### AMD

```html
<script src="linkify.amd.js"></script>
<script>
  require(['linkify'], function (linkify) {
    // …
  });
</script>
```

### Browser globals
```html
<script src="linkify.js"></script>
```

## Methods

### linkify.find _(str [, type])_

Finds all links in the given string

**Params**

* _`String`_ **`str`** Search string
* _`String`_ [**`type`**] only find links of the given type

**Returns** _`Array`_ List of links where each element is a hash with properties type, value, and href:

* **type** is the type of entity found. Possible values are
  - `'url'`
  - `'email'`
  - `'hashtag'` (with Hashtag plugin)
  - `'mention'` (with Mention plugin)
* **value** is the original entity substring.
* **href** should be the value of this link's `href` attribute.

```js
linkify.find('For help with GitHub.com, please email support@github.com');
```

Returns the array

```js
[
  {
    type: 'url',
    value: 'GitHub.com',
    href: 'http://github.com',
  },
  {
    type: 'email',
    value: 'support@github.com',
    href: 'mailto:support@github.com'
  }
]
```

### linkify.test _(str [, type])_

Is the given string a link? Not to be used for strict validation - See [Caveats](caveats.html)

**Params**

* _`String`_ **`str`** Test string
* _`String`_ [**`type`**] returns `true` only if the link is of the given type (see `linkify.find`),

**Returns** _`Boolean`_

```js
linkify.test('google.com'); // true
linkify.test('google.com', 'email'); // false
```

### linkify.tokenize _(str)_

Internal method used to perform lexicographical analysis on the given string and output the resulting token array.

**Params**

* _`String`_ **`str`**

**Returns** _`Array`_
