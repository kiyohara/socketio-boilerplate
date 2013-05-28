'use strict';

var path = require('path');

// config
var conf = require('config');

// server port
var SERVER_PORT = conf.server.port || 3000;

// Live Reload
var LIVERELOAD_PORT = conf.livereload.port || 35729;
var mountFolder = function(connect, dir) {
  return connect.static(path.resolve(dir));
};

module.exports = function(grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // configurable paths
  var pathConfig = conf.build.path;

  // init config
  grunt.initConfig({
    path: pathConfig,

    // grunt-contrib-watch
    watch: {
      options: {
        nospawn: false
      },

      coffee: {
        files: ['<%= path.public.src %>/scripts/{,*/}*.coffee'],
        tasks: ['coffee:server']
      },

      coffeeTest: {
        files: ['test/spec/{,*/}*.coffee'],
        tasks: ['coffee:test']
      },

      compass: {
        files: ['<%= path.public.src %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['compass:server']
      },

      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },

        files: [
          // static/preprocessed files
          '<%= path.public.src %>/*.html',
          '{<%= path.public.tmp %>,<%= path.public.src %>}/styles/{,*/}*.css',
          '{<%= path.public.tmp %>,<%= path.public.src %>}/scripts/{,*/}*.js',
          '<%= path.public.src %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',

          // express files (js monitored by grunt-express)
          '<%= path.views %>/{,*/}*.jade',

          // other hooks
          '<%= path.hooks %>/livereload'
        ]
      }
    },

    // grunt-contrib-connect
    connect: {
      test: {
        options: {
          middleware: function(connect) {
            return [
              mountFolder(connect, pathConfig.public.tmp),
              mountFolder(connect, 'test')
            ];
          }
        }
      }
    },

    // grunt-express
    express: {
      options: {
        port: SERVER_PORT,
        server: path.resolve('./app')
      },
      livereload: {
        options: {
          monitor: {
            env: { 'NODE_ENV': 'livereload' }
          },
          debug: true
        }
      },
      dist: {
        options: {
        }
      }
    },

    // grunt-open
    open: {
      server: {
        path: 'http://localhost:' + SERVER_PORT
      }
    },

    // grunt-contrib-clean
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '<%= path.public.tmp %>',
            '<%= path.public.dist %>/*',
            '!<%= path.public.dist %>/.git*'
          ]
        }]
      },
      server: pathConfig.public.tmp
    },

    // grunt-contrib-jshint
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        '<%= path.public.src %>/scripts/{,*/}*.js',
        '!<%= path.public.src %>/scripts/vendor/*',
        'test/spec/{,*/}*.js'
      ]
    },

    // grunt-mocha
    mocha: {
      all: {
        options: {
          run: true,
          urls: ['http://localhost:<%= connect.options.port %>/index.html']
        }
      }
    },

    // grunt-contrib-coffee
    coffee: {
      server: {
        options: {
          sourceMap: true
        },
        files: [{
          expand: true,
          cwd: '<%= path.public.src %>/scripts',
          src: '{,*/}*.coffee',
          dest: '<%= path.public.tmp %>/scripts',
          ext: '.js'
        }]
      },
      test: {
        files: [{
          expand: true,
          cwd: 'test/spec',
          src: '{,*/}*.coffee',
          dest: '<%= path.public.tmp %>/spec',
          ext: '.js'
        }]
      }
    },

    // grunt-contrib-compass
    compass: {
      options: {
        sassDir: '<%= path.public.src %>/styles',
        cssDir: '<%= path.public.tmp %>/styles',
        generatedImagesDir: '<%= path.public.tmp %>/images/generated',
        imagesDir: '<%= path.public.src %>/images',
        javascriptsDir: '<%= path.public.src %>/scripts',
        fontsDir: '<%= path.public.src %>/styles/fonts',
        importPath: '<%= path.public.src %>/bower_components',
        httpImagesPath: '/images',
        httpGeneratedImagesPath: '/images/generated',
        relativeAssets: false
      },
      dist: {},
      server: {
        options: {
          debugInfo: true
        }
      }
    },

    // grunt-contrib-concat
    concat: {
      dist: {}
    },

    // grunt-contrib-requirejs
    requirejs: {
      dist: {
        options: {
          baseUrl: '<%= path.public.tmp %>/scripts',
          optimize: 'none',
          preserveLicenseComments: false,
          useStrict: true,
          wrap: false // for socket.io-client
        }
      }
    },

    // grunt-rev
    rev: {
      dist: {
        files: {
          src: [
            '<%= path.public.dist %>/scripts/{,*/}*.js',
            '<%= path.public.dist %>/styles/{,*/}*.css',
            '<%= path.public.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}',
            '<%= path.public.dist %>/styles/fonts/*'
          ]
        }
      }
    },

    // grunt-usemin
    useminPrepare: {
      options: {
        dest: '<%= path.public.dist %>'
      },
      html: '<%= path.public.tmp %>/*.html'
    },
    usemin: {
      options: {
        dirs: ['<%= path.public.dist %>']
      },
      html: ['<%= path.public.dist %>/{,*/}*.html'],
      css: ['<%= path.public.dist %>/styles/{,*/}*.css']
    },

    // grunt-contrib-imagemin
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= path.public.src %>/images',
          src: '{,*/}*.{png,jpg,jpeg}',
          dest: '<%= path.public.dist %>/images'
        }]
      }
    },

    // grunt-svgmin
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= path.public.src %>/images',
          src: '{,*/}*.svg',
          dest: '<%= path.public.dist %>/images'
        }]
      }
    },

    // grunt-contrib-cssmin
    cssmin: {
      dist: {
        files: {
          '<%= path.public.dist %>/styles/main.css': [
            '<%= path.public.tmp %>/styles/{,*/}*.css',
            '<%= path.public.src %>/styles/{,*/}*.css'
          ]
        }
      }
    },

    // grunt-contrib-htmlmin
    htmlmin: {
      dist: {
        options: {
        },
        files: [{
          expand: true,
          cwd: '<%= path.public.src %>',
          src: '*.html',
          dest: '<%= path.public.dist %>'
        }]
      }
    },

    // grunt-contrib-copy
    copy: {
      useminPrepare: {
        files: [{
          expand: true,
          cwd: '<%= path.public.src %>',
          dest: '<%= path.public.tmp %>',
          src: [
            '**/*.{html,js,css}'
          ]
        }]
      },
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= path.public.src %>',
          dest: '<%= path.public.dist %>',
          src: [
            '*.{ico,txt}',
            '.htaccess',
            'images/{,*/}*.{webp,gif}',
            'styles/fonts/*'
          ]
        }, {
          // compass contents
          expand: true,
          cwd: '<%= path.public.tmp %>/images',
          dest: '<%= path.public.dist %>/images',
          src: [
            'generated/*'
          ]
        }]
      }
    },

    // grunt-concurrent
    concurrent: {
      server: [
        'coffee:server',
        'compass:server'
      ],
      test: [
        'coffee',
        'compass'
      ],
      dist: [
        'coffee',
        'compass:dist',
        'imagemin',
        'svgmin',
        'htmlmin'
      ]
    },

    // grunt-bower-requirejs
    bower: {
      options: {
        exclude: ['modernizr']
      },
      all: {
        rjsConfig: '<%= path.public.src %>/scripts/main.js'
      }
    }
  });

  // register task
  grunt.registerTask('server', function(target) {
    if (target === 'dist') {
      return grunt.task.run([
        'build',
        'express:dist',
        'open',
        'express-keepalive'
      ]);
    }

    grunt.task.run([
      'clean:server',
      'concurrent:server',
      'express:livereload',
      'open',
      'watch'
    ]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'connect:test',
    'mocha'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'concurrent:dist',
    'copy:useminPrepare',
    'useminPrepare',
    'requirejs',
    'cssmin',
    'concat',
    'uglify',
    'copy',
    'rev',
    'usemin'
  ]);

  // register task - default
  grunt.registerTask('default', [
    'jshint',
    'test',
    'build'
  ]);
};

