module.exports = {

	// base path that will be used to resolve all patterns (eg. files, exclude)
	basePath: __dirname.replace(/\/?test\/?$/, '/'),

	// frameworks to use
	// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
	frameworks: ['qunit'],

	// list of files / patterns to load in the browser
	// React doesn't like being loading synchronously when useing AMD modules,
	// so test/qunit/react.amd.js will load React
	files: [
		'node_modules/babel-polyfill/dist/polyfill.js',
		{pattern: 'node_modules/requirejs/require.js', watched: false},
		{pattern: 'node_modules/jquery/dist/jquery.js', watched: false},
		{pattern: 'vendor/react.min.js', watched: false, included: false, served: true},
		{pattern: 'vendor/react-dom.min.js', watched: false, included: false, served: true},
		{pattern: 'test/qunit/react.amd.js', included: false, served: true},
		'dist/linkify-polyfill.min.js',
		'dist/linkify.amd.min.js',
		// 'dist/linkify.amd.js', // Uncompressed
		'test/qunit/ie8.js',
		{pattern: 'dist/linkify-react.amd.min.js', included: false, served: true},
		// {pattern: 'dist/linkify-react.amd.js', included: false, served: true}, // Uncompressed
		'dist/*.amd.min.js',
		// 'dist/*.amd.js', // Uncompressed
		'test/qunit/amd.js',
		'test/qunit/main.js'
	],

	// list of files to exclude
	exclude: [
		// '*.min.js', // Uncompressed
	],

	// QUnit configuration
	client: {
		clearContext: true,
		qunit: {
			showUI: false,
			autostart: false
		}
	},

	// preprocess matching files before serving them to the browser
	// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
	preprocessors: {},

	// test results reporter to use
	// possible values: 'dots', 'progress'
	// available reporters: https://npmjs.org/browse/keyword/karma-reporter
	reporters: ['dots'],

	// web server port
	port: 9876,

	// enable / disable colors in the output (reporters and logs)
	colors: true,

	// enable / disable watching file and executing tests whenever any file changes
	autoWatch: true,

	// Continuous Integration mode
	// if true, Karma captures browsers, runs the tests and exits
	singleRun: false
};
