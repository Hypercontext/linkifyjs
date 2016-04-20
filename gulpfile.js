var gulp = require('gulp'),
amdOptimize = require('amd-optimize'),
glob = require('glob'),
Server = require('karma').Server,
merge = require('merge-stream'),
path = require('path'),
stylish = require('jshint-stylish'),
tlds = require('./tlds');

var // Gulp plugins
concat			= require('gulp-concat'),
closureCompiler	= require('gulp-closure-compiler'),
istanbul		= require('gulp-istanbul'),
jshint			= require('gulp-jshint'),
mocha			= require('gulp-mocha'),
qunit			= require('gulp-qunit'),
rename			= require('gulp-rename'),
replace			= require('gulp-replace'),
babel			= require('gulp-babel'),
uglify			= require('gulp-uglify'),
wrap			= require('gulp-wrap');

var paths = {
	src: 'src/**/*.js',
	lib: ['lib/**/*.js'],
	libTest: ['lib/*.js', 'lib/linkify/**/*.js'],
	libCore: [
		'lib/linkify/core/*.js',
		'lib/linkify/utils/*.js',
		'lib/linkify.js'
	],
	amd: 'build/amd/**/*.js',
	test: 'test/index.js',
	spec: 'test/spec/**.js',
	qunit: 'test/qunit/*html'
};

var tldsReplaceStr = '"' + tlds.join('|') + '".split("|")';

/**
	ES6 ~> babel (with CJS Node Modules)
	This populates the `lib` folder, allows usage with Node.js
*/
gulp.task('babel', function () {
	return gulp.src(paths.src)
	.pipe(replace('__TLDS__', tldsReplaceStr))
	.pipe(babel({
		loose: 'all'
	}))
	.pipe(gulp.dest('lib'));
});

/**
	ES6 to babel AMD modules
*/
gulp.task('babel-amd', function () {

	return gulp.src(paths.src)
	.pipe(replace('__TLDS__', tldsReplaceStr))
	.pipe(babel({
		loose: 'all',
		modules: 'amd',
		moduleIds: true
		// moduleRoot: 'linkifyjs'
	}))
	.pipe(gulp.dest('build/amd')) // Required for building plugins separately
	.pipe(amdOptimize('linkify'))
	.pipe(concat('linkify.amd.js'))
	.pipe(gulp.dest('build'));
	// Plugins
	// gulp
});

// Build core linkify.js
// Closure compiler is used here since it can correctly concatenate CJS modules
gulp.task('build-core', ['babel'], function () {

	return gulp.src(paths.libCore)
	.pipe(closureCompiler({
		compilerPath: 'node_modules/closure-compiler/lib/vendor/compiler.jar',
		fileName: 'build/.closure-output.js',
		compilerFlags: {
			process_common_js_modules: null,
			common_js_entry_module: 'lib/linkify',
			common_js_module_path_prefix: path.join(__dirname, 'lib'),
	        compilation_level: 'SIMPLE_OPTIMIZATIONS',
			formatting: 'PRETTY_PRINT',
			warning_level: 'QUIET'
		}
	}))
	.pipe(wrap({src: 'templates/linkify.js'}))
	.pipe(rename(function (path) {
		// Required due to closure compiler
		path.dirname = '.';
		path.basename = 'linkify';
	}))
	.pipe(gulp.dest('build'));
});

// Build root linkify interfaces (files located at the root src folder other
// than linkify.js)
// Depends on build-core
gulp.task('build-interfaces', ['babel-amd'], function () {

	// Core linkify functionality as plugins
	var interface, interfaces = [
		'string',
		'element',
		['linkify-element.js', 'jquery'], // jQuery interface requires both element and jquery
		[
			'simple-html-tokenizer/*.js',
			'simple-html-tokenizer.js',
			'html'
		]
	];

	// Globals browser interface
	var streams = [];

	interfaces.forEach(function (interface) {

		var files = {js: [], amd: []};

		if (interface instanceof Array) {
			// Interface has other interface dependencies within this package
			interface.forEach(function (i, idx) {
				if (idx == interface.length - 1) { return; } // ignore last index
				files.js.push('src/' + i);
				files.amd.push('build/amd/' + i);
			});

			// The last dependency is the name of the interface
			interface = interface.pop();
		}

		files.js.push('src/linkify-' + interface + '.js');
		files.amd.push('build/amd/linkify-' + interface + '.js');

		// Browser interface
		stream = gulp.src(files.js)
		.pipe(babel({
			loose: 'all',
			modules: 'ignore'
		}))
		.pipe(concat('linkify-' + interface + '.js'))
		.pipe(wrap({src: 'templates/linkify-' + interface + '.js'}))
		.pipe(gulp.dest('build'));

		streams.push(stream);

		// AMD interface
		stream = gulp.src(files.amd)
		.pipe(concat('linkify-' + interface + '.amd.js'))
		.pipe(wrap({src: 'templates/linkify-' + interface + '.amd.js'}))
		.pipe(gulp.dest('build'));

		streams.push(stream);
	});

	return merge.apply(this, streams);
});

/**
	NOTE - Run 'babel' and 'babel-amd' first
*/
gulp.task('build-plugins', ['babel-amd'], function () {

	var stream, streams = [];

	// Get the filenames of all available plugins
	var
	plugin,
	plugins = glob.sync('*.js', {
		cwd: path.join(__dirname, 'src', 'linkify', 'plugins')
	}).map(function (plugin) {
		return plugin.replace(/\.js$/, '');
	});

	// Browser plugins
	for (var i = 0; i < plugins.length; i++) {
		plugin = plugins[i];

		// Global plugins
		stream = gulp.src('src/linkify/plugins/' + plugin + '.js')
		.pipe(babel({
			loose: 'all',
			modules: 'ignore'
		}))
		.pipe(wrap({src: 'templates/linkify/plugins/' + plugin + '.js'}))
		.pipe(concat('linkify-plugin-' + plugin + '.js'))
		.pipe(gulp.dest('build'));
		streams.push(stream);

		// AMD plugins
		stream = gulp.src('build/amd/linkify/plugins/' + plugin + '.js')
		.pipe(wrap({src: 'templates/linkify/plugins/' + plugin + '.amd.js'}))
		.pipe(concat('linkify-plugin-' + plugin + '.amd.js'))
		.pipe(gulp.dest('build'));
		streams.push(stream);

	}

	return merge.apply(this, streams);
});

// Build steps
gulp.task('build', [
	'babel',
	'babel-amd',
	'build-core',
	'build-interfaces',
	'build-plugins'
], function (cb) { cb(); });

/**
	Lint using jshint
*/
gulp.task('jshint', function () {
	return gulp.src([paths.src, paths.test, paths.spec])
	.pipe(jshint())
	.pipe(jshint.reporter(stylish))
	.pipe(jshint.reporter('fail'));
});

/**
	Run mocha tests
*/
gulp.task('mocha', ['build'], function () {
	return gulp.src(paths.test, {read: false})
	.pipe(mocha());
});

/**
	Code coverage reort for mocha tests
*/
gulp.task('coverage', ['build'], function (cb) {
	// IMPORTANT: return not required here (and will actually cause bugs!)
	gulp.src(paths.libTest)
	.pipe(istanbul()) // Covering files
	.pipe(istanbul.hookRequire()) // Force `require` to return covered files
	.on('finish', function () {
		gulp.src(paths.test, {read: false})
		.pipe(mocha())
		.pipe(istanbul.writeReports()) // Creating the reports after tests runned
		.on('end', cb);
	});
});

gulp.task('karma', ['build'], function (done) {
	var server = new Server({
		configFile: __dirname + '/test/dev.conf.js',
		singleRun: true
	}, done);
	return server.start();
});

gulp.task('karma-chrome', ['build'], function (done) {
	var server = new Server({
		configFile: __dirname + '/test/chrome.conf.js',
	}, done);
	return server.start();
});

gulp.task('karma-ci', ['build'], function (done) {
	var server = new Server({
		configFile: __dirname + '/test/ci.conf.js',
		singleRun: true
	}, done);
	return server.start();
});

gulp.task('qunit', ['build'], function () {
	return gulp.src(paths.qunit)
	.pipe(qunit());
});

// Build the deprecated legacy interface
gulp.task('build-legacy', ['build'], function () {
	return gulp.src(['build/linkify.js', 'build/linkify-jquery.js'])
	.pipe(concat('jquery.linkify.js'))
	.pipe(wrap({src: 'templates/linkify-legacy.js'}))
	.pipe(gulp.dest('build/dist'));
});

// Build a file that can be used for easy headless benchmarking
gulp.task('build-benchmark', ['build-legacy'], function () {
	return gulp.src('build/dist/jquery.linkify.js')
	.pipe(concat('linkify-benchmark.js'))
	.pipe(wrap({src: 'templates/linkify-benchmark.js'}))
	.pipe(uglify())
	.pipe(gulp.dest('build/benchmark'));
});

gulp.task('uglify', ['build', 'build-legacy'], function () {
	var task = gulp.src('build/*.js')
	.pipe(gulp.dest('dist')) // non-minified copy
	.pipe(rename(function (path) {
		path.extname = '.min.js';
	}))
	.pipe(uglify())
	.pipe(gulp.dest('dist'));

	var taskLegacy = gulp.src('build/dist/jquery.linkify.js')
	.pipe(gulp.dest('dist/dist')) // non-minified copy
	.pipe(rename(function (path) {
		path.extname = '.min.js';
	}))
	.pipe(uglify())
	.pipe(gulp.dest('dist/dist'));

	return merge.apply(this, [task, taskLegacy]);
});

gulp.task('dist', ['uglify']);
gulp.task('test', ['build', 'jshint', 'qunit', 'coverage']);
gulp.task('test-ci', ['karma-ci']);
// Using with other tasks causes an error here for some reason

/**
	Build JS and begin watching for changes
*/
gulp.task('default', ['babel'], function () {
	return gulp.watch(paths.src, ['babel']);
});
