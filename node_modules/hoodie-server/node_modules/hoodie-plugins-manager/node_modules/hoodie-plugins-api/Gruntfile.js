module.exports = function (grunt) {

  grunt.initConfig({

    jshint: {
      files: [
        'Gruntfile.js',
        'lib/**/*.js',
        'test/**/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    nodeunit: {
      all: [ 'test/test-*.js' ]
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-release-hoodie');

  grunt.registerTask('test', [ 'jshint', 'nodeunit' ]);
  grunt.registerTask('default', [ 'test' ]);
  grunt.registerTask('ci', [ 'test', 'integration-test' ]);

};
