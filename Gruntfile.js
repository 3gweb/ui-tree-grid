module.exports = function (grunt) {

	// Load all grunt tasks
	require('load-grunt-tasks')(grunt);
	require('time-grunt')(grunt);


	grunt.initConfig({
		// Config Variables
		pkg: grunt.file.readJSON('package.json'),
		templates: [
			'src/templates/**.html'
		],
		srcFiles: [
			'src/*.js',
			'src/directives/*.js',
			'<%= ngtemplates.uiTreeGrid.dest %>'
		],
		buildFolder: [
			'build'
		],
		// Config Tasks
		watch: {
			livereload: {
				options: {
					livereload: '<%= connect.options.livereload %>'
				},
				files: ['<%= srcFiles %>']
			}
		},
		connect: {
			options: {
				port: 9000,
				hostname: '0.0.0.0'
			},
			livereload: {
				options: {
					open: true,
					livereload: true,
					base: ['./samples/', './build/']
				}
			}
		},
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			all: ['<%= srcFiles %>']
		},
		clean: {
			build: ['<%= buildFolder %>']
		},
		ngtemplates: {
			options: {
				htmlmin: {
					collapseBooleanAttributes: true,
					collapseWhitespace: true,
					removeAttributeQuotes: true,
					removeComments: true, // Only if you don't use comment directives!
					removeEmptyAttributes: true,
					removeRedundantAttributes: true,
					removeScriptTypeAttributes: true,
					removeStyleLinkTypeAttributes: true
				}
			},
			uiTreeGrid: {
				cwd: 'src/templates',
				src: '*.html',
				dest: '<%= buildFolder %>/js/templates.js'
			}
		},
		concat: {
			options: {
				banner: '/***********************************************\n' +
					'* ui-tree-grid JavaScript Library\n' +
					'* Authors: https://github.com/guilhermegregio/ui-tree-grid/blob/master/README.md \n' +
					'* License: MIT (http://www.opensource.org/licenses/mit-license.php)\n' +
					'* Compiled At: <%= grunt.template.today("mm/dd/yyyy HH:MM") %>\n' +
					'***********************************************/\n' +
					'(function(window) {\n',
				footer: '\n}(window));'
			},
			dist: {
				src: ['<%= srcFiles %>'],
				dest: '<%= buildFolder %>/js/ui-tree-grid.js'
			}
		},
		ngmin: {
			build: {
				src: ['<%= buildFolder %>/js/ui-tree-grid.js'],
				dest: '<%= buildFolder %>/js/ui-tree-grid.js'
			}
		},
		uglify: {
			uiTreeGrid: {
				files: {
					'<%= buildFolder %>/js/ui-tree-grid.min.js': ['<%= buildFolder %>/js/ui-tree-grid.js']
				}
			}
		},
		cssmin: {
			build: {
				files: {
					'<%= buildFolder %>/css/ui-tree-grid.min.css': ['src/style/ui-tree-grid.css']
				}
			}
		}
	});

	/*
	 Tasks
	 */
	grunt.registerTask('serve', function () {
		grunt.task.run([
			'build',
			'connect:livereload',
			'watch'
		]);
	});

	grunt.registerTask('build', 'Build ui-tree-grid', [
		'clean',
		'jshint',
		'ngtemplates',
		'concat',
		'ngmin',
		'uglify',
		'cssmin'
	]);

	grunt.registerTask('default', [
		'build'
	]);
};