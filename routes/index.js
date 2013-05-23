'use strict';

/*
 * GET home page.
 */

var config,
    include;
exports.config = function(_config) {
  config = _config;
  include = config.server.path.include;
  return this;
};

exports.index = function(req, res){
  res.render('index', { basedir: include, title: 'Express' });
};
