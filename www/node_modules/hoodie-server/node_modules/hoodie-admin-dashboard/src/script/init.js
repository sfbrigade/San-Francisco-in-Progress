/*jshint -W079 */
var Config = require('./models/config');
var app = require('./helpers/namespace');

require('./helpers/storage/store');
require('./helpers/handlebars');

// load entities
require('./components/admin-dashboard/entities/adminEntity');

// start the admin-dashboard component
require('./components/admin-dashboard/index');

app.start(new Config().toJSON());

module.exports = app;

