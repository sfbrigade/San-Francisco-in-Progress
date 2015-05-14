module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-release-hoodie');
  grunt.registerTask('ci', ['integration-test']);
};
