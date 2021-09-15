---
layout: docv3
title: Note about Cross-Site Scripting (XSS) · Documentation
toc: true
---

# Note about Cross-Site Scripting

<div class="alert alert-danger">
  <strong>Linkify is not a validation or XSS-prevention library.</strong>
  Improperly used, this library can make you vulnerable to cross-site scripting
  attacks.
</div>

**In particular, take care when using the [`linkifyHtml`](linkify-html.html)
function.**

All linkify functions that accept strings, with the exception of `linkifyHtml`,
assume that their input is plain-text. Since the functions output HTML, they
will convert HTML entities in these strings to encoded characters.

For example

```js
linkifyStr('<script src="https://evil.h4ckz.example.com/hack.js"></script>');
```

outputs

```
'&lt;script src="<a href="https://evil.h4ckz.example.com/hack.js">https://evil.h4ckz.example.com/hack.js</a>"&gt;&lt;/script&gt;'
```

a harmless link to the the harmful JavaScript (provided no one
downloads and runs it).

The `linkifyHtml` interface **will NOT automatically do this**!! It will parse
your input as HTML and output unescaped HTML. **It is up to the programmer to
strip out unwanted HTML content before rendering it to a webpage**.

Other interfaces that work with the DOM, including `linkify-element`,
`linkify-jquery`, and `linkify-react`, only apply to text-nodes. By design, they
will not generate any non-anchor tags that are not already in the DOM.
