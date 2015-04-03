---
layout: doc
title: hashtag plugin · Documentation
---

Adds basic support for Twitter-style hashtags.

{% highlight js %}
var options = {/* ... */};
var str = "Linkify is #super #rad2015";

linkify.find(str);
{% endhighlight %}

Returns the following array

{% highlight js %}
[
  {
    type: 'hashtag',
    value: "#super",
    href: "#super"
  },
  {
    type: 'hashtag',
    value: "#rad2015",
    href: "#rad2015"
  }
]
{% endhighlight %}
