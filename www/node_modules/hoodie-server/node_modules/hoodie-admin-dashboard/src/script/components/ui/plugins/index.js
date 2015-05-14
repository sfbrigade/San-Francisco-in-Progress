'use strict';

var app = require('../../../helpers/namespace');
var Controller = require('./controllers/index');

app.module('admin-dashboard.plugins', function () {

  this.addInitializer(function (options) {
    this.controller = new Controller(options);
  });

  this.on('before:start', function () {
    var self = this;

    app.vent.on('app:plugins:show', function (options) {
      self.controller.show(options);
    });
  });

});

module.exports = app;
