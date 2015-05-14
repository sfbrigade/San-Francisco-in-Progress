// HoodieAdmin Account
// ===================

var hoodieEvents = require('hoodie/src/utils/events');
var resolveWith = require('hoodie/src/utils/promise/resolve_with');
var reject = require('hoodie/src/utils/promise/reject');
var utils = require('hoodie/src/utils');

var ADMIN_USERNAME = 'admin';

function hoodieAccount (hoodieAdmin) {

  // public API
  var account = {};
  var signedIn = null;

  // add events API
  hoodieEvents(
    hoodieAdmin,
    account,
    'account'
  );


  // Authenticate
  // --------------

  // Use this method to assure that the admin is authenticated:
  // `hoodieAdmin.account.authenticate().done( doSomething ).fail( handleError )`
  // 
  // Note that this authenticated is a much simpler imlementation then the
  // one from `hoodie.admin.authenticate`. It sends a GET request every single
  // time it gets called, without bundling requests or caching the state on
  // whether the admin is authenticated or not.
  //
  account.authenticate = function authenticate() {
    return hoodieAdmin.request('GET', '/_session').then(handleAuthenticateRequestSuccess);
  };


  // sign in with password
  // ----------------------------------

  // username is hardcoded to "admin"
  account.signIn = function signIn(password) {
    var requestOptions = {
      data: {
        name: ADMIN_USERNAME,
        password: password
      }
    };

    return hoodieAdmin.request('POST', '/_session', requestOptions)
    .done( function(response) {
      var newBearerToken = response.bearerToken;
      signedIn = true;
      setBearerToken(newBearerToken);
      account.trigger('signin', ADMIN_USERNAME);
    });
  };


  // sign out
  // ---------
  account.signOut = function signOut() {
    return hoodieAdmin.request('DELETE', '/_session')
    .done( function() {
      signedIn = false;
      setBearerToken(undefined);
      return account.trigger('signout');
    });
  };

  account.isSignedIn = function() {
    return signedIn;
  };

  //
  // handle a successful authentication request.
  //
  // As long as there is no server error or internet connection issue,
  // the authenticate request (GET /_session) does always return
  // a 200 status. To differentiate whether the user is signed in or
  // not, we check `userCtx.name` in the response. If the user is not
  // signed in, it's null, otherwise the name the user signed in with
  //
  // If the user is not signed in, we diferentiate between users that
  // signed in with a username / password or anonymously. For anonymous
  // users, the password is stored in local store, so we don't need
  // to trigger an 'unauthenticated' error, but instead try to sign in.
  //
  function handleAuthenticateRequestSuccess(response) {
    if (response.userCtx.name) {
      return resolveWith(response.userCtx.name);
    }

    account.trigger('unauthenticated');

    return reject();
  }

  function setBearerToken(newBearerToken) {
    if (account.bearerToken === newBearerToken) {
      return;
    }

    account.bearerToken = newBearerToken;
    return utils.config.set('_account.bearerToken', newBearerToken);
  }

  hoodieAdmin.account = account;
}

module.exports = hoodieAccount;

