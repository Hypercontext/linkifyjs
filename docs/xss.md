---
layout: docv3
title: Note about Cross-Site Scripting (XSS) · Documentation
toc: true
---

# Note about Cross-Site Scripting

<div class="alert alert-danger">
  <strong>Linkify is not a validation or XSS-prevention library.</strong>
  Used, improperly, this library can make you vulnerable to cross-site scripting
  attacks.
</div>

**In particular, take care when using the [`linkifyHtml`](linkify-html.html)
function.**

## Background: The DOM

The Document Object Model (DOM) is a tree-like data structure that represents an HTML
document. The browser uses it to organize and perform operations on a web page
that result in on-screen changes.

The DOM is composed of linked nodes with parent/child relationships. All HTML
elements such as `<html>`, `<body>` or `<p>` are represented by nodes which are
either empty or contain other child HTML element nodes and/or leaf text nodes.
Read more about [the DOM
here](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model).

## DOM interfaces are generally safe to use

The following interfaces operate on DOM (or DOM-like) nodes:

- [`linkify-element`](element.html)
- [`linkify-jquery`](jquery.html)
- [`linkify-react`](react.html)

The interface assumes all text nodes are plain text. It replaces those nodes
with one or more text or `<a>` anchor element nodes.

For example, the following is safe:

```jsx
import ReactDOM from "react-dom";
import Linkify from "linkify-react";

const container = document.getElementById("container");
const content =
  '<script src="https://evil.h4ckz.example.com/hack.js"></script>';

ReactDOM.render(<Linkify>{content}</Linkify>, container);
```

Linkify creates a text node for `<script src="`, an anchor tag node with href
`https://evil.h4ckz.example.com/hack.js` and a final text node for
`"></script>`.

React translates this into approximately the following DOM code:

```js
const node1 = document.createTextNode('<script src="');
container.appendChild(node1);

const node2 = document.createElement("a");
node2.setAttribute("href", "https://evil.h4ckz.example.com/hack.js");
node2.innerText = "https://evil.h4ckz.example.com/hack.js";
container.appendChild(node2);

const node3 = document.createTextNode('"></script>');
container.appendChild(node3);
```

**Each new text node is automatically "escaped" by the browser: HTML special
characters will appear literally on the page.** So this code is equivalent to an
HTML file with the following content:

```html
&lt;script src="
<a href="https://evil.h4ckz.example.com/hack.js">
  https://evil.h4ckz.example.com/hack.js
</a>
"&gt;&lt;/script&gt;
```

Which contains a harmless link to the malicious JavaScript (provided no one
downloads and runs it):

## `linkify-string` is generally safe to use

The [`linkify-string`](string.html) interface assumes that its input is
plain-text and outputs HTML. It converts HTML entities in the input to encoded
characters.

For example, the following is safe:

```js
document.body.innerHTML = linkifyStr(
  '<script src="https://evil.h4ckz.example.com/hack.js"></script>'
);
```

`linkifyStr` returns escapted text with a harmless link to the malicous
JavaScript:

```
'&lt;script src="<a href="https://evil.h4ckz.example.com/hack.js">https://evil.h4ckz.example.com/hack.js</a>"&gt;&lt;/script&gt;'
```

## `linkify-html` is UNSAFE if its input is not validated

Unlike `linkify-string` and the DOM interfaces, the [`linkify-html`](html.html) interface
**does NOT automatically escape malicous HTML**!! It will parse its input as
HTML and output unescaped HTML.

```js
const content =
  '<script src="https://evil.h4ckz.example.com/hack.js"></script>';
document.body.innerHTML = linkifyHtml(content); // DANGEROUS!! hack.js will be executed!!
```

**It is the programmer's responsibility to escape unwanted HTML before rendering
it to the webpage**.
