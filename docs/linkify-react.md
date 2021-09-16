---
layout: docv3
title: linkify-react · Documentation
toc: true
---

# Linkify React Component Interface

The `<Linkify>` component from `linkify-react` walks through its children and
replaces strings containing URLs with strings and `<a>` elements.

## Installation

### Node.js module

Install from the command line with NPM
```
npm install linkifyjs linkify-react
```

Import into your JavaScript with `require`
```js
const Linkify = require('linkify-react');
```

or with ES modules

```js
import Linkify from 'linkify-react';
```

### Browser globals

[Download linkify](https://github.com/{{ site.github_username }}/releases/download/v{{ site.version }}/linkifyjs.zip)
and extract the contents into your website's assets directory.
Include the following scripts in your HTML:

```html
<script src="linkify.js"></script>
<script src="linkify-react.js"></script>
```

## Usage

```jsx
// Example render function body
const options = {/* … */};
const content = 'For help with GitHub.com, please email support@github.com';
return (
  <Linkify tagName="p" options={options}>
    {content}
  </Linkify>
);
```

This renders the following HTML into the outer element

```js
'<p>For help with <a href="http://github.com" target="_blank">GitHub.com</a>, please email <a href="mailto:support@github.com">support@github.com</a></p>'
```

### Properties

* _`string | React.JSXElementConstructor`_ [**`tagName`**] The HTML tag or component class to use for the outermost element. Defaults to `React.Fragment` (React 16+) or `'span'`
* _`Object`_ [**`options`**] [Options](options.html) object

### Events

Add event handlers to the discovered links by specifying them in the
`options.attributes` object. Define event listeners in the same way as
for a regular React element:

```jsx
const linkProps = {
  onClick: (event) => {
    if (!confirm('Are you sure you want to leave this page?')) {
       event.preventDefault()
    }
  }
};

return (
  <Linkify options={% raw %}{{ attributes: linkProps }}{% endraw %}>
    ...
  </Linkify>
);
```
