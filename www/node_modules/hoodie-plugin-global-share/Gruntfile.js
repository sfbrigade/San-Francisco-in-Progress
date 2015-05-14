module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      files: [
        'Gruntfile.js',
        'hoodie.global-share.js',
        'worker.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    simplemocha: {
      options: {
        ui: 'tdd'
      },
      unit: {
        src: ['test/unit/*.js']
      }
    },

    mocha_browser: {
      all: {options: {urls: ['http://localhost:<%= connect.options.port %>']}}
    },

    shell: {
      removeData: {
        command: 'rm -rf ' + require('path').resolve(__dirname, 'data')
      },
      npmLink: {
        command: 'npm link && npm link hoodie-plugin-global-share'
      },
      npmUnlink: {
        command: 'npm unlink && npm unlink hoodie-plugin-global-share'
      },
      installPlugin: {
        command: 'hoodie install global-share'
      },
      removePlugin: {
        command: 'hoodie uninstall global-share'
      }
    },

    hoodie: {
      start: {
        options: {
          www: 'test/browser',
          callback: function (config) {
            grunt.config.set('connect.options.port', config.stack.www.port);
          }
        }
      }
    },

    env: {
      test: {
        HOODIE_SETUP_PASSWORD: 'testing'
      }
    },

    watch: {
      jshint: {
        files: ['<%= jshint.files %>'],
        tasks: 'jshint'
      },
      unittest: {
        files: 'worker.js',
        tasks: 'test:unit'
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-browser');
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-continue');
  grunt.loadNpmTasks('grunt-hoodie');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-env');

  grunt.registerTask('test:unit', ['simplemocha:unit']);
  grunt.registerTask('test:browser', [
    'env:test',
    'shell:removeData',
    'shell:npmLink',
    'shell:installPlugin',
    'hoodie',
    'continueOn',
    'mocha_browser:all',
    'continueOff',
    'hoodie_stop',
    'shell:npmUnlink',
    'shell:removePlugin'
  ]);

  grunt.registerTask('default', []);
  grunt.registerTask('test', [
    'jshint',
    'test:unit',
    'test:browser'
  ]);

};
