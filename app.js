'use strict';

/**
 * Module dependencies.
 */

var express = require('express'),
    http = require('http'),
    path = require('path');

// app global share area
var appShare = require('./lib/app-share');

// app config
var config = require('./lib/config').defaults();
appShare.config = config; // save to share

// parse arguments
var argv = require('optimist')
  .options('c', {
    string: true,
    alias: 'config',
    describe: 'config json'
  })
  .check(function(argv) {
    // update config
    if (argv.c) {
      config = require('./lib/config').read(argv.c);
      appShare.config = config; // save to share
    }
  })
  .argv
;
if (!argv) {
  console.error('Internal error');
  process.exit(1);
}

// setup express
var app = express(),
    routes = require('./routes'),
    user = require('./routes/user');

app.configure(function(){
  app.set('port', process.env.PORT || config.server.port);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);

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

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
