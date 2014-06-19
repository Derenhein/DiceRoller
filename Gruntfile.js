module.exports = function(grunt) {
	'use strict';

	// Load the plugins.
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-htmlhint');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-csslint');

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		// Some typical JSHint options and globals
		jshint: {
			files: ['Gruntfile.js', 'libs/**/*.js','libs/*.js', 'js/*.js'],
			options: {
				curly: true,
				eqeqeq: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				boss: true,
				eqnull: true,
				browser: true,
				reporter: 'jslint'
			},
			globals: {
				jQuery: true,
				console: true,
				module: true
			}

		},
		htmlhint: {
			build: {
				options: {
					'tag-pair': true,
					'tagname-lowercase': true,
					'attr-lowercase': true,
					'attr-value-double-quotes': true,
					'doctype-first': true,
					'spec-char-escape': true,
					'id-unique': true,
					'head-script-disabled': true,
					'style-disabled': true
				},
				src: ['index.html']
			}
		},
		watch: {
			options: {
				nospawn: true,
				livereload: true
			},
			scripts: {
				files: ['Gruntfile.js', 'libs/**/*.js','libs/*.js','js/*.js'],
				tasks: ['jshint', 'uglify', 'qunit'],
				options: {
					livereload: true
				}
			},
			gruntfile: {
				files: ['<%= jshint.files %>'],
				tasks: ['jshint', 'uglify'],
			},
			html: {
				files: ['index.html'],
				tasks: ['htmlhint']
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
				mangle: true,
				wrap: true,
				compress: true
			},
			my_target: {
				files: [{
					expand: true,
					cwd: 'src/',
					src: '**/*.js',
					dest: 'build/'
				}]
			}
		}

	});

	// Default task(s).
	grunt.registerTask('default', ['jshint', 'watch', 'htmlhint', 'uglify']);

};