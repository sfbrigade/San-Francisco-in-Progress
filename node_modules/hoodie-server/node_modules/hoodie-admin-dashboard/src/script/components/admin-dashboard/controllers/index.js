'use strict';

var Marionette = require('backbone.marionette');
var Plugins = require('./plugins');
var Dashboard = require('./dashboard');

var Controller = Marionette.Controller.extend({

  initialize: function (options) {
    var admin = app.request('admin');
    this.options = options || {};
    admin.account.authenticate();
  },

  plugins: function (name, action) {
    new Plugins({
      name: name,
      action: action,
      ns: 'plugins'
    });
  },

  dashboard: function () {
    new Dashboard({
      ns: 'dashboard'
    });
  }

});

module.exports = Controller;

