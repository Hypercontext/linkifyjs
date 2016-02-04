---
layout: doc
title: mention plugin · Documentation
---

Adds basic support for Github style @mentions.

{% highlight js %}
var options = {/* … */};
var str = "Linkify needs @you and @someone else";

linkify.find(str);
{% endhighlight %}

Returns the following array

{% highlight js %}
[
  {
    type: 'mention',
    value: "@you",
    href: "@you"
  },
  {
    type: 'mention',
    value: "@someone",
    href: "@someone"
  }
]
{% endhighlight %}
