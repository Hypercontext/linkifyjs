module.exports = function (grunt) {

	"use strict";

	grunt.initConfig({

		// Import package manifest
		pkg: grunt.file.readJSON("package.json"),

		// Banner definitions
		meta: {
			banner: "/*\n" +
				" *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n" +
				" *  <%= pkg.description %>\n" +
				" *  <%= pkg.homepage %>\n" +
				" *\n" +
				" *  Made by <%= pkg.author %>\n" +
				" *  Under <%= pkg.license %> License\n" +
				" */\n"
		},

		// Concat definitions
		concat: {
			dist: {
				src: ["src/jquery.linkify.js"],
				dest: "dist/jquery.linkify.js"
			},
			options: {
				banner: "<%= meta.banner %>"
			}
		},

		// Lint definitions
		jshint: {
			files: ["src/jquery.linkify.js"],
			options: {
				jshintrc: ".jshintrc"
			}
		},

		// Minify definitions
		uglify: {
			my_target: {
				src: ["dist/jquery.linkify.js"],
				dest: "dist/jquery.linkify.min.js"
			},
			options: {
				banner: "<%= meta.banner %>"
			}
		},

		copy: {
			main: {
				src: "dist/*",
				dest: "demo/"
			},
		},

		connect: {
			server: {
				options: {
					keepalive: true
				}
			}
		},

		"gh-pages": {
			options: {
				base: "demo"
			},
			src: ["**"]
		},

		bumper: {
			options: {
				tasks: [
					"default",
					"gh-pages"
				]
			},
			push: {
				files: [
					"package.json",
					"bower.json"
				],
				updateConfigs: ["pkg"],
				releaseBranch: []
			}
		},

		clean: [
			".grunt/grunt-gh-pages/gh-pages"
		]

	});

	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-connect");
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-gh-pages");
	grunt.loadNpmTasks("grunt-bumper");

	grunt.registerTask("default", ["jshint", "concat", "uglify", "copy"]);
	grunt.registerTask("travis", ["jshint"]);
	grunt.registerTask("release", ["default", "bumper"]);
	grunt.registerTask("release:minor", ["bumper:minor", "clean"]);
	grunt.registerTask("release:major", ["bumper:major", "clean"]);

};
