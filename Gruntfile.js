'use strict';

// Live Reload
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function(connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function(grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // configurable paths
  var pathConfig = {
    app: 'app',
    dist: 'dist'
  };

  // init config
  grunt.initConfig({
    path: pathConfig,

    // grunt-contrib-watch
    watch: {
      options: {
        nospawn: true
      },

      coffee: {
        files: ['<%= path.app %>/scripts/{,*/}*.coffee'],
        tasks: ['coffee:dist']
      },

      coffeeTest: {
        files: ['test/spec/{,*/}*.coffee'],
        tasks: ['coffee:test']
      },

      compass: {
        files: ['<%= path.app %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['compass:server']
      },

      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },

        files: [
          '<%= path.app %>/*.html',
          '{.tmp,<%= path.app %>}/styles/{,*/}*.css',
          '{.tmp,<%= path.app %>}/scripts/{,*/}*.js',
          '<%= path.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // grunt-contrib-connect
    connect: {
      options: {
        port: 9000,
        hostname: 'localhost'
        // '0.0.0.0' allow from outside
        // 'localhost' allow from self only
      },

      livereload: {
        options: {
          middleware: function(connect) {
            return [
              mountFolder(connect, '.tmp'),
              mountFolder(connect, pathConfig.app),
              lrSnippet
            ];
          }
        }
      },

      test: {
        options: {
          middleware: function(connect) {
            return [
              mountFolder(connect, '.tmp'),
              mountFolder(connect, 'test')
            ];
          }
        }
      },

      dist: {
        options: {
          middleware: function(connect) {
            return [
              mountFolder(connect, pathConfig.dist)
            ];
          }
        }
      }
    },

    // grunt-open
    open: {
      server: {
        path: 'http://localhost:<%= connect.options.port %>'
      }
    },

    // grunt-contrib-clean
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= path.dist %>/*',
            '!<%= path.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },

    // grunt-contrib-jshint
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        '<%= path.app %>/scripts/{,*/}*.js',
        '!<%= path.app %>/scripts/vendor/*',
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
      dist: {
        files: [{
          expand: true,
          cwd: '<%= path.app %>/scripts',
          src: '{,*/}*.coffee',
          dest: '.tmp/scripts',
          ext: '.js'
        }]
      },
      test: {
        files: [{
          expand: true,
          cwd: 'test/spec',
          src: '{,*/}*.coffee',
          dest: '.tmp/spec',
          ext: '.js'
        }]
      }
    },

    // grunt-contrib-compass
    compass: {
      options: {
        sassDir: '<%= path.app %>/styles',
        cssDir: '.tmp/styles',
        generatedImagesDir: '.tmp/images/generated',
        imagesDir: '<%= path.app %>/images',
        javascriptsDir: '<%= path.app %>/scripts',
        fontsDir: '<%= path.app %>/styles/fonts',
        importPath: '<%= path.app %>/bower_components',
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
          baseUrl: '<%= path.app %>/scripts',
          optimize: 'none',
          preserveLicenseComments: false,
          useStrict: true,
          wrap: true
        }
      }
    },

    // grunt-rev
    rev: {
      dist: {
        files: {
          src: [
            '<%= path.dist %>/scripts/{,*/}*.js',
            '<%= path.dist %>/styles/{,*/}*.css',
            '<%= path.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}',
            '<%= path.dist %>/styles/fonts/*'
          ]
        }
      }
    },

    // grunt-usemin
    useminPrepare: {
      options: {
        dest: '<%= path.dist %>'
      },
      html: '<%= path.app %>/index.html'
    },
    usemin: {
      options: {
        dirs: ['<%= path.dist %>']
      },
      html: ['<%= path.dist %>/{,*/}*.html'],
      css: ['<%= path.dist %>/styles/{,*/}*.css']
    },

    // grunt-contrib-imagemin
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= path.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg}',
          dest: '<%= path.dist %>/images'
        }]
      }
    },

    // grunt-svgmin
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= path.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= path.dist %>/images'
        }]
      }
    },

    // grunt-contrib-cssmin
    cssmin: {
      dist: {
        files: {
          '<%= path.dist %>/styles/main.css': [
            '.tmp/styles/{,*/}*.css',
            '<%= path.app %>/styles/{,*/}*.css'
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
          cwd: '<%= path.app %>',
          src: '*.html',
          dest: '<%= path.dist %>'
        }]
      }
    },

    // grunt-contrib-copy
    copy: {
      dist: {
        files: [{
          extend: true,
          dot: true,
          cwd: '<%= path.app %>',
          dest: '<%= path.dist %>',
          src: [
            '*.{ico,txt}',
            '.htaccess',
            'images/{,*/}*.{webp,gif}',
            'styles/fonts/*'
          ]
        }, {
          // compass contents
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= path.dist %>/images',
          src: [
            'generated/*'
          ]
        }]
      }
    },

    // grunt-concurrent
    concurrent: {
      server: [
        'coffee:dist',
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
        rjsConfig: '<%= path.app %>/scripts/main.js'
      }
    }
  });

  // register task
  grunt.registerTask('server', function(target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'concurrent:server',
      'connect:livereload',
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
    'useminPrepare',
    'concurrent:dist',
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

