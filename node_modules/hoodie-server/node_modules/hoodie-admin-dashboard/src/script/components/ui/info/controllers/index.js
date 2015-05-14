'use strict';

var app = require('../../../../helpers/namespace');
var Marionette = require('backbone.marionette');
var View = require('../views/index');
var Model = require('../models/time');

var Controller = Marionette.Controller.extend({

  initialize: function (options) {
    this.options = options || {};
    this.model = new Model();

    this.show(this.options);
  },

  show: function () {
    var view = new View({
      model: this.model
    });

    app.rm.get('contentHeader').show(view);
  }

});

module.exports = Controller;
