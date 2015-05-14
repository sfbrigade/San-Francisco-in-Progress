module.exports = function (grunt) {

  'use strict';

  var banner = '// <%= pkg.name %> - <%= pkg.version%>\n';
  banner += '// https://github.com/svnlto/<%= pkg.name%>.js\n';
  banner += '// Copyright 2012 - 2014 https://github.com/svnlto/\n';
  banner += '// Licensed Apache License 2.0\n';
  banner += '\n';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'test/specs/**/*.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint', 'browserify:dev']
    },

    concat: {
      options: {
        banner: banner
      },
      dist: {
        src: ['dist/<%= pkg.name %>.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },

    uglify: {
      options: {
        banner: banner
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },


    browserify: {
      dev: {
        src: ['src/barf.js'],
        dest: 'dist/barf.js',
        options: {
          external: [ 'underscore', 'backbone' ],
          standalone: 'Backbone.Router',
          debug: true
        }
      },
      build: {
        src: ['src/barf.js'],
        dest: 'dist/barf.js',
        options: {
          external: [ 'underscore', 'backbone' ],
          standalone: 'Backbone.Router'
        }
      }
    },
  });

  // load all tasks defined in node_modules starting with 'grunt-'
  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', ['jshint']);
  grunt.registerTask('build', ['jshint', 'browserify:build', 'concat', 'uglify']);
};
