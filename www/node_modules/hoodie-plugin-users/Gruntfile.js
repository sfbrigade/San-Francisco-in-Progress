var path = require('path');


module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    useminPrepare: {
      html: 'app/index.html',
      options: {
        dest: 'admin-dashboard'
      }
    },

    usemin: {
      html: ['admin-dashboard/index.html'],
      css: ['admin-dashboard/styles/**/*.css'],
      options: {
        dirs: ['admin-dashboard']
      }
    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: 'app/images',
          src: '**/*.{png,jpg,jpeg}',
          dest: 'admin-dashboard/images'
        }]
      }
    },

    cssmin: {
      dist: {
        files: {
          'admin-dashboard/styles/app.css': [
            '.tmp/styles/**/*.css',
            'app/styles/**/*.css'
          ]
        }
      }
    },

    htmlmin: {
      dist: {
        options: {
          /*removeCommentsFromCDATA: true,
          // https://github.com/yeoman/grunt-usemin/issues/44
          //collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeAttributeQuotes: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true*/
        },
        files: [{
          expand: true,
          cwd: 'app',
          src: '*.html',
          dest: 'admin-dashboard'
        }]
      }
    },

    uglify: {
      dist: {
        files: {
          'admin-dashboard/scripts/app.js': [
            '.tmp/scripts/**/*.js'
          ]
        }
      }
    },

    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: 'app',
          dest: 'admin-dashboard',
          src: [
            '*.{ico,txt}',
            '.htaccess'
          ]
        }]
      }
    },


    coffee: {
      dist: {
        files: [{
          // rather than compiling multiple files here you should
          // require them into your main .coffee file
          expand: true,
          cwd: 'app/scripts',
          src: '**/*.coffee',
          dest: '.tmp/scripts',
          ext: '.js'
        }]
      },
      test: {
        files: [{
          expand: true,
          cwd: '.tmp/spec',
          src: '*.coffee',
          dest: 'test/spec'
        }]
      }
    },

    compass: {
      options: {
        sassDir: 'app/styles',
        cssDir: '.tmp/styles',
        imagesDir: 'app/images',
        javascriptsDir: 'app/scripts',
        // importPath: 'app/components',
        relativeAssets: true
      },
      dist: {},
      server: {
        options: {
          debugInfo: true
        }
      }
    },

    jshint: {
      files: [
        'Gruntfile.js',
        'hoodie.template.js',
        'index.js',
        'lib/*.js',
        'hooks/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    simplemocha: {
      options: {
        ui: 'tdd',
        trace: true
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
        command: 'rm -rf ' + path.resolve(__dirname, 'data')
      },
      removeEmails: {
        command: 'rm -rf ' + path.resolve(__dirname, 'test/browser/emails')
      },
      npmLink: {
        command: 'npm link && npm link <%= pkg.name %>'
      },
      npmUnlink: {
        command: 'npm unlink && npm unlink <%= pkg.name %>'
      },
      installPlugin: {
        command: 'hoodie install <%= pkg.name.replace("hoodie-plugin-", "") %>'
      },
      removePlugin: {
        command: 'hoodie uninstall <%= pkg.name.replace("hoodie-plugin-", "") %>'
      },
      killHoodie: {
        command: 'pkill -f hoodie-plugin-users'
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
      },
      stop: {

      }
    },

    fakesmtp: {
      test: {
        options: {
          dir: path.resolve(__dirname, 'test/browser/emails'),
          port: 8888
        }
      }
    },

    env: {
      test: {
        HOODIE_SETUP_PASSWORD: 'testing'
      }
    },

    clean: {
      dist: ['.tmp', 'admin-dashboard/*'],
      server: '.tmp'
    },

    handlebars: {
      compile: {
        files: {
          '.tmp/scripts/compiled-templates.js': [
            'app/scripts/templates/**/*.hbs'
          ]
        },
        options: {
          // namespace: 'admin-dashboard.Templates',
          namespace: 'JST',
          processName: function (filename) {
            // funky name processing here
            return filename
              .replace(/^app\/scripts\/templates\//, '')
              .replace(/\.hbs$/, '');
          }
        }
      }
    },

    watch: {
      coffee: {
        files: 'app/scripts/**/*.coffee',
        tasks: ['coffee', 'livereload']
      },
      compass: {
        files: [
          'app/styles/**/*.{scss,sass}'
        ],
        tasks: ['compass', 'livereload']
      },
      livereload: {
        files: [
          'app/*.html',
          '{.tmp,app}/styles/**/*.css',
          '{.tmp,app}/scripts/**/*.js',
          'app/images/**/*.{png,jpg,jpeg,webp}'
        ],
        tasks: ['livereload']
      },
      handlebars: {
        files: [
          'app/scripts/templates/**/*.hbs'
        ],
        tasks: ['handlebars', 'livereload']
      },
      jshint: {
        files: ['<%= jshint.files %>'],
        tasks: 'jshint'
      },
      unittest: {
        files: ['index.js', 'lib/*.js'],
        tasks: 'test:unit'
      }
    }

  });

  // custom tasks
  grunt.loadTasks('./tasks');

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('test:unit', ['simplemocha:unit']);
  grunt.registerTask('test:browser', [
    'env:test',
    'shell:removeData',
    'shell:removeEmails',
    'shell:npmLink',
    'shell:installPlugin',
    'fakesmtp:test',
    'hoodie:start',
    'continueOn',
    'mocha_browser:all',
    'continueOff',
    'hoodie:stop',
    'shell:npmUnlink',
    'shell:removePlugin'
  ]);

  grunt.registerTask('default', []);
  grunt.registerTask('start', [
    'env:test',
    'shell:npmLink',
    'shell:installPlugin',
    'hoodie:start'
  ]);
  grunt.registerTask('stop', [
    'hoodie:stop',
    'shell:npmUnlink',
    'shell:removePlugin',
    'shell:killHoodie'
  ]);
  grunt.registerTask('test', [
    'jshint',
    'test:unit',
    // disabling browser tests because they fail for PhantomJS < 2.0
    // once PhantomJS becomes available for (grunt-)mocha-browser, reanable this
    // 'test:browser'
  ]);

  grunt.registerTask('server', [
    'clean:server',
    'coffee:dist',
    'handlebars',
    'compass:server',
    'livereload-start',
    'connect:livereload',
    'open',
    'watch'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'coffee:dist',
    'handlebars',
    'compass:dist',
    'useminPrepare',
    //'imagemin',
    'htmlmin',
    //'concat:generated',
    //'cssmin:generated',
    //'uglify:generated',
    'concat',
    'copy',
    'usemin'
  ]);

  grunt.registerTask('ci', [
    'test',
    'integration-test'
  ]);
};
