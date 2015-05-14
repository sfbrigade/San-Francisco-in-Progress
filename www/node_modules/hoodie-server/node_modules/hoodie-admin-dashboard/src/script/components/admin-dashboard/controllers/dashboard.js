'use strict';

var Marionette = require('backbone.marionette');
var $ = Marionette.$;

var Collection = require('../collections/plugins');
var Model = require('../models/plugin');

var controller = Marionette.Controller.extend({

  initialize: function (options) {
    var self = this;

    this.options = options || {};

    this.model = new Model();
    this.collection = new Collection();

    $.when(this.collection.fetch()).done(function () {

      self.list();

    }).fail(function () {
      throw new Error('failed to fetch plugins');
    });

  },

  list: function (collection) {
    app.vent.trigger('app:plugins:list', {
      collection: collection
    });
  }

});

module.exports = controller;

