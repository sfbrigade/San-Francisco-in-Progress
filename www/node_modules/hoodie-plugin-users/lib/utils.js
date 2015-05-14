var _ = require('lodash');

/**
 * Logs errors encountered by event handlers
 */

exports.logErrors = function (context) {
  return function (err) {
    if (err) {
      console.error(context + ': %s', err);
      console.error(err);
      return;
    }
  };
};

/**
 * Returns user db name for given user doc
 */

exports.userDB = function (doc) {
  return 'user/' + doc.hoodieId;
};

/**
 * Detects if user has a given role
 */

exports.hasRole = _.curry(function (role, doc) {
  return _.contains(doc.roles, role);
});
