suite('delete user db on account.destroy', function () {

  setup(function (done) {
    // phantomjs seems to keep session data between runs,
    // so clear before running tests
    localStorage.clear();
    hoodie.account.signOut().done(function () {
      done();
    });
  });

  test('user db is removed', function (done) {
    this.timeout(10000);
    hoodie.account.signUp('destroytest1', 'password')
      .fail(done)
      .done(function () {
        hoodie.request('get', '/user%2F' + hoodie.id())
          .fail(done)
          .done(function (data) {
            assert.ok(data.db_name, 'get db info');
            hoodie.account.destroy()
              .fail(done)
              .done(function () {
                hoodie.request('get', '/user%2F' + hoodie.id())
                  .done(function() {
                    done('/user%2F' + hoodie.id() + ' shoudl not exist after hoodie.account.destroy()');
                  })
                  .fail(function(error) {
                    assert.equal(404, error.status)
                    done();
                  })
              });
          });
      });
  });

});
