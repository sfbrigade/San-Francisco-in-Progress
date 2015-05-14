suite('signup and sessions', function () {

  setup(function (done) {
    // phantomjs seems to keep session data between runs,
    // so clear before running tests
    localStorage.clear();
    hoodie.account.signOut().done(function () {
      done();
    });
  });

  test('signUp', function (done) {
    this.timeout(10000);
    hoodie.account.signUp('testuser', 'password')
      .fail(function (err) {
        assert.ok(false, err.message);
      })
      .done(function () {
        assert.equal(
          hoodie.account.username,
          'testuser',
          'should be logged in after signup'
        );
        done();
      });
  });

  test('signIn', function (done) {
    this.timeout(10000);
    assert.ok(!hoodie.account.username, 'start logged out');
    hoodie.account.signIn('testuser', 'password')
      .fail(function (err) {
        assert.ok(false, err.message);
      })
      .done(function () {
        assert.equal(hoodie.account.username, 'testuser');
        done();
      })
  });

  test('signOut', function (done) {
    this.timeout(10000);
    hoodie.account.signIn('testuser', 'password')
      .then(function () {
        return hoodie.account.signOut();
      })
      .fail(function (err) {
        assert.ok(false, err.message);
      })
      .done(function () {
        assert.ok(!hoodie.account.username, 'should be logged out');
        done();
      })
  });

  test('signUp while logged in should fail', function (done) {
    this.timeout(10000);
    hoodie.account.signIn('testuser', 'password')
      .then(function () {
        return hoodie.account.signUp('testuser2', 'password');
      })
      .fail(function (err) {
        assert.ok(true, 'signUp should fail');
        done();
      })
      .done(function () {
        assert.ok(false, 'signUp should not succeed');
        done();
      })
  });

});
