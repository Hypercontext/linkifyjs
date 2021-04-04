/* eslint-disable mocha/no-top-level-hooks */
/* eslint-disable mocha/no-hooks-for-single-case */
import glob from 'glob';
import { expect } from 'chai';

const Module = require('module');
const originalRequire = Module.prototype.require;

Module.prototype.require = function (mod, ...args) {
	if (mod === 'linkifyjs') {
		mod = 'linkifyjs/src/linkify';
	} else if (/^linkifyjs\/lib/.test(mod)) {
		mod.replace(/^linkifyjs\/lib/, 'linkifyjs/src');
	}
	return originalRequire.call(this, mod, ...args);
};

global.expect = expect;

// Require test files
beforeEach(() => { require('linkifyjs').reset(); });
glob.sync('./spec/**/*.test.js', { cwd: __dirname }).map(require);
