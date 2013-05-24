'use strict';

/**
 * Module dependencies.
 */

var _ = require('underscore'),
    express = require('express'),
    http = require('http'),
    fs   = require('fs'),
    path = require('path');

// config file handler
var requireConfig = function(confPath) {
  if (typeof confPath === 'boolean') {
    throw('Config path required');
  }

  var _path = path.resolve(confPath);
  if (!fs.existsSync(_path)) {
    throw('No such config : ' + confPath);
  } else {
    return require(_path);
  }
};

// parse arguments
var config = {};
var argv = require('optimist')
  .options('c', {
    string: true,
    alias: 'config',
    describe: 'config json'
  })
  .check(function(argv) {
    // config
    var _config;
    if (argv.c) {
      var confPath = argv.c;

      if (confPath.forEach) {
        confPath.each(function(i) {
          _config = requireConfig(i);
          config = _.extend(_config, config);
        });
      } else {
        config = requireConfig(confPath);
      }
    }
  })
  .argv
;
if (!argv) {
  console.error('Internal error');
  process.exit(1);
}

// update config w/ defaults
var configDefault = require(__dirname + '/config.json');
config = _.extend(configDefault, config);

// setup express
var app = express(),
    config = require('./lib/config').set(config),
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

  var pub = config.get().server.path.public || 'public';
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
