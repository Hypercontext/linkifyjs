jQuery-linkify
==============

Linkify is a jQuery plugin for finding URLs in plain-text and converting them to HTML links.

You can call it on jQuery DOM elements, or on strings using the jQuery namespace,

#### Example JavaScript
```javascript

// app.js

$(document).ready(function() {
  $('.test-paragraph').linkify();
  $('.test-paragraph-2').html(
    jQuery.linkify("Email nick@something.ca and then go to www.hitsend.com")
  );
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
    <h1>Linkify Tests</h1>
		<p class="test-paragraph">This is a test http://www.google.com and also facebook.ca</p>
		<p class="test-paragraph">Please visit http://www.amazon.ca/?query=fail%20amazingand have the time of your life</p>
    <p class="test-paragraph-2"></p>
		<script src="jquery-1.9.1.min.js"></script>
		<script src="jquery.linkify.js"></script>
    <script src="app.js"></script>
	</body>
</html>
```

#### The Web Page
---
# Linkify Tests

This is a test [http://www.google.com](http://www.google.com) and also [facebook.ca](http://facebook.ca)

Please visit [http://www.amazon.ca/?query=fail%20amazingand](http://www.amazon.ca/?query=fail%20amazingand) have the time of your life

Email [nick@something.ca](mailto:nick@something.ca) and then go to [www.hitsend.com](www.hitsend.com)

---

**Please note:** Finding links in HTML (as opposed to plain text) has very limited functionality at the moment. Use with caution.
