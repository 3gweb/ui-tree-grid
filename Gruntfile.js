module.exports = function (grunt) {
	'use strict';
	// Load all grunt tasks
	require('load-grunt-tasks')(grunt);
	require('time-grunt')(grunt);


	grunt.initConfig({
		// Config Variables
		pkg: grunt.file.readJSON('package.json'),

		srcDir: 'src',
		tempDir: '.tmp',
		buildDir: 'build',
		releaseDir: 'releases',

		samplesDir: 'samples',

		templates: ['<%= srcDir %>/templates/**.html'],

		watchFilesSrc: [
			'<%= srcDir%>/**/*',
			'<%= ngtemplates.uiTreeGrid.dest %>'
		],
		watchFilesSamples: [
			'<%= samplesDir%>/**/*'
		],
		srcFilesJs: [
			'<%= srcDir%>/**.js',
			'<%= srcDir%>/**/*.js',
			'<%= ngtemplates.uiTreeGrid.dest %>'
		],
		// Config Tasks
		karma: {
			unit: {
				configFile: 'karma.conf.js',
				singleRun: true
			}
		},
		watch: {
			samples: {
				options: {
					livereload: true
				},
				tasks: ['buildSamples'],
				files: [
					'<%= watchFilesSrc %>',
					'<%= watchFilesSamples %>'
				]
			}
		},
		connect: {
			options: {
				port: 0,
				hostname: '0.0.0.0'
			},
			samples: {
				options: {
					open: true,
					livereload: true,
					base: ['<%= samplesDir %>', '<%= tempDir %>']
				}
			}
		},
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			all: ['<%= srcDir %>', 'Gruntfile.js']
		},
		clean: {
			temp: ['<%= tempDir %>'],
			build: ['<%= buildDir %>']
		},
		ngtemplates: {
			options: {
				htmlmin: {
					collapseBooleanAttributes: true,
					collapseWhitespace: true,
					removeAttributeQuotes: true,
					removeComments: true,
					removeEmptyAttributes: true,
					removeRedundantAttributes: true,
					removeScriptTypeAttributes: true,
					removeStyleLinkTypeAttributes: true
				}
			},
			uiTreeGrid: {
				cwd: '<%= srcDir %>/templates',
				src: '*.html',
				dest: '<%= tempDir %>/js/templates.js'
			}
		},
		concat: {
			options: {
				banner: '/***********************************************\n' +
					'* <%= pkg.name %> JavaScript Library\n' +
					'* Authors: https://github.com/guilhermegregio/ui-tree-grid/blob/master/README.md \n' +
					'* License: MIT (http://www.opensource.org/licenses/mit-license.php)\n' +
					'* Compiled At: <%= grunt.template.today("mm/dd/yyyy HH:MM") %>\n' +
					'***********************************************/\n' +
					'(function(window) {\n',
				footer: '\n}(window));'
			},
			build: {
				src: ['<%= srcFilesJs %>'],
				dest: '<%= buildDir %>/js/<%= pkg.name %>.js'
			},
			release: {
				src: ['<%= srcFilesJs %>'],
				dest: '<%= releaseDir %>/<%= pkg.version %>/js/<%= pkg.name %>-<%= pkg.version %>.js'
			},
			samples: {
				src: ['<%= srcFilesJs %>'],
				dest: '<%= tempDir %>/js/<%= pkg.name %>.js'
			}
		},
		ngmin: {
			build:{
				src: ['<%= buildDir %>/js/<%= pkg.name %>.js'],
				dest: '<%= buildDir %>/js/<%= pkg.name %>.js'
			},
			release:{
				src: ['<%= releaseDir %>/<%= pkg.version %>/js/<%= pkg.name %>-<%= pkg.version %>.js'],
				dest: '<%= releaseDir %>/<%= pkg.version %>/js/<%= pkg.name %>-<%= pkg.version %>.js'
			},
			samples: {
				src: ['<%= tempDir %>/js/<%= pkg.name %>.js'],
				dest: '<%= tempDir %>/js/<%= pkg.name %>.js'
			}
		},
		uglify: {
			build:{
				files: {
					'<%= buildDir %>/js/<%= pkg.name %>.min.js': ['<%= buildDir %>/js/<%= pkg.name %>.js']
				}
			},
			release:{
				files: {
					'<%= releaseDir %>/<%= pkg.version %>/js/<%= pkg.name %>-<%= pkg.version %>.min.js': ['<%= releaseDir %>/<%= pkg.version %>/js/<%= pkg.name %>-<%= pkg.version %>.js']
				}
			},
			samples: {
				files: {
					'<%= tempDir %>/js/<%= pkg.name %>.min.js': ['<%= tempDir %>/js/<%= pkg.name %>.js']
				}
			}
		},
		cssmin: {
			build:{
				files: {
					'<%= buildDir %>/css/<%= pkg.name %>.min.css': ['<%= srcDir %>/style/<%= pkg.name %>.css']
				}
			},
			release:{
				files: {
					'<%= releaseDir %>/<%= pkg.version %>/css/<%= pkg.name %>-<%= pkg.version %>.min.css': ['<%= srcDir %>/style/<%= pkg.name %>.css']
				}
			},
			samples: {
				files: {
					'<%= tempDir %>/css/<%= pkg.name %>.min.css': ['<%= srcDir %>/style/<%= pkg.name %>.css']
				}
			}
		}
	});

	/*
	 Tasks
	 */
	grunt.registerTask('samples', function () {
		grunt.task.run([
			'buildSamples',
			'connect:samples',
			'watch:samples'
		]);
	});

	grunt.registerTask('buildSamples', 'Build ui-tree-grid to samples', [
		'jshint',
		'clean:temp',
		'ngtemplates',
		'concat:samples',
		'ngmin:samples',
		'uglify:samples',
		'cssmin:samples',
	]);

	grunt.registerTask('build', 'Build ui-tree-grid', [
		'jshint',
		'clean:build',
		'ngtemplates',
		'concat:build',
		'ngmin:build',
		'uglify:build',
		'cssmin:build',
	]);

	grunt.registerTask('release', 'Build release ui-tree-grid', [
		'jshint',
		'ngtemplates',
		'concat:release',
		'ngmin:release',
		'uglify:release',
		'cssmin:release',
	]);

	grunt.registerTask('default', [
		'build'
	]);
};