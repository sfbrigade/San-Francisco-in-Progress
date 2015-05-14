'use strict';

var app = require('../../../../helpers/namespace');
var Marionette = require('backbone.marionette');

var ShowView = require('../views/show');
var Controller = Marionette.Controller.extend({

  initialize: function (options) {
    this.options = options || {};
  },

  show: function (opts) {
    var view = new ShowView({
      collection: opts.collection,
      model: opts.model,
      ns: opts.ns
    });

    this.showView(view);
  },

  showView: function (view) {
    app.rm.get('contentMain').show(view);
  }

});

module.exports = Controller;
