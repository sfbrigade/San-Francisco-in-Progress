/*jshint -W079 */
var app = require('../../helpers/namespace');
var Controller = require('./controllers/index');

require('../structural/layout/index');

app.module('admin-dashboard', function () {

  'use strict';

  this.addInitializer(function (options) {
    this.controller = new Controller(options);
  });

  this.on('before:start', function () {
    var self = this;

    this.listenTo(app.vent, 'app:plugins', function (name, action) {
      self.controller.plugins(name, action);
    });

    this.listenTo(app.vent, 'app:dashboard', function () {
      self.controller.dashboard();
    });

    this.listenTo(app.vent, 'app:user:signout', function () {
      app.request('admin').account.signOut().done(function () {
        app.router.navigate('/', {trigger: true, replace: true});
      });
    });

  });

});

module.exports = app;

