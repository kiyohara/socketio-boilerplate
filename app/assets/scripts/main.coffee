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
    setTimeout ->
      socket = io.connect 'http://localhost'

      socket.on 'ping', (data) ->
        $('#socket_io_msg')
          .removeClass('text-info')
          .addClass('text-success')
          .text("connected : #{data.msg}")

        socket.emit('pong', { msg: 'socket.io - pong' })
    , 3000
)
