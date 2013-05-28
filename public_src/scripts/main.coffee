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

  console.log 'socket.io connect to localhost'
  socket = io.connect 'http://localhost'

  socket.on 'ping', (data) ->
    console.log data
    $('#socket_io_msg').text("loading success : #{data.msg}")

    socket.emit('pong', { msg: 'socket.io - pong' })

  $ ->
    console.log 'scripts onload'
)
