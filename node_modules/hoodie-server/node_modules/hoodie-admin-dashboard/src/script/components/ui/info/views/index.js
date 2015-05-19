'use strict';

var Marionette = require('backbone.marionette');

require('../../../../helpers/handlebars');

var tmpl = require('../templates/index.hbs');

var View = Marionette.ItemView.extend({
  template: tmpl,
  initialize: function (options) {
    this.options = options || {};
  }
});

module.exports = View;
