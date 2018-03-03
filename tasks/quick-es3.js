/* istanbul ignore file */

const replace = require('gulp-replace');
const lazypipe = require('lazypipe');

// HACK to convert linkify code to something more ES3-compatible for IE8
module.exports = lazypipe()
	.pipe(replace, /\.default([^a-zA-Z0-9])/g, '[\'default\']$1')
	.pipe(replace, /([^a-zA-Z0-9.])default:/g, '$1\'default\':')
	.pipe(
		replace,
		/(Object\.defineProperty\(exports,\s*['"]__esModule['"],\s*\{\s*value:\s*true\s*\}\);)/g,
		(match) => `try { ${match} } catch (e) { exports['__esModule'] = true; }`
	);
