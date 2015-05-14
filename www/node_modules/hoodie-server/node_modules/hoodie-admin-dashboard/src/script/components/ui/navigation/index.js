'use strict';

var app = require('../../../helpers/namespace');
var Controller = require('./controllers/index');

app.module('admin-dashboard.navigation', function () {

  this.addInitializer(function (options) {
    this.controller = new Controller(options);
  });

  this.on('before:start', function () {

    app.vent.on('app:nav:show', function (options) {
      this.controller.show(options);
    }, this);

  });

});

module.exports = app;
