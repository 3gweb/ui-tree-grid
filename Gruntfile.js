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
			uiTreeGrid: {
				cwd: 'src/templates',
				src: '*.html',
				dest: '<%= buildFolder %>/js/templates.js'
			}
		},
		concat: {
			options: {
				separator: ';'
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
		}
	});

	/*
	 Tasks
	 */
	grunt.registerTask('build', 'Build ui-tree-grid', [
		'clean',
		'jshint',
		'ngtemplates',
		'concat',
		'ngmin',
		'uglify'
	]);

	grunt.registerTask('default', [
		'build'
	]);
};