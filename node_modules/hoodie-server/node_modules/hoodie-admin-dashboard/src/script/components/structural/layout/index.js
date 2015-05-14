/*jshint -W079 */
var LayoutController = require('./controllers/index');
var app = require('../../../helpers/namespace');

app.module('admin-dashboard.layout', function () {
  'use strict';

  this.addInitializer(function (options) {
    var layoutController;
    var admin = app.request('admin');

    options.app.components.layout.template = require('./templates/index.hbs');
    layoutController = new LayoutController(options.app.components.layout);

    admin.account.on('signout', layoutController.showLogin);
    admin.account.on('unauthenticated', layoutController.showLogin);
    admin.account.on('signin', layoutController.showApp);
    app.vent.on('app:plugins', layoutController.showApp);
  });

});
module.exports = app;

