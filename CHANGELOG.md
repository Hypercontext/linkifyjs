# Linkify Changelog

### v2.1.0

#### BREAKING CHANGES

* The `dist/jquery.linkify.js` 1.x legacy browser files have been permanently
removed from the release bundle.
  * Use `linkify.js` and `linkify-jquery.js` instead.
* The deprecated `newLine` option from linkify 1.x has been completely removed.
  * Use the [`nl2br` option](http://soapbox.github.io/linkifyjs/options.html#nl2br) instead.

#### Features

* [New React.js interface](http://soapbox.github.io/linkifyjs/linkify-react.html)
* [@mention plugin](http://soapbox.github.io/linkifyjs/plugin-mention.html)
* [GitHub-style ticket/issue reference plugin](http://soapbox.github.io/linkifyjs/plugin-ticket.html)
* Improved option definitions
  * Options that take functions with value and type arguments can now be
    specified as objects, where each key is the target link type.

#### Deprecations

* The `linkAttributes` option is deprecated in favour of just **`attributes`**.
* The `linkClass` option is deprecated in favour of **`className`**.
* The default `.linkified` class is deprecated and will be fully removed
in a future release.

To maintain compatibility with versions >= 2.1, make sure options objects
include these properties instead of `linkAttributes` and `linkClass`

#### All Changes

* Build optimizations to make compiled AMD payload smaller
* Bugfix in quick-es3 task
* Make better use of ES6 modules and rollup
* Tickets plugin (#156)
* Additional Mentions features, enhancements, and tests (#155)
* Mentions plugin (#111)
* Revamped options utility (#154)
* Linkify React Interface (#150)
* Development upgrades (#153)

### v2.0.5

* Correct trailing symbol parsing (#149)
* Linkify element fixes (#148)

### v2.0.4

* Optimize class code to reduce file size (#147).
* Update test and dev dependencies
* Allow uglify to mangle properties, except for the specified ones (#146)
* Updated tlds.js (#121)

### v2.0.3

* Fixing element interface invalid DOM node error (#141)

### v2.0.1

* Updated build system and development dependencies
* IE8 Support
* Internal API updates

### v2.0.0

* New link-detection technique based on lexicographical analysis via two-stage scanner - essentially regexp with more flexibility.
* Faster, less destructive DOM manipulation.
* Node.js API via `var linkify = require('linkifyjs');`
* Internal plugin system so you can require only features you need. e.g., `require('linkifyjs/plugins/hashtag')(linkify);`
* Browser modules (Browserify, AMD)
* Mocha Unit tests
* ES6 Implementation
* Updated documentation
* Repository name change
