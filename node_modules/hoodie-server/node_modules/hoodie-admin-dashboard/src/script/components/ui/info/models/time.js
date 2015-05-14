var Backbone = require('backbone');
var moment = require('moment');

var Model = Backbone.Model.extend({

  initialize: function () {
    this.set({
      currentTime: moment().format('MMMM Do YYYY, h:mm a')
    });
  },

  defaults: {
    currentTime: ''
  }

});

module.exports = Model;

