'use strict';

var Controller = require('./controllers/index');

app.module('admin-dashboard.login', function () {

  this.addInitializer(function (options) {
    new Controller(options);
  });

});

module.exports = app;

