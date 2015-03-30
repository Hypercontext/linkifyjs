---
layout: doc
title: Options · Documentation
---

Linkify is applied with the following default options. Below is a description of each.

```js
var options = {
  defaultProtocol: 'http',
  format: null,
  formatHref: null,
  linkAttributes: null,
  linkClass: 'linkified',
  nl2br: false,
  tagName: 'a',
  target: function (type) {
    return type === 'url' ? '_blank' : null;
  }
};
```

## Usage

```js
linkifyStr(str, options); // or `str.linkify(options)`
linkifyElement(document.getElementById(id), options);
$(selector).linkify(options);
```

### `defaultProtocol`

**Type**: `String`<br>
**Default**: `'http'`<br>
**Values**: `'http'`, `'https'`, `'ftp'`, `'ftps'`, etc.<br>
**Data API**: `data-linkify-default-protocol`<br>

Protocol that should be used in `href` attributes for URLs without a protocol (e.g., `github.com`).

### `format`

**Type**: `Function (String value, String type)`<br>
**Default**: `null`<br>

Format the text displayed by a linkified entity. e.g., truncate a long URL.

```js
'http://github.com/SoapBox/linkifyjs/search/?q=this+is+a+really+long+query+string'.linkify({
  format: function (value, type) {
    if (type === 'url' && value.length > 50) {
      value = value.slice(0, 50) + '…';
    }
    return value;
  }
});
```

### `formatHref`

### `nl2br`

### `tagName`

### `target`

### `linkAttributes`

### `linkClass`
