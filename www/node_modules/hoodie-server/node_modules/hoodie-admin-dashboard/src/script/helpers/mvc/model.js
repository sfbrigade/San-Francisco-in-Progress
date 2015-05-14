/*jshint -W079, -W098 */
var $ = require('jquery');
var Backbone = require('backbone');

var SuperModel = Backbone.Model.extend({
  idAttribute: 'name'
});

module.exports = SuperModel;

