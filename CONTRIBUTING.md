# Contributing

**Note:** This guide is a work in progress. Feel free to [submit an issue](https://github.com/SoapBox/jQuery-linkify/issues/new) if anything is confusing or unclear.

## How linkify works

_TODO: Insert diagram here_

Linkify uses a two stage lexicographical analysis to detect patterns in plain text.

The first stage, called the scanner, takes the input string and generates encompassing tokens that aggregate different types of components like domain names and TLDs. For example, substings like `http:` or `com` are converted into tokens named `PROTOCOL` and `TLD`, respectively.

The second stage, the parser, takes this array of tokens and aggregates them into complete entities that are either become links or do not. For example, the tokens `PROTOCOL`, `SLASH`, `SLASH`, `DOMAIN`, `TLD` (appearing in that order) are grouped into a `URL` entity. These groups are called multitokens.

A multi token is either a link or not a link. Basic linkify comes with these multitokens

* **`TEXT`** is plain text (that contains no linkable entities)
* **`NL`** represents a single newline character
* **`EMAIL`** email address
* **`URL`**

The latter two are converted to links. `NL` is in some cases converted to a `<br>` HTML tag.

You can use the Token class system to [create plugins](#building-plugins).

## Style

* ES6 Syntax (except tests for now)
* Hard tabs with a width of 4 characters

As usualy, try to keep it consistent with what's already there.

## Development

### Setup

1. Install the latest version of [Node.js](https://nodejs.org/)
2. Install the [gulp.js](http://gulpjs.com/) build system from the Terminal
	* `npm install -g gulp`

### Building

Linkify is built and tested in the command line. Build tasks have the following format.

```
gulp <task>
```

Here are the primary build tasks used for development. See [gulpfile.js](https://github.com/SoapBox/jQuery-linkify/blob/master/gulpfile.js) for the complete list.

* **`build`** transpiles ES6 to ES5 (via [Babel](http://babeljs.io/)) from `src/` into `lib/`. The lib folder will be published to [NPM](https://www.npmjs.com/). Also generates browser-ready scripts (globals and [AMD](http://requirejs.org/docs/whyamd.html)) into the `build/` folder.
* **`dist`** copies and compresses the contents of `build/` into `dist/`. The contents of the dist folder will be published to [Bower](http://bower.io/).
* **default** (run `gulp` without arguments) runs `build` and begins watching files for changes (rebuilding when they do)

### Running tests

Here are the tools used for testing linkify:

* [Mocha](http://mochajs.org/) is our primary test case framework
* [ESLint](http://eslint.org) for code linting
* [Istanbul](https://gotwarlost.github.io/istanbul/) for code coverage analysis
* [Karma](http://karma-runner.github.io/0.12/index.html) is our browser test runner
* [Sauce Labs](https://saucelabs.com/) for cross-browser testing

These are all configured to run on gulp. Tasks `mocha` and `eslint` are the most basic you can run. Other tasks include:

* `test` transpiles the code and runs ESLint and Mocha
* `coverage` runs Istanbul code coverage on the Mocha tests
* Karma has a number of tasks that allow you to run Mocha tests on different browsers (via [Browserify](http://browserify.org/))
	* `karma` runs tests on the [PhantomJS](http://phantomjs.org/) headless browser
	* `karma-chrome` runs tests on [Google Chrome](http://www.google.com/chrome/)
	* `karma-ci` (or `test-ci`) runs Sauce Labs cross-browser tests (Sauce Labs environment configuration required)

### Building plugins

**Caution:** The plugin development API is in its very early stages and only supports very basic plugins. Updated features, APIs, and docs are in the works.

Check out the sample [Hashtag plugin](https://github.com/SoapBox/jQuery-linkify/blob/2.0/src/linkify/plugins/hashtag.js) for an idea of how plugins are made. You have access to all the previously described tokens from the `linkify` variable. And should be able to extend them as necessary.

If you decide that your plugin can be used by many people, you can add them to `src/linkify/plugins/`. Make sure you also create build templates for your plugin inside `templates/linkify/plugins/`. Follow the format of the existing files.

Any plugin you add to `src/linkify/plugins/` will automatically be added to the build system.
