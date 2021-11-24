/* eslint-disable mocha/no-top-level-hooks */
/* eslint-disable mocha/no-hooks-for-single-case */
import glob from 'glob';
import { expect } from 'chai';

const Module = require('module');
const originalRequire = Module.prototype.require;

/**
	Gracefully truncate a string to a given limit. Will replace extraneous
	text with a single ellipsis character (`…`).
*/
String.prototype.truncate = function (limit) {
	limit = limit || Infinity;
	return this.length > limit
		? this.substring(0, limit) + '…'
		: this
};

Module.prototype.require = function (mod, ...args) {
	if (mod === 'linkifyjs') {
		mod = 'linkifyjs/src/linkify';
	} else if (mod === 'linkify-element') {
		mod = 'linkify-element/src/linkify-element';
	} else if (/^linkifyjs\/lib/.test(mod)) {
		mod.replace(/^linkifyjs\/lib/, 'linkifyjs/src');
	}
	return originalRequire.call(this, mod, ...args);
};

global.expect = expect;

// Require test files
beforeEach(() => { require('linkifyjs').reset(); });
glob.sync('./spec/**/*.test.js', { cwd: __dirname }).map(require);
