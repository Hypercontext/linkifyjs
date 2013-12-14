jQuery-linkify — v1.0.0
==============

Linkify is a jQuery plugin for finding URLs in plain-text and converting them to HTML links.

You can call it on jQuery DOM elements, or on strings using the jQuery namespace,

#### Example JavaScript

```javascript
	// app.js
	$(document).ready(function() {
	  $('.test-item').linkify();
	});
```

#### Example HTML

```html
	<!DOCTYPE html>
	<html>
	<head>
		<title>jQuery.linkify Test</title>
	</head>
	<body>
		<h1>Linkify Example Web Page</h1>
		<ul>
			<li class="text-item">This is a test http://www.google.com and also facebook.ca</li>
			<li class="text-item">Please visit http://www.amazon.ca/?query=fail%20amazingand have the time of your life</li>
		</ul>
		<p class="test-paragraph"></p>
		<!-- Scripts -->
		<script src="jquery-1.10.2.min.js"></script>
		<script src="jquery.linkify.js"></script>
		<script src="app.js"></script>
	</body>
	</html>
```


#### The Web Page
---
# Linkify Example Web Page

* This is a test [http://www.google.com](http://www.google.com) and also [facebook.ca](http://facebook.ca)
* Please visit [http://www.amazon.ca/?query=fail%20amazingand](http://www.amazon.ca/?query=fail%20amazingand) have the time of your life.

---
