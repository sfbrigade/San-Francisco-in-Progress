Hoodie.extend(function(hoodie) {
  hoodie.email = {
    send: hoodie.task('email').start
  }
});