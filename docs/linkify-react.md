---
layout: doc
title: linkify-react · Documentation
---

`linkify-react` provides a React component that walks through its children and
replaces strings containing URLs with strings and `<a>` elements.

#### Jump to

* [Installation](#installation)
  * [Node.js/Browserify](#nodejsbrowserify)
  * [AMD](#amd)
  * [Browser globals](#browser-globals)
* [Usage](#usage)
  * [Properties](#properties)
  * [Events](#events)

### Installation


### Node.js/Browserify

```
npm install linkifyjs
```

```js
const Linkify = require('linkifyjs/react');
```

or with ES6 modules

```js
import Linkify from 'linkifyjs/react';
```

### AMD

```html
<script src="linkify.amd.js"></script>
<script src="linkify-react.amd.js"></script>
<script>
  require(['linkify-react'], function (Linkify) {
    // …
  });
</script>
```

### Browser globals

```html
<script src="linkify.js"></script>
<script src="linkify-react.js"></script>
```

## Usage

JSX

```jsx
// render()
var options = {/* … */};
var content = 'For help with GitHub.com, please email support@github.com';
return <Linkify tagName="p" options={options}>{content}</Linkify>;
```

This will render the following HTML into the outer element

```js
'<p>For help with <a href="http://github.com" target="_blank">GitHub.com</a>, please email <a href="mailto:support@github.com">support@github.com</a></p>'
```

### Properties

* _`String`_ **`tagName`** The HTML tag to use for the outermost element (`'span'` by default)
* _`Object`_ [**`options`**] [Options](options.html) object

### Events

You can add events handlers to the discovered links by specifying them in the
`options.attributes` object. Define event listeners in the same way you would
for a regular React element:

```jsx
let linkProps = {
  onClick: () => confirm('Are you sure you want to leave this page')
};
return <Linkify options={% raw %}{{attributes: linkProps}}{% endraw %}>
  ...
</Linkify>;
```
