var gulp = require('gulp'),
stylish = require('jshint-stylish');

var // Gulp plugins
es6transpiler	= require('gulp-es6-transpiler'),
jshint			= require('gulp-jshint'),
mocha			= require('gulp-mocha'),
uglify			= require('gulp-uglify');

var paths = {
	src: 'src/**/*.js',
	test: 'test/index.js',
	spec: 'test/spec/**.js'
};

// The transpile plugin uses this method but it doesn't exist in Node 0.10
// Perhaps it should be `includes`?
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes
if (!String.prototype.contains) {
	String.prototype.contains = function (search, start) {
		return this.indexOf(search, start || 0) >= 0;
	};
}

/**
	ES6 ~> ES5
*/
gulp.task('transpile', function () {

	gulp.src(paths.src)
	.pipe(es6transpiler())
	.pipe(gulp.dest('build'));

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
gulp.task('build', ['transpile']);
gulp.task('dist', ['transpile', 'uglify']);
gulp.task('test', ['build', 'jshint', 'mocha']);

/**
	Build app and begin watching for changes
*/
gulp.task('default', ['build'], function () {
	gulp.watch(paths.src, ['transpile']);
});
