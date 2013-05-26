'use strict';

var _ = require('underscore'),
    $ = require('jquery'),
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
  if (_.isBoolean(confPath)) {
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

// env config
var requireEnvConfig = function(env) {
  var resConf = {};

  if (!env) {
    return resConf;
  }

  var envConfigPath = path.resolve('config-' + env + '.json');
  if (fs.existsSync(envConfigPath)) {
    resConf = require(envConfigPath);
  }

  return resConf;
};

var defaults = function(env) {
  var envConf = {};
  if (env) {
    envConf = requireEnvConfig(env);
  }

  return $.extend(true, {}, DEFAULT_CONF, envConf); // deep copy
};

var read = function(confPath, env) {
  var readConf = {};

  if (confPath.forEach) {
    confPath.forEach(function(i) {
      readConf = $.extend(readConf, requireConfig(i));
    });
  } else {
    readConf = requireConfig(confPath);
  }

  return $.extend(true, defaults(env), readConf);
};

module.exports = {
  defaults: defaults,
  read: read
};

