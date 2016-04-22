'use strict';

const gulp = require('gulp');
const amdOptimize = require('amd-optimize');
const glob = require('glob');
const Server = require('karma').Server;
const merge = require('merge-stream');
const path = require('path');
const stylish = require('jshint-stylish');
const tlds = require('./tlds');

// Gulp plugins
const concat = require('gulp-concat');
const closureCompiler = require('gulp-closure-compiler');
const istanbul = require('gulp-istanbul');
const jshint = require('gulp-jshint');
const mocha = require('gulp-mocha');
const qunit = require('gulp-qunit');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const wrap = require('gulp-wrap');

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

var tldsReplaceStr = `'${tlds.join('|')}'.split('|')`;

/**
	ES6 ~> babel (with CJS Node Modules)
	This populates the `lib` folder, allows usage with Node.js
*/
gulp.task('babel', () =>
	gulp.src(paths.src)
	.pipe(replace('__TLDS__', tldsReplaceStr))
	.pipe(babel({
		loose: 'all'
	}))
	.pipe(gulp.dest('lib'))
);

/**
	ES6 to babel AMD modules
*/
gulp.task('babel-amd', () =>
	gulp.src(paths.src)
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
	.pipe(gulp.dest('build'))
);

// Build core linkify.js
// Closure compiler is used here since it can correctly concatenate CJS modules
gulp.task('build-core', ['babel'], () =>
	gulp.src(paths.libCore)
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
	.pipe(gulp.dest('build'))
);

// Build root linkify interfaces (files located at the root src folder other
// than linkify.js)
// Depends on build-core
gulp.task('build-interfaces', ['babel-amd'], function () {

	// Core linkify functionality as plugins
	let interfaces = [
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
	let streams = [];

	interfaces.forEach(intrface => {

		let files = {js: [], amd: []};

		if (intrface instanceof Array) {
			// Interface has other interface dependencies within this package
			intrface.forEach((i, idx) => {
				if (idx == intrface.length - 1) { return; } // ignore last index
				files.js.push('src/' + i);
				files.amd.push('build/amd/' + i);
			});

			// The last dependency is the name of the intrface
			intrface = intrface.pop();
		}

		files.js.push(`src/linkify-${intrface}.js`);
		files.amd.push(`build/amd/linkify-${intrface}.js`);

		// Browser intrface
		let stream = gulp.src(files.js)
		.pipe(babel({
			loose: 'all',
			modules: 'ignore'
		}))
		.pipe(concat(`linkify-${intrface}.js`))
		.pipe(wrap({src: `templates/linkify-${intrface}.js`}))
		.pipe(gulp.dest('build'));

		streams.push(stream);

		// AMD intrface
		stream = gulp.src(files.amd)
		.pipe(concat(`linkify-${intrface}.amd.js`))
		.pipe(wrap({src: `templates/linkify-${intrface}.amd.js`}))
		.pipe(gulp.dest('build'));

		streams.push(stream);
	});

	return merge(...streams);
});

/**
	NOTE - Run 'babel' and 'babel-amd' first
*/
gulp.task('build-plugins', ['babel-amd'], () => {

	let streams = [];

	// Get the filenames of all available plugins
	let plugins = glob.sync('*.js', {
		cwd: path.join(__dirname, 'src', 'linkify', 'plugins')
	}).map(plugin => plugin.replace(/\.js$/, ''));

	// Browser plugins
	plugins.forEach(plugin => {

		// Global plugins
		var stream = gulp.src(`src/linkify/plugins/${plugin}.js`)
		.pipe(babel({
			loose: 'all',
			modules: 'ignore'
		}))
		.pipe(wrap({src: `templates/linkify/plugins/${plugin}.js`}))
		.pipe(concat(`linkify-plugin-${plugin}.js`))
		.pipe(gulp.dest('build'));
		streams.push(stream);

		// AMD plugins
		stream = gulp.src(`build/amd/linkify/plugins/${plugin}.js`)
		.pipe(wrap({src: `templates/linkify/plugins/${plugin}.amd.js`}))
		.pipe(concat(`linkify-plugin-${plugin}.amd.js`))
		.pipe(gulp.dest('build'));
		streams.push(stream);

	});

	return merge(...streams);
});

// Build steps
gulp.task('build', [
	'babel',
	'babel-amd',
	'build-core',
	'build-interfaces',
	'build-plugins'
], cb => { cb(); });

/**
	Lint using jshint
*/
gulp.task('jshint', () =>
	gulp.src([paths.src, paths.test, paths.spec])
	.pipe(jshint())
	.pipe(jshint.reporter(stylish))
	.pipe(jshint.reporter('fail'))
);

/**
	Run mocha tests
*/
gulp.task('mocha', ['build'], () =>
	gulp.src(paths.test, {read: false})
	.pipe(mocha())
);

/**
	Code coverage reort for mocha tests
*/
gulp.task('coverage', ['build'], callback => {
	// IMPORTANT: return not required here (and will actually cause bugs!)
	gulp.src(paths.libTest)
	.pipe(istanbul()) // Covering files
	.pipe(istanbul.hookRequire()) // Force `require` to return covered files
	.on('finish', function () {
		gulp.src(paths.test, {read: false})
		.pipe(mocha())
		.pipe(istanbul.writeReports()) // Creating the reports after tests runned
		.on('end', callback);
	});
});

gulp.task('karma', ['build'], callback => {
	let server = new Server({
		configFile: __dirname + '/test/dev.conf.js',
		singleRun: true
	}, callback);
	return server.start();
});

gulp.task('karma-chrome', ['build'], callback => {
	let server = new Server({
		configFile: __dirname + '/test/chrome.conf.js',
	}, callback);
	return server.start();
});

gulp.task('karma-ci', ['build'], callback => {
	let server = new Server({
		configFile: __dirname + '/test/ci.conf.js',
		singleRun: true
	}, callback);
	return server.start();
});

gulp.task('qunit', ['build'], () =>
	gulp.src(paths.qunit)
	.pipe(qunit())
);

// Build the deprecated legacy interface
gulp.task('build-legacy', ['build'], () =>
	gulp.src(['build/linkify.js', 'build/linkify-jquery.js'])
	.pipe(concat('jquery.linkify.js'))
	.pipe(wrap({src: 'templates/linkify-legacy.js'}))
	.pipe(gulp.dest('build/dist'))
);

// Build a file that can be used for easy headless benchmarking
gulp.task('build-benchmark', ['build-legacy'], () =>
	gulp.src('build/dist/jquery.linkify.js')
	.pipe(concat('linkify-benchmark.js'))
	.pipe(wrap({src: 'templates/linkify-benchmark.js'}))
	.pipe(uglify())
	.pipe(gulp.dest('build/benchmark'))
);

gulp.task('uglify', ['build', 'build-legacy'], () => {
	let task = gulp.src('build/*.js')
	.pipe(gulp.dest('dist')) // non-minified copy
	.pipe(rename(function (path) {
		path.extname = '.min.js';
	}))
	.pipe(uglify())
	.pipe(gulp.dest('dist'));

	let taskLegacy = gulp.src('build/dist/jquery.linkify.js')
	.pipe(gulp.dest('dist/dist')) // non-minified copy
	.pipe(rename(function (path) {
		path.extname = '.min.js';
	}))
	.pipe(uglify())
	.pipe(gulp.dest('dist/dist'));

	return merge(task, taskLegacy);
});

gulp.task('dist', ['uglify']);
gulp.task('test', ['build', 'jshint', 'qunit', 'coverage']);
gulp.task('test-ci', ['karma-ci']);
// Using with other tasks causes an error here for some reason

/**
	Build JS and begin watching for changes
*/
gulp.task('default', ['babel'], () =>
	gulp.watch(paths.src, ['babel'])
);
