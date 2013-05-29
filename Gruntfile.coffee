'use strict'

path = require 'path'

# config
conf = require 'config'

# server port
SERVER_PORT = conf.server.port || 3000

# Live Reload
LIVERELOAD_PORT = conf.livereload.port || 35729
mountFolder = (connect, dir) ->
  connect.static path.resolve dir

module.exports = (grunt) ->
  # load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks)

  # init config
  grunt.initConfig(
    conf: conf

    # grunt-contrib-watch
    watch:
      options:
        nospawn: false

      gruntfile:
        files: ['Gruntfile.coffee']
        tasks: ['coffeelint:gruntfile']

      coffee:
        files: ["#{conf.statics.src}/scripts/{,*/}*.coffee"]
        tasks: ['coffeelint:server', 'coffee:server']

      coffeeTest:
        files: ['test/spec/{,*/}*.coffee']
        tasks: ['coffee:test']

      compass:
        files: ["#{conf.statics.src}/styles/{,*/}*.{scss,sass}"]
        tasks: ['compass:server']

      livereload:
        options:
          livereload: LIVERELOAD_PORT

        files: [
          # static/preprocessed files
          "#{conf.statics.src}/*.html"
          "{#{conf.statics.tmp},#{conf.statics.src}}/styles/{,*/}*.css"
          "{#{conf.statics.tmp},#{conf.statics.src}}/scripts/{,*/}*.js"
          "#{conf.statics.src}/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}"

          # express files (js monitored by grunt-express)
          "#{conf.express.views}/{,*/}*.jade"

          # other hooks
          "#{conf.hooks.dir}/#{conf.hooks.livereload}"
        ]

    # grunt-contrib-connect
    connect:
      options:
        port: SERVER_PORT
        hostname: 'localhost'

      test:
        options:
          middleware: (connect) ->
            return [
              mountFolder(connect, conf.statics.tmp)
              mountFolder(connect, 'test')
            ]

    # grunt-express
    express:
      options:
        port: SERVER_PORT
        server: path.resolve conf.express.app

      livereload:
        options:
          monitor:
            env:
              NODE_ENV: 'livereload'

          debug: true

      dist:
        options: {}

    # grunt-open
    open:
      server:
        path: "http://localhost:#{SERVER_PORT}"

    # grunt-contrib-clean
    clean:
      dist:
        files: [
          dot: true
          src: [
            "#{conf.statics.tmp}"
            "#{conf.statics.dist}/*"
            "!#{conf.statics.dist}/.git*"
          ]
        ]
      server: conf.statics.tmp

    # grunt-contrib-jshint
    jshint:
      options:
        jshintrc: '.jshintrc'

      all: [
        "#{conf.statics.src}/scripts/{,*/}*.js"
        "!#{conf.statics.src}/scripts/vendor/*"
        'test/spec/{,*/}*.js'
      ]

    # grunt-coffeelint
    coffeelint:
      gruntfile:
        files:
          src: ['Gruntfile.coffee']

      server:
        files:
          src: ["#{conf.statics.src}/scripts/{,*/}*.coffee"]

    # grunt-mocha
    mocha:
      all:
        options:
          run: true
          urls: ["http://localhost:#{SERVER_PORT}/index.html"]

    # grunt-contrib-coffee
    coffee:
      server:
        options:
          sourceMap: true

        files: [
          expand: true
          cwd: "#{conf.statics.src}/scripts"
          src: '{,*/}*.coffee'
          dest: "#{conf.statics.tmp}/scripts"
          ext: '.js'
        ]
      test:
        files: [
          expand: true
          cwd: 'test/spec'
          src: '{,*/}*.coffee'
          dest: "#{conf.statics.tmp}/spec"
          ext: '.js'
        ]

    # grunt-contrib-compass
    compass:
      options:
        sassDir: "#{conf.statics.src}/styles"
        cssDir: "#{conf.statics.tmp}/styles"
        generatedImagesDir: "#{conf.statics.tmp}/images/generated"
        imagesDir: "#{conf.statics.src}/images"
        javascriptsDir: "#{conf.statics.src}/scripts"
        fontsDir: "#{conf.statics.src}/styles/fonts"
        importPath: "#{conf.statics.src}/bower_components"
        httpImagesPath: '/images'
        httpGeneratedImagesPath: '/images/generated'
        relativeAssets: false

      dist: {}

      server:
        options:
          debugInfo: true

    # grunt-contrib-concat
    concat:
      dist: {}

    # grunt-contrib-requirejs
    requirejs:
      dist:
        options:
          baseUrl: "#{conf.statics.tmp}/scripts"
          optimize: 'none'
          preserveLicenseComments: false
          useStrict: true
          wrap: false # for socket.io-client

    # grunt-rev
    rev:
      dist:
        files:
          src: [
            "#{conf.statics.dist}/scripts/{,*/}*.js"
            "#{conf.statics.dist}/styles/{,*/}*.css"
            "#{conf.statics.dist}/images/{,*/}*.{png,jpg,jpeg,gif,webp}"
            "#{conf.statics.dist}/styles/fonts/*"
          ]

    # grunt-usemin
    useminPrepare:
      options:
        dest: "#{conf.statics.dist}"
      html: "#{conf.statics.tmp}/*.html"

    usemin:
      options:
        dirs: ["#{conf.statics.dist}"]
      html: ["#{conf.statics.dist}/{,*/}*.html"],
      css: ["#{conf.statics.dist}/styles/{,*/}*.css"]

    # grunt-contrib-imagemin
    imagemin:
      dist:
        files: [
          expand: true
          cwd: "#{conf.statics.src}/images"
          src: '{,*/}*.{png,jpg,jpeg}'
          dest: "#{conf.statics.dist}/images"
        ]

    # grunt-svgmin
    svgmin:
      dist:
        files: [
          expand: true
          cwd: "#{conf.statics.src}/images"
          src: '{,*/}*.svg'
          dest: "#{conf.statics.dist}/images"
        ]

    # grunt-contrib-cssmin
    cssmin:
      dist:
        files:
          '<%= conf.statics.dist %>/styles/main.css': [
            "#{conf.statics.tmp}/styles/{,*/}*.css"
            "#{conf.statics.src}/styles/{,*/}*.css"
          ]

    # grunt-contrib-htmlmin
    htmlmin:
      dist:
        options: {}

        files: [
          expand: true
          cwd: "#{conf.statics.src}"
          src: '*.html'
          dest: "#{conf.statics.dist}"
        ]

    # grunt-contrib-copy
    copy:
      useminPrepare:
        files: [
          expand: true
          cwd: "#{conf.statics.src}"
          dest: "#{conf.statics.tmp}"
          src: ['**/*.{html,js,css}']
        ]
      dist:
        files: [
          expand: true
          dot: true
          cwd: "#{conf.statics.src}"
          dest: "#{conf.statics.dist}"
          src: [
            '*.{ico,txt}'
            '.htaccess'
            'images/{,*/}*.{webp,gif}'
            'styles/fonts/*'
          ]
        ,
          # compass contents
          expand: true
          cwd: "#{conf.statics.tmp}/images"
          dest: "#{conf.statics.dist}/images"
          src: [
            'generated/*'
          ]
        ]

    # grunt-concurrent
    concurrent:
      server: [
        'coffee:server'
        'compass:server'
      ]
      test: [
        'coffee'
        'compass'
      ]
      dist: [
        'coffee'
        'compass:dist'
        'imagemin'
        'svgmin'
        'htmlmin'
      ]

    # grunt-bower-requirejs
    bower:
      options:
        exclude: ['modernizr']
      all:
        rjsConfig: "#{conf.statics.src}/scripts/main.js"
  )

  # register task
  grunt.registerTask('server', (target) ->
    if (target is 'dist')
      return grunt.task.run [
        'build',
        'express:dist',
        'open',
        'express-keepalive'
      ]

    grunt.task.run [
      'clean:server'
      'concurrent:server'
      'express:livereload'
      'open'
      'watch'
    ]
  )

  grunt.registerTask 'test', [
    'clean:server',
    'concurrent:test',
    'connect:test',
    'mocha'
  ]

  grunt.registerTask 'build', [
    'clean:dist'
    'concurrent:dist'
    'copy:useminPrepare'
    'useminPrepare'
    'requirejs'
    'cssmin'
    'concat'
    'uglify'
    'copy'
    'rev'
    'usemin'
  ]

  # register task - default
  grunt.registerTask 'default', [
    'jshint'
    'coffeelint'
    'test'
    'build'
  ]

