module.exports = {

	// base path that will be used to resolve all patterns (eg. files, exclude)
	basePath: __dirname.replace(/\/?test\/?$/, '/'),

	// frameworks to use
	// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
	frameworks: ['qunit'],

	// list of files / patterns to load in the browser
	files: [
		{pattern: 'node_modules/jquery/dist/jquery.js', watched: false},
		{pattern: 'node_modules/react/dist/react.js', watched: false},
		{pattern: 'node_modules/react-dom/dist/react-dom.js', watched: false},
		'dist/linkify-polyfill.min.js',
		'dist/linkify.min.js',
		'dist/*.min.js',
		'test/qunit/globals.js',
		'test/qunit/main.js'
	],

	// list of files to exclude
	exclude: [
		'dist/*.amd.min.js'
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
