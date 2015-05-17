/**
 * Users plugin
 * Manages accounts and user dbs
 */

var removeAccount = require('./lib/remove_account');
var passwordReset = require('./lib/password_reset');
var changeUsername = require('./lib/change_username');
var signUp = require('./lib/signup');
var utils = require('./lib/utils');


module.exports = function (hoodie, callback) {

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
    else if (!signUp.isConfirmed(doc)) {
      signUp(hoodie, doc);
    } else {
      hoodie.task.addSource(utils.userDB(doc));
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
