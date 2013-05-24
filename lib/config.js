'use strict';

var _ = require('underscore'),
    fs = require('fs'),
    path = require('path');

// defaults
var DEFAULT_CONF_PATH = path.resolve('config.json');

var DEFAULT_CONF = {};
if (fs.existsSync(DEFAULT_CONF_PATH)) {
  DEFAULT_CONF = require(DEFAULT_CONF_PATH);
}

// config file handler
var requireConfig = function(confPath) {
  if (typeof confPath === 'boolean') {
    // for optimist
    throw('Config path required');
  }

  var _path = path.resolve(confPath);
  if (!fs.existsSync(_path)) {
    throw('No such config : ' + confPath);
  } else {
    return require(_path);
  }
};

var read = function(confPath) {
  var res = {};

  if (confPath.forEach) {
    var conf;
    confPath.each(function(i) {
      conf = requireConfig(i);
      res = _.extend(conf, res);
    });
  } else {
    res = requireConfig(confPath);
  }

  // update config w/ defaults
  res = _.extend(DEFAULT_CONF, res);

  return res;
};

module.exports = {
  read: read,
  defaults: function(){ return _.clone(DEFAULT_CONF); }
};

