'use strict';

const gulp = require('gulp');
const amdOptimize = require('amd-optimize');
const glob = require('glob');
const Server = require('karma').Server;
const merge = require('merge-stream');
const path = require('path');
const runSequence = require('run-sequence');
const tlds = require('./tlds');

// Gulp plugins
const babel = require('gulp-babel');
const clean = require('gulp-clean');
const concat = require('gulp-concat');
const istanbul = require('gulp-istanbul');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
// NOTE: DO NOT Upgrade gulp-uglify, it breaks IE8 and the options don't seem to be working
const uglify = require('gulp-uglify');
const wrap = require('gulp-wrap');

const rollup = require('./tasks/rollup');
const quickEs3 = require('./tasks/quick-es3');

// All properties that are part of the public/plugin APIs
const unmangleableProps = require('./tasks/uglify').unmangleableProps;

var paths = {
	src: 'src/**/*.js',
	srcCore: 'src/linkify.js',
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
	qunit: 'test/qunit/**.js',
	polyfill: 'polyfill.js'
};

var tldsReplaceStr = `'${tlds.join('|')}'.split('|')`;

/**
	ES6 ~> babel (with CJS Node Modules)
	This populates the `lib` folder, allows usage with Node.js
*/
gulp.task('babel', () =>
	gulp.src(paths.src)
	.pipe(replace('__TLDS__', tldsReplaceStr))
	.pipe(babel())
	.pipe(gulp.dest('lib'))
);

/**
	ES6 to babel AMD modules
*/
gulp.task('babel-amd', () =>
	gulp.src(paths.src)
	.pipe(replace('__TLDS__', tldsReplaceStr))
	.pipe(babel({
		plugins: [
			'add-module-exports',
			'transform-es2015-modules-amd'
		],
		moduleIds: true
		// moduleRoot: 'linkifyjs'
	}))
	.pipe(gulp.dest('build/amd')) // Required for building plugins separately
	.pipe(amdOptimize('linkify'))
	.pipe(concat('linkify.amd.js'))
	.pipe(quickEs3())
	.pipe(gulp.dest('build'))
);

/**
	Build core linkify.js
*/
gulp.task('build-core', () =>
	gulp.src(paths.srcCore, {read: false})
	.pipe(rollup({
		bundle: {
			format: 'iife',
			moduleName: 'linkify'
		}
	}))
	.pipe(babel())
	.pipe(replace('__TLDS__', tldsReplaceStr))
	.pipe(replace('undefined.', 'window.'))
	.pipe(wrap({src: 'templates/linkify.js'}))
	.pipe(gulp.dest('build'))
);

/**
	Build root linkify interfaces (files located at the root src folder other
	than linkify.js).
*/
gulp.task('build-interfaces', () => {

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

	interfaces.forEach((intrface) => {

		let files = {js: [], amd: []};

		if (intrface instanceof Array) {
			// Interface has other intrface dependencies within this package
			intrface.forEach((i, idx) => {
				if (idx === intrface.length - 1) { return; } // ignore last index
				files.amd.push('build/amd/' + i);
			});

			// The last dependency is the name of the intrface
			intrface = intrface.pop();
		}

		files.js.push(`src/linkify-${intrface}.js`);
		files.amd.push(`build/amd/linkify-${intrface}.js`);

		let moduleName = `linkify${intrface.substring(0, 1).toUpperCase()}${intrface.substring(1)}`;

		// Browser intrface
		let stream = gulp.src(files.js)
		.pipe(rollup({
			rollup: {external: ['jquery', `${__dirname}/src/linkify.js`]},
			bundle: {
				format: 'iife',
				moduleName: moduleName,
				globals: {
					'jquery': '$',
					[`${__dirname}/src/linkify.js`]: 'linkify'
				}
			}
		}))
		.pipe(wrap({src: `templates/linkify-${intrface}.js`}))
		.pipe(babel())
		.pipe(gulp.dest('build'));

		streams.push(stream);

		// AMD intrface
		stream = gulp.src(files.amd)
		.pipe(concat(`linkify-${intrface}.amd.js`))
		.pipe(wrap({src: `templates/linkify-${intrface}.amd.js`}))
		.pipe(quickEs3())
		.pipe(gulp.dest('build'));

		streams.push(stream);
	});

	return merge.apply(this, streams);
});


gulp.task('build-plugins', () => {

	let streams = [];

	// Get the filenames of all available plugins
	let plugins = glob.sync('*.js', {
		cwd: path.join(__dirname, 'src', 'linkify', 'plugins')
	}).map((plugin) => plugin.replace(/\.js$/, ''));

	// Browser plugins
	plugins.forEach((plugin) => {

		// Global plugins
		var stream = gulp.src(`src/linkify/plugins/${plugin}.js`)
		.pipe(rollup({
			rollup: {external: [`${__dirname}/src/linkify.js`]},
			bundle: {
				format: 'iife',
				moduleName: 'plugin',
				globals: {
					'./linkify.js': 'linkify'
				}
			}
		}))
		.pipe(wrap({src: `templates/linkify/plugins/${plugin}.js`}))
		.pipe(babel())
		.pipe(concat(`linkify-plugin-${plugin}.js`))
		.pipe(gulp.dest('build'));
		streams.push(stream);

		// AMD plugins
		stream = gulp.src(`build/amd/linkify/plugins/${plugin}.js`)
		.pipe(wrap({src: `templates/linkify/plugins/${plugin}.amd.js`}))
		.pipe(concat(`linkify-plugin-${plugin}.amd.js`))
		.pipe(quickEs3())
		.pipe(gulp.dest('build'));
		streams.push(stream);

	});

	return merge.apply(this, streams);
});

gulp.task('build-polyfill', () =>
	gulp.src(paths.polyfill)
	.pipe(concat('linkify-polyfill.js'))
	.pipe(gulp.dest('build'))
);

// Build steps
gulp.task('build', [
	'babel',
	'babel-amd',
	'build-core',
	'build-interfaces',
	'build-plugins',
	'build-polyfill'
], (cb) => { cb(); });

/**
	Lint using eslint
*/
gulp.task('eslint', () =>
	gulp.src([
		'gulpfile.js',
		paths.src,
		paths.test,
		paths.spec,
		paths.qunit,
		'!src/simple-html-tokenizer/**'
	])
	.pipe(eslint())
	.pipe(eslint.format())
	.pipe(eslint.failAfterError())
);

/**
	Run mocha tests
*/
gulp.task('mocha', ['eslint', 'build'], () =>
	gulp.src(paths.test, {read: false})
	.pipe(mocha())
);

/**
	Code coverage reort for mocha tests
*/
gulp.task('coverage', ['eslint', 'dist'], (callback) => {
	// IMPORTANT: return not required here (and will actually cause bugs!)
	gulp.src(paths.libTest)
	.pipe(istanbul()) // Covering files
	.pipe(istanbul.hookRequire()) // Force `require` to return covered files
	.on('finish', () => {
		gulp.src(paths.test, {read: false})
		.pipe(mocha())
		.pipe(istanbul.writeReports()) // Creating the reports after tests runned
		.on('end', callback);
	});
});

gulp.task('karma', (callback) => {
	let server = new Server({
		configFile: __dirname + '/test/dev.conf.js',
		singleRun: true
	}, callback);
	return server.start();
});

gulp.task('karma-chrome', (callback) => {
	let server = new Server({
		configFile: __dirname + '/test/chrome.conf.js',
	}, callback);
	return server.start();
});

gulp.task('karma-firefox', (callback) => {
	let server = new Server({
		configFile: __dirname + '/test/firefox.conf.js',
	}, callback);
	return server.start();
});

gulp.task('karma-ci', (callback) => {
	let server = new Server({
		configFile: __dirname + '/test/ci.conf.js',
		singleRun: true
	}, callback);
	return server.start();
});

gulp.task('karma-amd', (callback) => {
	let server = new Server({
		configFile: __dirname + '/test/dev.amd.conf.js',
		singleRun: true
	}, callback);
	return server.start();
});

gulp.task('karma-amd-chrome', (callback) => {
	let server = new Server({
		configFile: __dirname + '/test/chrome.amd.conf.js',
	}, callback);
	return server.start();
});

gulp.task('karma-amd-firefox', (callback) => {
	let server = new Server({
		configFile: __dirname + '/test/firefox.amd.conf.js',
	}, callback);
	return server.start();
});

gulp.task('karma-amd-ci', (callback) => {
	let server = new Server({
		configFile: __dirname + '/test/ci.amd.conf.js',
		singleRun: true
	}, callback);
	return server.start();
});

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

// NOTE: DO NOT Upgrade gulp-uglify, it breaks IE8 and the options don't seem to be working
gulp.task('uglify', ['build-legacy'], () => {
	let options = {
		mangleProperties: {
			regex: new RegExp(`^(?!(${unmangleableProps.join('|')})).*$`)
		}
	};

	let task = gulp.src('build/*.js')
	.pipe(gulp.dest('dist')) // non-minified copy
	.pipe(rename((path) => path.extname = '.min.js'))
	.pipe(uglify(options))
	.pipe(gulp.dest('dist'));

	let taskLegacy = gulp.src('build/dist/jquery.linkify.js')
	.pipe(gulp.dest('dist/dist')) // non-minified copy
	.pipe(rename((path) => path.extname = '.min.js'))
	.pipe(uglify(options))
	.pipe(gulp.dest('dist/dist'));

	return merge(task, taskLegacy);
});

gulp.task('dist', ['uglify']);
gulp.task('test', (callback) =>
	runSequence('coverage', 'karma', 'karma-amd', callback)
);
gulp.task('test-ci', (callback) =>
	runSequence('karma-ci', 'karma-amd-ci', callback)
);

gulp.task('clean', () =>
	gulp.src([
		'_sass',
		'build',
		'coverage',
		'dist',
		'js',
		'lib',
	], {read: false}).pipe(clean())
);

/**
	Build JS and begin watching for changes
*/
gulp.task('default', ['eslint', 'babel'], () =>
	gulp.watch(paths.src, ['eslint', 'babel'])
);
