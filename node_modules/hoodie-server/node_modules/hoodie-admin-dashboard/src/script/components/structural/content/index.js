/*jshint -W079 */
var Controller = require('./controllers/index');
var app = require('../../../helpers/namespace');

app.module('admin-dashboard.content', function () {

  'use strict';

  this.addInitializer(function (options) {

    options.app.components.sidebar.template = require('./templates/index.hbs');

    this._controller = new Controller(
      options.app.components.sidebar
    );

  });

  this.on('before:start', function () {
    app.rm.addRegions({
      content: '[data-component=content]',
      contentHeader: '[data-component=contentHeader]',
      contentMain: '[data-component=contentMain]',
      contentFooter: '[data-component=contentFooter]'
    });
  });

});

module.exports = app;

