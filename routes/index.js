'use strict';

/*
 * GET home page.
 */
var config = require('../lib/config');

exports.index = function(req, res){
  res.render('index', { basedir: config.get().server.path.include, title: 'Express' });
};
