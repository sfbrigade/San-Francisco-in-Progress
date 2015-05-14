'use strict';

var Marionette = require('backbone.marionette');

var tmpl = require('../templates/item.hbs');

require('../../../../helpers/handlebars');

var Row = Marionette.ItemView.extend({
  tagName: 'li',
  template: tmpl
});

var View = Marionette.CollectionView.extend({
  tagName: 'ul',
  className: 'pluginList',
  itemView: Row
});

module.exports = View;

