// require.js config
require.config({
  paths: {
    jquery: '../bower_components/jquery/jquery.min',
    bootstrap: '../bower_components/sass-bootstrap/docs/assets/js/bootstrap.min'
  },
  shim: {
    bootstrap: {
      deps: ['jquery'],
      exports: 'jquery'
    }
  }
});

require(['jquery', 'bootstrap'], function($) {
  'use strict';

  $(function(){
    console.log('scripts onload');
  });
});
