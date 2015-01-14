var gulp = require('gulp'),
stylish = require('jshint-stylish'),
amdOptimize = require('amd-optimize');

var // Gulp plugins
concat			= require('gulp-concat'),
jshint			= require('gulp-jshint'),
mocha			= require('gulp-mocha'),
// rjs				= require('gulp-r'),
sourcemaps		= require('gulp-sourcemaps'),
rename			= require('gulp-rename'),
to5				= require('gulp-6to5'),
uglify			= require('gulp-uglify');
wrap			= require('gulp-wrap');

var paths = {
	src: 'src/**/*.js',
	amd: 'build/amd/**/*.js',
	test: 'test/index.js',
	spec: 'test/spec/**.js'
};

/**
	ES6 ~> 6to5 (with CJS Node Modules)
*/
gulp.task('6to5', function () {
	return gulp.src(paths.src)
	.pipe(to5())
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
		// moduleRoot: 'linkifyjs'
	}))
	.pipe(gulp.dest('build/amd'))
	.pipe(amdOptimize('linkify', {
		// paths: {
		// 	parser: 'build/amd/parser/index',
		// 	scanner: 'build/amd/scanner/index'
		// }
	}))
	.pipe(concat('linkify.amd.js'))
	.pipe(gulp.dest('build'));
});

// gulp.task('amd', function () {
// 	gulp.src(paths.amd)
// });

// gulp.task('rjs', function () {
// 	gulp.src(paths.amd)
// 	.pipe(rjs({
//         baseUrl: __dirname + '/build/amd/'
//     }))
//     .pipe(gulp.dest('dist/amd'));
// })

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
	gulp.src('build/linkify.amd.js')
	.pipe(gulp.dest('dist'))
	.pipe(rename(function (path) {
		path.extname = '.min.js';
	}))
	.pipe(uglify())
	.pipe(gulp.dest('dist'));
});

// Build steps
gulp.task('build', ['6to5', '6to5-amd']);

gulp.task('dist', ['6to5', '6to5-amd', 'uglify']);
gulp.task('test', ['jshint', 'build', 'mocha']);

/**
	Build app and begin watching for changes
*/
gulp.task('default', ['6to5'], function () {
	gulp.watch(paths.src, ['6to5']);
});
