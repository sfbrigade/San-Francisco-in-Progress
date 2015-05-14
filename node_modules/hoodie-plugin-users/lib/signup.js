var utils = require('./utils');
var async = require('async');
var util = require('util');

/**
 * Handles user change events for users not confirmed
 */

var exports = module.exports = function (hoodie, doc) {
  var callback = utils.logErrors('Error confirming user');
  return async.applyEachSeries(
    [exports.createUserDB, exports.createAdditionalDBs, exports.confirmUser],
    hoodie,
    doc,
    callback
  );
};

/**
 * Returns true if user is confirmed, false otherwise
 */

exports.isConfirmed = utils.hasRole('confirmed');


/**
 * Returns true if user as unconfirmed role, false otherwise
 */

exports.isUnconfirmed = utils.hasRole('unconfirmed');

/**
 * Create user's personal database and grants them read/write access
 */

exports.createUserDB = function (hoodie, doc, callback) {
  hoodie.database.add(utils.userDB(doc), callback);
};

/*
 * Create additional user datbases and grant them read/write access
 */
exports.createAdditionalDBs = function (hoodie, doc, callback) {

  // lil helper
  function createDatabase(db, cb) {
    var db_name = util.format('%s-%s', utils.userDB(doc), db);
    hoodie.database.add(db_name, cb);
  }

  var additionalUserDbs = hoodie.config.get('additional_user_dbs');
  if (util.isArray(additionalUserDbs)) {
    async.eachSeries(additionalUserDbs, createDatabase, callback);
  } else {
    callback();
  }
};

/**
 * Adds appropriate roles to user doc to enable user db
 * access and login ability on the frontend
 */

exports.confirmUser = function (hoodie, doc, callback) {

  // runs all user.confirm hooks defined by plugins
  // if one of them returns false, we don’t confirm
  // the user. Error reporting happens out of band.
  // If no hooks are defined, returns true as well.
  hoodie.env.hooks.runDynamicAsyncEvery('plugin.user.confirm', [doc], function(allowConfirm) {
    var hasRoles = function(doc) {
      return doc.roles && doc.roles.indexOf(doc.hoodieId) !== -1;
    };

    var isAnonymousUser = function(doc) {
      return !!doc.name.match(/anonymous/);
    };

    if(hasRoles && !isAnonymousUser) {
      return callback();
    }

    var roles = [
      doc.hoodieId,
      'hoodie:read:' + utils.userDB(doc),
      'hoodie:write:' + utils.userDB(doc)
    ];

    if(allowConfirm || isAnonymousUser(doc)) {
      roles.push('confirmed');
    } else {
      roles.push('unconfirmed');
    }

    var buildRole = function(prefix, user, database) {
      return util.format('%s%s-%s', prefix, user, database);
    };

    var additionalUserDbs = hoodie.config.get('additional_user_dbs');
    if (util.isArray(additionalUserDbs)) {
      additionalUserDbs.forEach(function(db) {
        roles.push(buildRole('hoodie:read:', utils.userDB(doc), db));
        roles.push(buildRole('hoodie:write:', utils.userDB(doc), db));
      });
    }

    hoodie.account.update(doc.type, doc.id, {roles: roles}, callback);
  });
};
