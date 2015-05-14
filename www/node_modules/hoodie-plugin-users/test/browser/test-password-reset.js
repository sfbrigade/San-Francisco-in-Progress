suite('password reset', function () {

  var adminAuthorizationHeaders = {
    Authorization: 'Basic ' + btoa('admin:testing')
  }

  setup(function (done) {
    this.timeout(10000);
    // phantomjs seems to keep session data between runs,
    // so clear before running tests
    localStorage.clear();

    // update app config to point to fake smtp server for testing,
    // the mail server writes recieved messages to files in www/emails
    hoodie.request('get', '/app/config', {headers: adminAuthorizationHeaders})
      .fail(function (err) {
        assert.ok(false, err.message);
      })
      .done(function (doc) {
        doc.config.email_host = 'localhost';
        doc.config.email_port = 8888;
        doc.config.email_secure = false;
        delete doc.config.email_user;
        delete doc.config.email_pass;
        delete doc.config.email_service;
        hoodie.request('put', '/app/config', {
          headers: adminAuthorizationHeaders,
          data: JSON.stringify(doc),
          contentType: 'application/json'
        })
          .fail(function (err) {
            assert.ok(false, err.message);
          })
          .done(function() {
            done()
          });
      });
  });

  test('user does not exist', function (done) {
    this.timeout(10000);
    hoodie.account.resetPassword('userdoesnotexist')
      .fail(function (err) {
        assert.ok(/^User could not be found$/.test(err.message));
        assert.equal(err.error, 'not_found');
        done();
      })
      .done(function () {
        assert.ok(false, 'expected error');
      });
  });

  test('reset password - username is email address', function (done) {
    this.timeout(20000);

    hoodie.account.signUp('resetuser@example.com', 'password')
      .then(function() {
        return hoodie.account.signOut()
      })
      .fail(function (err) {
        assert.ok(false, err.message);
      })
      .done(function() {
        hoodie.account.resetPassword('resetuser@example.com')
          .fail(function (err) {
            assert.ok(false, err.message);
          })
          .done(function () {
            setTimeout(function () {
              $.getJSON('/emails/resetuser%40example.com')
                .fail(function (err) {
                  assert.ok(false, 'could not fetch email data');
                })
                .done(function (emails) {
                  assert.equal(emails.length, 1);
                  var message = emails[0].message;
                  // check the email contains new credentials
                  assert.ok(/username: resetuser@example.com/.test(message));
                  var match = /password: (\w+)/.exec(message);
                  assert.ok(match, 'password provided in email');
                  // check the password in the email works
                  hoodie.account.signIn('resetuser@example.com', match[1])
                    .fail(function () {
                      assert.ok(false, 'signIn with reset password failed');
                    })
                    .done(function () {
                      assert.equal(
                        hoodie.account.username,
                        'resetuser@example.com',
                        'should be logged in after signup'
                      );
                      done();
                    });
                });
            }, 2000);
          });
      })
  });

  test('reset password - username is not email address', function (done) {
    this.timeout(20000);
    hoodie.account.signOut()
      .fail(done)
      .done(function() {
        hoodie.account.signUp('resetuser2', 'password')
          .fail(done)
          .done(function () {
            hoodie.account.signOut().done(function () {
              hoodie.account.resetPassword('resetuser2')
                .fail(function (err) {
                  assert.ok(
                    /^No email address found$/.test(err.message)
                  );
                  done();
                })
                .done(function () {
                  assert.ok(false, 'password reset should fail');
                });
            });
          });
      })
  });

});

suite('password reset - SMTP server down', function () {

  var adminAuthorizationHeaders = {
    Authorization: 'Basic ' + btoa('admin:testing')
  }

  setup(function (done) {
    this.timeout(10000);
    // phantomjs seems to keep session data between runs,
    // so clear before running tests
    localStorage.clear();

    // update app config to point to fake smtp server for testing,
    // the mail server writes recieved messages to files in www/emails
    hoodie.request('get', '/app/config', {headers: adminAuthorizationHeaders})
      .fail(done)
      .done(function (doc) {
        doc.config.email_host = 'not-a-real-host-87632184687216498214',
        doc.config.email_port = 9898;
        doc.config.email_secure = false;
        delete doc.config.email_user;
        delete doc.config.email_pass;
        delete doc.config.email_service;


        hoodie.request('put', '/app/config', {
          headers: adminAuthorizationHeaders,
          data: JSON.stringify(doc),
          contentType: 'application/json'
        })
        .fail(done)
        .done(function (res) {
          done();
        });
      });
  });

  test('reset password - fail to send email', function (done) {
    this.timeout(20000);
    hoodie.account.signOut()
      .fail(done)
      .done(function() {
        hoodie.account.signUp('resetuser3@example.com', 'password')
          .fail(done)
          .done(function () {
            hoodie.account.signOut().done(function () {
              hoodie.account.resetPassword('resetuser3@example.com')
                .fail(function (err) {
                  assert.ok(
                    /^Failed to send password reset email$/.test(err.message)
                  );
                  done();
                })
                .done(function () {
                  assert.ok(false, 'password reset should fail');
                });
            });
          });
    });
  });

});
