# require.js config
require.config(
  paths:
    jquery: '../bower_components/jquery/jquery.min'
    socketio: '../bower_components/socket.io-client/dist/socket.io.min'
    bootstrap: '../bower_components/sass-bootstrap/docs/assets/js/bootstrap.min'
  shim:
    bootstrap:
      deps: ['jquery']
      exports: 'jquery'
)

require(['jquery', 'socketio', 'bootstrap'], ($, io) ->
  'use strict'

  $ ->
    $('#ping').attr 'disabled', 'disabled'
    $('.pong-unit').hide()

    setTimeout ->
      socket = io.connect 'http://localhost'

      socket.on 'pong', (data) ->
        $('.pong-unit #msg').text "#{data.msg}"
        $('.pong-unit #time').text "#{data.time}"
        $('.pong-unit').show 'fast'

      $('#ping').click () ->
        if socket
          socket.emit 'ping',
            msg: 'ping'
            name: $("#name").val()

      .removeAttr 'disabled'
      $('#wait_msg').hide 'fast'
    , 2000
)
