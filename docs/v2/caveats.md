---
layout: doc
title: Caveats · Documentation
---

#### Jump to…

* [Cross-Site Scripting](#cross-site-scripting)
* [Cases not supported (yet)](#cases-not-supported-yet)

## Cross-Site Scripting

<div class="alert alert-danger">
  <strong>linkifyjs is not a validation or XSS-prevention library.</strong>
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

will output

```
'&lt;script src="<a href="https://evil.h4ckz.example.com/hack.js">https://evil.h4ckz.example.com/hack.js</a>"&gt;&lt;/script&gt;'
```

a completely harmless link to the the harmful JavaScript (provided the user doesn't download and run it).

The `linkifyHtml` interface **will not automatically do this**. It will parse
your input as HTML and output unescaped HTML. **It is up to you as a programmer
to strip out unwanted HTML content before showing it to the user**.

Other interfaces that work with the DOM, including `linkify-element`,
`linkify-jquery`, and `linkify-react`, only apply to text-nodes. By design, they
will not generate any non-anchor tags that are not already in the DOM.

## Cases not supported (yet)

* Non-latin domain names
* Non-latin top-level domains
* Non-standard email characters delimited by `"`
* Excaped `\@` inside email local-part.
* Slash characters in email addresses

See [Email address syntax](http://en.wikipedia.org/wiki/Email_address#Syntax) on Wikipedia.
