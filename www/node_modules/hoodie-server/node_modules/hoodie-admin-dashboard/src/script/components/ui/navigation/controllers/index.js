'use strict';

var app = require('../../../../helpers/namespace');
var Marionette = require('backbone.marionette');
// var Backbone = require('backbone');
var View = require('../views/index');

var Controller = Marionette.Controller.extend({

  initialize: function (options) {
    this.options = options || {};
  },

  show: function (opts) {

// @ToDo: add Dashboard to admin-dashboard
/*    opts.collection.add(new Backbone.Model({
      name: 'dashboard',
      title: 'dashboard'
    }), {
      at: 0
    });
*/
    var view = new View({
      collection: opts.collection,
      model: opts.model,
      ns: opts.ns
    });

    this.showView(view);

  },

  showView: function (view) {
    app.rm.get('sidebarNav').show(view);
  }

});

module.exports = Controller;
