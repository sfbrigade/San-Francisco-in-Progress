'use strict';

var Marionette = require('backbone.marionette');
var $ = require('jquery');
var regexIsRelativePath = /^\/[^\/]/;
var regexHasExtension = /\.\w+$/;
var regexIsQueryPath = /^\?/;
var AppView = Marionette.ItemView.extend({
  initialize: function (/*options*/) {
  },

  events: {
    'click a, [data-href]': 'handleClickOnLink'
  },

  // events
  handleClickOnLink: function (event) {
    var $target = $(event.currentTarget);
    var path = $target.attr('href') || $target.data('href');

    if (regexIsRelativePath.test(path) && !regexHasExtension.test(path)) {
      event.preventDefault();
      app.router.navigate(path.substr(1), true);
    }
    if (regexIsQueryPath.test(path)) {
      event.preventDefault();
      app.router.navigate(Backbone.history.fragment + path, true);
    }
  }
});

module.exports = AppView;
