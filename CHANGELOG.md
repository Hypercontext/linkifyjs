# Linkify Changelog

### v2.1.9

* Move optional dependencies to peerdependencies (#282)
* Fix `npm install` displays vulnerabilities. (#265)
* Fix typo (#275)

### v2.1.8

* Allow mentions with inner @ sign for federated mentions - thanks @juliushaertl!
* Drop official support for Internet Explorer 8 and Node.js 6 (still supported unofficially but may break in future releases)
* Update dev dependencies

### v2.1.7

* Update dependencies (#243)
* Ignore .babelrc file (854e6fc)

### v2.1.6

* Fix a bug where unique element IDs aren't unique (#215)
* Update tlds.js (#213)
* Automated browser test fixes (#224)
* Add partialProtocolMailtoStates to domainStates (#210)
* Use Object.defineProperty to extend String prototype so that 'linkify' function is not enumerable (#197)
* Allow null overrides in options for target and className (#189)

### v2.1.5

* React plugin compatibility updates

### v2.1.4

* Add explicit support for mailto: addresses (#186)
* Add support for mentions containing dots (#185)
* URL followed by `&nbsp;` now works as expected in linkify-html (#184)
* Small dependency updates (#183)
* Drop deprecated babel-preset-es2015-loose dependency (#172)
* Web workers support (#168)

### v2.1.3

* Links in angle brackets (#166)

### v2.1.2

* Single quotes should be treated as punctuation (#165)

### v2.1.1

* Detect additional whitespace characters (#163)

### v2.1.0

#### BREAKING CHANGES

* The `dist/jquery.linkify.js` 1.x legacy browser files have been permanently
removed from the release bundle.
  * Use `linkify.js` and `linkify-jquery.js` instead.
* The deprecated `newLine` option from linkify 1.x has been completely removed.
  * Use the [`nl2br` option](http://soapbox.github.io/linkifyjs/docs/options.html#nl2br) instead.

#### Features

* [New React.js interface](http://soapbox.github.io/linkifyjs/docs/linkify-react.html)
* [@mention plugin](http://soapbox.github.io/linkifyjs/docs/plugin-mention.html)
* [GitHub-style ticket/issue reference plugin](http://soapbox.github.io/linkifyjs/docs/plugin-ticket.html)
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
