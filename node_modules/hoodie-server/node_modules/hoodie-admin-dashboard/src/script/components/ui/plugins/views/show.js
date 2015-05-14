'use strict';

var Marionette = require('backbone.marionette');
var _ = require('underscore');

require('../../../../helpers/handlebars');

var tmpl = require('../templates/show.hbs');


var View = Marionette.ItemView.extend({
  template: tmpl,
  initialize: function (options) {
    this.options = options || {};
    _.bindAll(this, 'injectHoodieAdmin');
  },
  ui: {
    iframe: 'iframe'
  },
  serializeData: function () {
    var attributes = this.model.toJSON();

    attributes.path = Backbone.history.fragment.replace(this.currentPath(), '');
    return attributes;
  },
  onRender: function () {
    this.ui.iframe.on('load', this.injectHoodieAdmin);
  },
  injectHoodieAdmin: function () {
    var view = this;
    var win = this.ui.iframe[0].contentWindow;
    win.require = require;
    win.hoodieAdmin = app.request('admin');

    win.addEventListener('hashchange', function () {
      var pluginPath = this.location.hash.replace(/#\/?/, '');

      app.router.navigate(view.currentPath() + '/' + pluginPath);
    });
  },
  currentPath: function () {
    return 'plugin/' + this.model.get('name');
  }
});

module.exports = View;
