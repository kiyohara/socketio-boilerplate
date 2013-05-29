'use strict';

/**
 * Module dependencies.
 */

var config = require('config'),
    _ = require('underscore'),
    express = require('express'),
    http = require('http'),
    fs = require('fs'),
    path = require('path');

// path
var routesDir   = path.resolve(__dirname, config.express.routes),
    viewsDir    = path.resolve(__dirname, config.express.views),
    includesDir = path.resolve(__dirname, config.express.includes),
    staticsDir  = [];
_.flatten([config.express.statics]).forEach(function(_path) {
  staticsDir.push(path.resolve(__dirname, _path));
});

// setup express
var app = express(),
    routes = require(routesDir),
    user = require(path.join(routesDir, 'user'));

app.configure(function(){
  app.set('port', process.env.PORT || config.server.port);
  app.set('views', viewsDir);
  app.set('view engine', 'jade');

  app.locals.basedir = includesDir;

  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());

  staticsDir.forEach(function(_dir) {
    app.use(express.static(_dir));
  });
});

app.configure('development', function(){
  app.use(express.errorHandler());

  // livereload script middleware
  app.use(require('connect-livereload')({
    port: config.livereload.port,
    excludeList: config.livereload.excludeList
  }));

  // hook livereload (cf. Gruntfile.js watch)
  var hookPath = path.resolve(config.hooks.dir, config.hooks.livereload);
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
io.configure('production', function(){
  io.set('log level', 1);
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
