var gulp = require('gulp'),
amdOptimize = require('amd-optimize'),
glob = require('glob'),
karma = require('karma').server,
path = require('path'),
stylish = require('jshint-stylish');

var // Gulp plugins
concat			= require('gulp-concat'),
closureCompiler	= require('gulp-closure-compiler'),
jshint			= require('gulp-jshint'),
mocha			= require('gulp-mocha'),
rename			= require('gulp-rename'),
to5				= require('gulp-6to5'),
uglify			= require('gulp-uglify'),
wrap			= require('gulp-wrap');

var paths = {
	src: 'src/**/*.js',
	amd: 'build/amd/**/*.js',
	test: 'test/index.js',
	spec: 'test/spec/**.js'
};

var to5format = {
	comments: true,
	indent: {
		style: '	'
	}
};

/**
	ES6 ~> 6to5 (with CJS Node Modules)
	This populates the `lib` folder, allows usage with Node.js
*/
gulp.task('6to5', function () {
	return gulp.src(paths.src)
	.pipe(to5({format: to5format}))
	.pipe(gulp.dest('lib'));
});

/**
	ES6 to 6to5 AMD modules
*/
gulp.task('6to5-amd', function () {

	gulp.src(paths.src)
	.pipe(to5({
		modules: 'amd',
		moduleIds: true,
		format: to5format
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
gulp.task('build-core', function () {

	gulp.src(['lib/linkify/core/*.js', 'lib/linkify.js'])
	.pipe(closureCompiler({
		compilerPath: 'node_modules/closure-compiler/lib/vendor/compiler.jar',
		fileName: 'linkify.js',
		compilerFlags: {
			process_common_js_modules: null,
			common_js_entry_module: 'lib/linkify',
			common_js_module_path_prefix: path.join(__dirname, 'lib'),
			formatting: 'PRETTY_PRINT'
		}
	}))
	.pipe(wrap({src: 'templates/linkify.js'}))
	.pipe(gulp.dest('build'));
});

// Build root linkify interfaces (files located at the root src folder other
// than linkify.js)
// Depends on build-core
gulp.task('build-interfaces', function () {

	// Core linkify functionality as plugins
	var interface, interfaces = [
		'string',
		// 'dom',
		// 'jquery'
	];

	// Globals browser interface
	for (var i = 0; i < interfaces.length; i++) {
		interface = interfaces[i];

		// Browser interface
		gulp.src('src/linkify-' + interface + '.js')
		.pipe(to5({
			modules: 'ignore',
			format: to5format
		}))
		.pipe(wrap({src: 'templates/linkify-' + interface + '.js'}))
		.pipe(concat('linkify-' + interface + '.js'))
		.pipe(gulp.dest('build'));

		// AMD interface
		gulp.src('build/amd/linkify-' + interface + '.js')
		.pipe(wrap({src: 'templates/linkify-' + interface + '.amd.js'}))
		.pipe(concat('linkify-' + interface + '.amd.js'))
		.pipe(gulp.dest('build'));
	}

});

/**
	NOTE - Run '6to5' and '6to5-amd' first
*/
gulp.task('build-plugins', function () {

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
		gulp.src('src/linkify/plugins/' + plugin + '.js')
		.pipe(to5({
			modules: 'ignore',
			format: to5format
		}))
		.pipe(wrap({src: 'templates/linkify/plugins/' + plugin + '.js'}))
		.pipe(concat('linkify-plugin-' + plugin + '.js'))
		.pipe(gulp.dest('build'));

		// AMD plugins
		gulp.src('build/amd/linkify/plugins/' + plugin + '.js')
		.pipe(wrap({src: 'templates/linkify/plugins/' + plugin + '.amd.js'}))
		.pipe(concat('linkify-plugin-' + plugin + '.amd.js'))
		.pipe(gulp.dest('build'));

	}

	// AMD Browser plugins
	for (i = 0; i < plugins.length; i++) {
		plugin = plugins[i];

	}
});

// Build steps

/**
	Lint using jshint
*/
gulp.task('jshint', function () {
	gulp.src([paths.src, paths.test, paths.spec])
	.pipe(jshint())
	.pipe(jshint.reporter(stylish))
	.pipe(jshint.reporter('fail'));
});

/**
	Run mocha tests
*/
gulp.task('mocha', function () {
	return gulp.src(paths.test, {read: false})
	.pipe(mocha());
});

gulp.task('karma', function () {
	return karma.start({
		configFile: __dirname + '/test/dev.conf.js',
		singleRun: true
	});
});

gulp.task('karma-chrome', function () {
	karma.start({
		configFile: __dirname + '/test/chrome.conf.js',
	});
});

gulp.task('karma-ci', function () {
	karma.start({
		configFile: __dirname + '/test/ci.conf.js',
		singleRun: true
	});
});

gulp.task('uglify', function () {
	gulp.src('build/*.js')
	.pipe(gulp.dest('dist')) // non-minified copy
	.pipe(rename(function (path) {
		path.extname = '.min.js';
	}))
	.pipe(uglify())
	.pipe(gulp.dest('dist'));
});

gulp.task('build', [
	'6to5',
	'6to5-amd',
	'build-core',
	'build-interfaces',
	'build-plugins'
]);

gulp.task('dist', ['build', 'uglify']);

gulp.task('test', ['jshint', 'build', 'mocha']);
gulp.task('test-ci', ['karma-ci']);
// Using with other tasks causes an error here for some reason

/**
	Build app and begin watching for changes
*/
gulp.task('default', ['6to5'], function () {
	gulp.watch(paths.src, ['6to5']);
});


