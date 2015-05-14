var Backbone = require('backbone');
var HoodieAdmin = require('hoodie.admin');

var admin = new HoodieAdmin();

var AdminModel = Backbone.Model.extend({

  defaults: {
    password: ''
  },

  authenticate: function () {
    return admin.account.authenticate();
  },

  hasInvalidSession: function () {
    return admin.account.hasInvalidSession();
  },

  signIn: function (password) {
    return admin.account.signIn(password);
  },

  signOut: function () {
    return admin.account.signOut();
  },

  validation: {
    password: {
      required: true,
      msg: 'Password can\'t be empty'
    }
  }

});

module.exports = AdminModel;
