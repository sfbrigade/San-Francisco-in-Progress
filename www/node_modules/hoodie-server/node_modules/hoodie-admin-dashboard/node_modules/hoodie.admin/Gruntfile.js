module.exports = function(grunt) {

  'use strict';

  var banner = '// <%= pkg.title %> - <%= pkg.version%>\n';
  banner += '// https://github.com/hoodiehq/hoodie.admin.js\n';
  banner += '// Copyright 2012 - 2014 https://github.com/hoodiehq/\n';
  banner += '// Licensed Apache License 2.0\n';
  banner += '\n';
  banner += '(function(global) {\n';
  banner += '\'use strict\'\n';
  banner += '\n';

  var footer  = '\n';
  footer += '})(window);\n';


  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js','test/specs/**/*.js' ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint', 'browserify']
    },

    concat: {
      options: {
        banner: banner,
        footer: footer
      },
      dist: {
        src: [
          'src/hoodie.admin.js',
        ],
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
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['jshint']);
};
