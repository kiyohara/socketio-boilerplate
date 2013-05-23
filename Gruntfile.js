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
    pub: {
      src: 'public_src',
      dist: 'public',
      tmp: '.public_tmp'
    }
  };

  // init config
  grunt.initConfig({
    path: pathConfig,

    // grunt-contrib-watch
    watch: {
      options: {
        nospawn: false
      },

      coffee: {
        files: ['<%= path.pub.src %>/scripts/{,*/}*.coffee'],
        tasks: ['coffee:dist']
      },

      coffeeTest: {
        files: ['test/spec/{,*/}*.coffee'],
        tasks: ['coffee:test']
      },

      compass: {
        files: ['<%= path.pub.src %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['compass:server']
      },

      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },

        files: [
          '<%= path.pub.src %>/*.html',
          '{<%= path.pub.tmp %>,<%= path.pub.src %>}/styles/{,*/}*.css',
          '{<%= path.pub.tmp %>,<%= path.pub.src %>}/scripts/{,*/}*.js',
          '<%= path.pub.src %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
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
              mountFolder(connect, pathConfig.pub.tmp),
              mountFolder(connect, pathConfig.pub.src),
              lrSnippet
            ];
          }
        }
      },

      test: {
        options: {
          middleware: function(connect) {
            return [
              mountFolder(connect, pathConfig.pub.tmp),
              mountFolder(connect, 'test')
            ];
          }
        }
      },

      dist: {
        options: {
          middleware: function(connect) {
            return [
              mountFolder(connect, pathConfig.pub.dist)
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
            '<%= path.pub.tmp %>',
            '<%= path.pub.dist %>/*',
            '!<%= path.pub.dist %>/.git*'
          ]
        }]
      },
      server: pathConfig.pub.tmp
    },

    // grunt-contrib-jshint
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        '<%= path.pub.src %>/scripts/{,*/}*.js',
        '!<%= path.pub.src %>/scripts/vendor/*',
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
          cwd: '<%= path.pub.src %>/scripts',
          src: '{,*/}*.coffee',
          dest: '<%= path.pub.tmp %>/scripts',
          ext: '.js'
        }]
      },
      test: {
        files: [{
          expand: true,
          cwd: 'test/spec',
          src: '{,*/}*.coffee',
          dest: '<%= path.pub.tmp %>/spec',
          ext: '.js'
        }]
      }
    },

    // grunt-contrib-compass
    compass: {
      options: {
        sassDir: '<%= path.pub.src %>/styles',
        cssDir: '<%= path.pub.tmp %>/styles',
        generatedImagesDir: '<%= path.pub.tmp %>/images/generated',
        imagesDir: '<%= path.pub.src %>/images',
        javascriptsDir: '<%= path.pub.src %>/scripts',
        fontsDir: '<%= path.pub.src %>/styles/fonts',
        importPath: '<%= path.pub.src %>/bower_components',
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
          baseUrl: '<%= path.pub.src %>/scripts',
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
            '<%= path.pub.dist %>/scripts/{,*/}*.js',
            '<%= path.pub.dist %>/styles/{,*/}*.css',
            '<%= path.pub.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}',
            '<%= path.pub.dist %>/styles/fonts/*'
          ]
        }
      }
    },

    // grunt-usemin
    useminPrepare: {
      options: {
        dest: '<%= path.pub.dist %>'
      },
      html: '<%= path.pub.src %>/index.html'
    },
    usemin: {
      options: {
        dirs: ['<%= path.pub.dist %>']
      },
      html: ['<%= path.pub.dist %>/{,*/}*.html'],
      css: ['<%= path.pub.dist %>/styles/{,*/}*.css']
    },

    // grunt-contrib-imagemin
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= path.pub.src %>/images',
          src: '{,*/}*.{png,jpg,jpeg}',
          dest: '<%= path.pub.dist %>/images'
        }]
      }
    },

    // grunt-svgmin
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= path.pub.src %>/images',
          src: '{,*/}*.svg',
          dest: '<%= path.pub.dist %>/images'
        }]
      }
    },

    // grunt-contrib-cssmin
    cssmin: {
      dist: {
        files: {
          '<%= path.pub.dist %>/styles/main.css': [
            '<%= path.pub.tmp %>/styles/{,*/}*.css',
            '<%= path.pub.src %>/styles/{,*/}*.css'
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
          cwd: '<%= path.pub.src %>',
          src: '*.html',
          dest: '<%= path.pub.dist %>'
        }]
      }
    },

    // grunt-contrib-copy
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= path.pub.src %>',
          dest: '<%= path.pub.dist %>',
          src: [
            '*.{ico,txt}',
            '.htaccess',
            'images/{,*/}*.{webp,gif}',
            'styles/fonts/*'
          ]
        }, {
          // compass contents
          expand: true,
          cwd: '<%= path.pub.tmp %>/images',
          dest: '<%= path.pub.dist %>/images',
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
        rjsConfig: '<%= path.pub.src %>/scripts/main.js'
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

