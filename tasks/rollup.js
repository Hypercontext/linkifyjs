'use strict';

const util = require('gulp-util');
const through = require('through2');
const rollup = require('rollup').rollup;
const extend = require('lodash/extend');

const PluginError = util.PluginError;
const PLUGIN_NAME = 'gulp-rollup';

module.exports = function (options) {
	if (!options || 'object' !== typeof options.bundle) {
		this.emit('error', new PluginError(PLUGIN_NAME, 'Requires bundle option'));
	}

	function transform(file, enc, callback) {
		if (file.isStream()) {
			this.emit('error', new PluginError(PLUGIN_NAME, 'Streams not supported'));
			return callback();
		}

		let rollupOpts = options.rollup || {};

		rollup(extend({
			entry: file.path
		}, rollupOpts)).then((bundle) => {
			let result = bundle.generate(options.bundle);
			file.contents = new Buffer(result.code, enc);
			callback(null, file);
		}).catch(err => {
			let message = originalError.annotated || originalError.message;
			let details = {
				name: originalError.name,
				stack: originalError.stack,
				fileName: originalError.fileName,
				lineNumber: originalError.lineNumber
			};
			this.emit('error', new PluginError(PLUGIN_NAME, message, details));
			callback();
		});
	}
	return through.obj(transform);
};
