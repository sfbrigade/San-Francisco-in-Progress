/**
 * Users plugin
 * Manages accounts and user dbs
 */

var removeAccount = require('./lib/remove_account');
var passwordReset = require('./lib/password_reset');
var changeUsername = require('./lib/change_username');
var signUp = require('./lib/signup');
var utils = require('./lib/utils');


var sources = [];

module.exports = function (hoodie, callback) {

  /**
  * Adds a database to the pool of task event sources
  * Makes sure it only happens once per database
  * Maybe move the dedupe logic to hoodie-plugins-manager
  */
  var addSource = function addSource(doc) {
    var dbName = utils.userDB(doc);

    if(sources.indexOf(dbName) === -1) {
      // not a source yet
      hoodie.task.addSource(dbName);
      sources.push(dbName);
    }
  };

  /**
   * Event handlers
   */
  function userChange(doc) {
    if (doc.$error) {
      // don't do any further processing to user docs with $error
      return;
    }
    else if (doc._deleted && !doc.$newUsername) {
      removeAccount(hoodie, doc);
    }
    else if (doc.$newUsername) {
      changeUsername(hoodie, doc);
    }
    else if (!signUp.isConfirmed(doc) && !signUp.isUnconfirmed(doc)) {
      signUp(hoodie, doc);
    } else {
      addSource(doc);
    }
  }

  /**
   * Loops through all user accounts and runs them through
   * the new user procedure. For most users that will mean
   * that their user database will be added as a listener
   * to the event system.
   */
  function handleExistingUsers (hoodie, done) {
    // bootstrap existing users
    hoodie.account.findAll(function (error, accounts) {
      if (error) {
        console.log('hoodie-plugin-users: can’t bootstrap existing accounts');
        return done(error);
      } else {
        accounts.forEach(userChange);
        done();
      }
    });
  }


  hoodie.account.on('user:change', userChange);
  hoodie.account.on('user_anonymous:change', userChange);

  hoodie.account.on('$passwordReset:change', function (doc) {
    if (!doc._deleted && !doc.$error) {
      passwordReset(hoodie, doc);
    }
  });

  /**
   * plugin initialization complete
   */
  handleExistingUsers(hoodie, callback);

};
