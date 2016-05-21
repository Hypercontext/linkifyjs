# Linkify Changelog

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
