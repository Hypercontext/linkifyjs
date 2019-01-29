---
layout: doc
title: Documentation
---

{% include new-release-announcement.html %}

#### Jump to

* [Installation/Getting Started](#installationgetting-started)
  * [Quick Start](#quick-start)
    * [Find all links and convert them to anchor tags](#find-all-links-and-convert-them-to-anchor-tags)
    * [Find all links in the given string](#find-all-links-in-the-given-string)
  * [Node.js/Browserify](#nodejsbrowserify)
  * [AMD](#amd)
  * [Browser globals](#browser-globals)
* [Internet Explorer](#internet-explorer)


# Installation/Getting Started

[Download](https://github.com/SoapBox/linkifyjs/releases/download/{{ site.version }}/linkifyjs.zip) the latest release or install via [NPM](https://www.npmjs.com/)

```
npm install --no-optional linkifyjs
```

or [Yarn](https://yarnpkg.com/)

```
yarn add --ignore-optional linkifyjs
```

or [Bower](http://bower.io/)

```
bower install linkifyjs
```

## Quick Start

Add linkify and linkify-jquery to your HTML following jQuery:

```html
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
<script src="linkify.min.js"></script>
<script src="linkify-jquery.min.js"></script>
```

**Note:** A [polyfill](#internet-explorer) is required for Internet Explorer 8.

### Find all links and convert them to anchor tags

```js
$('p').linkify();
$('#sidebar').linkify({
    target: "_blank"
});
```

This behaviour is also available without jQuery via [linkify-element](linkify-element.html).

### Find all links in the given string

```js
linkify.find('Any links to github.com here? If not, contact test@example.com');
```

Returns the following array

```js
[
  {
    type: 'url',
    value: 'github.com',
    href: 'http://github.com'
  },
  {
    type: 'email',
    value: 'test@example.com',
    href: 'mailto:test@example.com'
  }
]
```

See [all available options](options.html)


## Node.js/Browserify

```
npm install linkifyjs
```

```js
var linkify = require('linkifyjs');
var linkifyHtml = require('linkifyjs/html');
require('linkifyjs/plugins/hashtag')(linkify); // optional
```

or with ES6 modules

```js
import * as linkify from 'linkifyjs';;
import linkifyHtml from 'linkifyjs/html';
import hashtag from 'linkifyjs/plugins/hashtag'; // optional

hashtag(linkify);
```

### Example string usage

```js
linkifyHtml('The site github.com is #awesome.', {
  defaultProtocol: 'https'
});
```

Returns the following string

```js
'The site <a href="https://github.com">github.com</a> is <a href="#awesome">#awesome</a>.'
```

## AMD

```html
<script src="r.js"></script>
<script src="linkify.amd.js"></script>
<script src="linkify-plugin-hashtag.amd.js"></script> <!-- optional -->
<script src="linkify-element.amd.js"></script>
```

```js
require(['linkify'], function (linkify) {
  linkify.test('github.com'); // true
  linkify.test('github.com', 'email'); // false
});

require(['linkify-element'], function (linkifyElement) {

  // Linkify the #sidebar element
  linkifyElement(document.getElementById('sidebar'), {
    linkClass: 'my-link'
  });

  // Linkify all paragraph tags
  document.getElementsByTagName('p').map(linkifyElement);

});
```

Note that if you are using `linkify-jquery.amd.js`, a `jquery` module must be defined.

## Browser globals

```html
<script src="jquery.js"></script>
<script src="linkify.js"></script>
<script src="linkify-string.js"></script>
<script src="linkify-jquery.js"></script>
```

```js
linkify.test('dev@example.com'); // true
var htmlStr = linkifyStr('Check out soapboxhq.com it is great!');
$('p').linkify();
```

# Internet Explorer

Linkify natively supports Internet Explorer 9 and above. Internet Explorer 8 is unofficially supported with a polyfill.

You can use either [es5-shim](https://github.com/es-shims/es5-shim) (sham also required) or the provided `linkify-polyfill.js`:

```html
<script src="jquery.js"></script>

<!--[if IE 8]>
<script src="linkify-polyfill.js"></script>
<![endif]-->
<script src="linkify.js"></script>
<script src="linkify-jquery.js"></script>
```
