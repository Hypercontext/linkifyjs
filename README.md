# Linkify

[![Node Dependencies](https://david-dm.org/SoapBox/jQuery-linkify/dev-status.png)](https://david-dm.org/SoapBox/jQuery-linkify#info=devDependencies&view=table)

__Jump to__
- [Demo](#demo)
- [Installation and Usage](#installation-and-usage)
  - [Quick Start](#quick-start)
  - [Usage](#usage)
    - [Node.js/Browserify](#node-js-browserify)
    - [AMD Modules](#amd-modules)
    - [Browser](#browser)
- [Examples](#examples)
  - [Basic Usage](#basic-usage)
  - [Usage via HTML attributes](#usage-via-html-attributes)
- [Options](#options)
- [Building and Development Tasks](#building-and-development-tasks)
  - [Setup](#setup)
  - [Development](#development)
- [Authors](#authors)

Linkify is a jQuery plugin for finding URLs in plain-text and converting them to HTML links. It works with all valid URLs and email addresses.

## Demo
[Launch demo](http://soapbox.github.io/jQuery-linkify/)

## Installation and Usage

### Quick Start

Add [linkify](#) and [linkify-jquery](#) to your HTML following jQuery:

```html
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
<script src="linkify.min.js"></script>
<script src="linkify-jquery.min.js"></script><!-- interface -->
<script>
    (function ($) { $(document).ready({

        var links = linkify.find('Any links to github.com here?');
        console.log(links);
        // [{type: 'url', value: 'github.com', href: 'http://github.com'}]

        // Find links and emails in paragraphs and `#sidebar`
        // and converts them to anchors
        $('p').linkify();
        $('#sidebar').linkify({
            target: "_blank"
        });

    }) })(jQuery);
</script>
```

### Usage

#### Node.js/Browserify

```js
var linkify = require('linkifyjs');
var linkifyInterface = require('linkifyjs/<interface>');
require('linkifyjs/plugin/<plugin1>')(linkify);

linkify.find('github.com');
linkifyInterface(target, options);
```

#### AMD modules

```html
<script src="r.js"></script>
<script src="linkify.amd.js"></script>
<script src="linkify-<interface>.amd.js"></script> <!-- recommended -->
<script src="linkify-plugin-<plugin1>.amd.js"></script> <!-- optional -->
<script>
    require(['linkify'], function (linkify) {
        var links = linkify.find("github.com");
        console.log(link);
    });

    require(['linkify-<interface>'], function (linkifyInterface) {
        var linkified = linkifyInterface(target, options);
        console.log(linkified);
    });

</script>
```

#### Browser

```html
<script src="linkify.js"></script>
<script src="linkify-<interface>.js"></script> <!-- recommended -->
<script src="linkify-plugin-<plugin1>.js"></script> <!-- optional -->
```

## Downloads

* linkify _(required)_ · [View docs](#linkify)
    * [raw](https://github.com/nfrasser/linkify-shim/blob/master/linkify.js)
    * [AMD](https://github.com/nfrasser/linkify-shim/blob/master/linkify.amd.js)
    * [minified](https://github.com/nfrasser/linkify-shim/blob/master/linkify.min.js)
    * [minified AMD](https://github.com/nfrasser/linkify-shim/blob/master/linkify.amd.min.js)

**Interfaces** _(recommended - include at least one)_ · [View docs](#linkify)

* [string](#string) · [View docs](#linkify)
    * [raw](https://github.com/nfrasser/linkify-shim/blob/master/linkify-string.js)
    * [AMD](https://github.com/nfrasser/linkify-shim/blob/master/linkify-string.amd.js)
    * [minified](https://github.com/nfrasser/linkify-shim/blob/master/linkify-string.min.js)
    * [minified AMD](https://github.com/nfrasser/linkify-shim/blob/master/linkify-string.amd.min.js) 

**Plugins** _(optional)_ · [View docs](#linkify)

* [hashtag](#plugin-hashtag) · [View docs](#linkify)
    * [raw](https://github.com/nfrasser/linkify-shim/blob/master/linkify-plugin-hashtag.js)
    * [AMD](https://github.com/nfrasser/linkify-shim/blob/master/linkify-plugin-hashtag.amd.js)
    * [minified](https://github.com/nfrasser/linkify-shim/blob/master/linkify-plugin-hashtag.min.js)
    * [minified AMD](https://github.com/nfrasser/linkify-shim/blob/master/linkify-plugin-hashtag.amd.min.js)

## API

```js
// Node.js/Browserify usage
var linkify = require('linkifyjs');
```

```html
<!-- Global `linkify` -->
<script src="linkify.js"></script>

<!-- AMD -->
<script src="linkify.amd.js"></script>
<script>
    require(['linkify'], function (linkify) {
        // ...
    });
</script>
```

#### linkify.find _(str)_

Finds all links in the given string

**Params**

* `String` **`str`** Search string

**Returns** _`Array`_ List of links where each element is a hash with properties `type`, `value`, and `href`

```js
linkify.find('For help with GitHub.com, please email support@github.com');
/** // returns
[{
    type: 'url',
    value: 'GitHub.com',
    href: 'http://github.com',
}, {
    type: 'email',
    value: 'support@github.com',
    href: 'mailto:support@github.com'
}]
*/
```

#### linkify.test _(str)_

Is the given string a link? Not to be used for strict validation - See [Caveats](#)

**Params**

* `String` **`str`** Test string

**Returns** _`Boolean`_

```js
linkify.test('google.dev'); // false
linkify.test('google.com'); // true
```

#### linkify.tokenize _(str)_

Internal method used to perform lexicographical analysis on the given string and output the resulting array tokens.

**Params**

* `String` **`str`**

**Returns** _`Array`_

### Interfaces

#### string

Interface for replacing links within native strings with anchor tags. Note that this function will **not** parse HTML strings - use [linkify-dom](#) or [linkify-jquery](#) instead.

```js
// Node.js/Browserify usage
var linkifyStr = require('linkifyjs/string'),;
```

```html
<!-- Global `linkifyStr` -->
<script src="linkify.js"></script>
<script src="linkify-string.js"></script>

<!-- AMD -->
<script src="linkify.amd.js"></script>
<script src="linkify-string.amd.js"></script>
<script>
    require(['linkify-string'], function (linkifyStr) {
        // ...
    });
</script>
```

**Usage**

```js
var options = {/* ... */};
linkifyStr('For help with GitHub.com, please email support@github.com');
// returns "For help with <a href="http://github.com" target="_blank">GitHub.com</a>, please email <a href="mailto:support@github.com">support@github.com</a>
```

or

```js
var options = {/* ... */};
'For help with GitHub.com, please email support@github.com'.linkify(options);
```

**Params**

* `String` **`str`** String to linkify
* `Object` [**`options`**] [Options hash](#)

**Returns** _`String`_ Linkified string

### Plugins

Plugins provide no new interfaces but add additional detection functionality to Linkify. A plugic plugin API is currently in the works.

#### hashtag

Adds basic support for Twitter-style hashtags

```js
// Node.js/Browserify
var linkify = require('linkifyjs');
require('linkifyjs/plugins/hashtag')(linkify);
```

```html
<!-- Global `linkifyStr` -->
<script src="linkify.js"></script>
<script src="linkify-plugin-hashtag.js"></script>

<!-- AMD -->
<script src="linkify.amd.js"></script>
<script src="linkify-plugin-hashtag.amd.js"></script>
<script>
    require(['linkify'], function (linkify) {
        // ...
    });
</script>
```

**Usage**

```js
var options = {/* ... */};
var str = "Linkify is #super #rad";

linkify.find(str);
// [
//  {type: 'hashtag', value: "#super", href: "#super"},
//  {type: 'hashtag', value: "#rad", href: "#rad"}
// ]

// If the linkifyStr interface has also been included
linkifyStr(str)

```


### Usage via HTML attributes

Linkify also provides a DOM data- API. The following code will find links in the `#linkify-example` paragraph element:

```html
<p id="linkify-example" data-linkify="this">
  Lorem ipsum dolor sit amet, consectetur adipisicing
  elit, sed do eiusmod tempor incididunt ut labore et
  dolore magna aliqua.
</p>
```

Pass in a selector instead of this to linkify every element with that selector. The example below linkifies every paragraph and `.plain-text` element in the bodytag:

```html
<body data-linkify="p, .plain-text">
  ...
</body>
```

## Options

Linkify is applied with the following default options. Below is a description of each.

```javascript
$('selector').linkify({
  tagName: 'a',
  target: '_blank',
  newLine: '\n',
  linkClass: null,
  linkAttributes: null
});
```

<table>
	<thead>
		<tr>
			<th>Option</th>
			<th>Type</th>
			<th>Default</th>
			<th>Description</th>
			<th>Data Attribute</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>tagName</td>
			<td>String</td>
			<td><code>"a"</code></td>
			<td>
				The tag that should be used to wrap each URL. This is
				useful for cases where <code>a</code> tags might be
				innapropriate, or might syntax problems (e.g., finding
				URLs inside an <code>a</code> tag).
			</td>
			<td>
				<code class="small">data-linkify-tagname</code>
			</td>
		</tr>
		<tr>
			<td>target</td>
			<td>String</td>
			<td><code>"_blank"</code></td>
			<td><code>target</code> attribute for each linkified tag.</td>
			<td><code class="small">data-linkify-target</code></td>
		</tr>
		<tr>
			<td>newLine</td>
			<td>String</td>
			<td><code>"\n"</code></td>
			<td>
				The character to replace new lines with. Replace with
				<code>"&lt;br&gt;"</code> to space out multi-line user
				content.
			</td>
			<td><code class="small">data-linkify-newline</code></td>
		</tr>

		<tr>
			<td>linkClass</td>
			<td>String</td>
			<td><code>null</code></td>
			<td>
				The class to be added to each linkified tag. An extra <code>.linkified</code> class ensures that each link will be clickable, regardless of the value of <code>tagName</code>. Linkify won't attempt finding links in <code>.linkified</code> elements.
			</td>
			<td><code class="small">data-linkify-linkclass</code></td>
		</tr>

		<tr>
			<td>linkAttributes</td>
			<td>Object</td>
			<td><code>null</code></td>
			<td>
				HTML attributes to add to each linkified tag. In the
				following example, the <code>tabindex</code> and
				<code>rel</code> attributes will be added to each link.

<pre>
$('p').linkify({
	linkAttributes: {
		tabindex: 0,
		rel: 'nofollow'
	}
});
</pre>

			</td>
			<td>N/A</td>
		</tr>
	</tbody>
</table>

## Building and Development Tasks

### Setup

Linkify uses [Grunt](http://gruntjs.com/) for building and testing, and
[Bower](http://bower.io/) for dependency management. Both can be installed
via [npm](https://npmjs.org/) by running:

```bash
npm install -g grunt-cli
npm install -g bower
```

Once you have those, navigate into the repo's root directory and run

```bash
npm install && bower install
```

### Development

Each of these tasks can be called by running `grunt taskName` from the
repo's root folder.

1. `default`: Also available by just calling `grunt`, this task tests
the plugin code in the `src` folder for JSHint compliance and builds and
minifies it into the `dist` folder.

2. `demo`: Builds everything and launches the demo page at
[localhost:8000](http://localhost:8000/).

3. `test`: Runs the complete test suite, including JSHint and QUnit. QUnit
tests will be executed at [localhost:8001](http://localhost:8000/).


## Authors
Linkify is handcrafted with Love by [SoapBox Innovations, Inc](http://soapboxhq.com).
