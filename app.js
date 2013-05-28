'use strict';

/**
 * Module dependencies.
 */

var config = require('config'),
    express = require('express'),
    http = require('http'),
    fs = require('fs'),
    path = require('path');

// setup express
var app = express(),
    routes = require('./routes'),
    user = require('./routes/user');

app.configure(function(){
  app.set('port', process.env.PORT || config.server.port);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.locals.basedir = config.server.path.includes;

  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());

  var pub = config.server.path.public || 'public';
  console.log('Mount static dir : ' + pub);
  if (pub.forEach) {
    pub.forEach(function(dir) {
      app.use(express.static(path.join(__dirname, dir)));
    });
  } else {
    app.use(express.static(path.join(__dirname, pub)));
  }
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// livereload
app.configure('livereload', function() {
  // livereload script middleware
  app.use(require('connect-livereload')({
    port: config.livereload.port,
    excludeList: config.livereload.excludeList
  }));

  // hook livereload (cf. Gruntfile.js watch)
  var hookPath = path.resolve(path.join(config.build.path.hooks, 'livereload'));
  fs.exists(hookPath, function(exists) {
    if (exists) { fs.writeFile(hookPath, ''); }
  });
});

app.use(app.router);
app.get('/', routes.index);
app.get('/users', user.list);


// http server w/ socket.io
var server = http.createServer(app);
var io = require('socket.io').listen(server);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// socket.io configuration
io.configure(function(){
  io.set('log level', 2);
});

io.configure('development', function() {
  io.set('log level', 3);
});

// socket.io handling
io.sockets.on('connection', function(socket) {
  console.log('!! socket.io connected !!');

  socket.on('pong', function(data) {
    console.log('pong : ' + data.msg);
  });

  socket.emit('ping', { msg: 'Hello socket.io !!' });
});

// module exports for grunt-express
server.use = function() {
  app.use.apply(app, arguments);
};
module.exports = server;
