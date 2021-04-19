---
layout: doc
title: Terminology
---

### Core Linkify

The basic code included in [`linkify.js`](linkify.html) that contains general
link-finding logic. It is required by all interfaces and contains no code for
converting links to anchor tags.

### Interface

String -> link conversion for a certain environment or use-case. At least
one interface is recommended to make linkify actually useful.

Interfaces are provided for:

* [Plain-text strings](linkify-string.html)
* [HTML strings](linkify-html.html)
* [Native DOM elements](linkify-element.html)
* [jQuery elements](linkify-jquery.html)
* [React components](linkify-react.html)

### Plugin

[Plugins](plugins.html) allow linkify to detect new kinds of links, such as [@mentions](plugin-mention.html) or [#hashtags](plugin-hashtag.html). Plugins
are not required.
