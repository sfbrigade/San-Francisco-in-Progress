/*jshint -W079 */
var Controller = require('./controllers/index');
var app = require('../../../helpers/namespace');


app.module('admin-dashboard.sidebar', function () {

  'use strict';

  this.addInitializer(function (options) {
    options.app.components.sidebar.template = require('./templates/index.hbs');

    this._controller = new Controller(
      options.app.components.sidebar
    );

  });

  this.on('before:start', function () {

    app.rm.addRegions({
      sidebar: '[data-component=sidebar]',
      sidebarLogo: '[data-component=sidebarLogo]',
      sidebarNav: '[data-component=sidebarNav]',
      sidebarFooter: '[data-component=sidebarFooter]',
    });

  });

});

module.exports = app;
