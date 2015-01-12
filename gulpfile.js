var gulp = require('gulp'),
stylish = require('jshint-stylish'),
extend = require('lodash').extend;

var // Gulp plugins
concat			= require('gulp-concat'),
jshint			= require('gulp-jshint'),
mocha			= require('gulp-mocha'),
sourcemaps		= require('gulp-sourcemaps'),
to5				= require('gulp-6to5'),
uglify			= require('gulp-uglify');

var paths = {
	src: 'src/**/*.js',
	test: 'test/index.js',
	spec: 'test/spec/**.js'
};

/**
	ES6 ~> ES5
*/
gulp.task('6to5', function () {
	return gulp.src(paths.src)
	.pipe(to5())
	.pipe(gulp.dest('lib'));
});

// TODO - Vanilla globals version, probably with AMD
gulp.task('browser', function () {
	var ext,
	options = {
		moduleRoot: 'linkifyjs',
	},
	modules = {
		amd: 'amd',
		umd: 'umd'
	};

	for (var type in modules) {
		ext = modules[type];

		gulp.src(paths.src)
		.pipe(sourcemaps.init())
		.pipe(to5(extend({modules: type}, options)))
		.pipe(concat('linkify.' + ext + '.js'))
		.pipe(gulp.dest('build'));
	}

});

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
	gulp.src(paths.test, {read: false})
	.pipe(mocha());
});

gulp.task('uglify', function () {
	gulp.src('build/parser/index.js')
	.pipe(uglify())
	.pipe(gulp.dest('dist'));
});

// Build steps
gulp.task('build', ['6to5']);
gulp.task('dist', ['6to5', 'uglify']);
gulp.task('test', ['jshint', 'build', 'mocha']);

/**
	Build app and begin watching for changes
*/
gulp.task('default', ['build'], function () {
	gulp.watch(paths.src, ['6to5']);
});
