'use strict';

var app = require('../../../helpers/namespace');
var Controller = require('./controllers/index');

app.module('minutes.welcome', function () {
  this.addInitializer(function (options) {
    new Controller(options);
  });
});

module.exports = app;
