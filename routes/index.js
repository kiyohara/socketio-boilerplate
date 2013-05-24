'use strict';

/*
 * GET home page.
 */
var config = require('../lib/app-share').config;

exports.index = function(req, res){
  res.render('index', { basedir: config.server.path.include, title: 'Express' });
};
