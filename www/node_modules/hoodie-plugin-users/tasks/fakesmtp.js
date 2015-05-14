var fs = require('fs');
var path = require('path');
var simplesmtp = require('simplesmtp');


module.exports = function (grunt) {

  grunt.registerMultiTask('fakesmtp', 'Start SMTP test server', function () {
    var done = this.async();
    var options = this.options({
      dir: 'emails',
      port: 8888,
      keepalive: false
    });
    if (!fs.existsSync(options.dir)) {
      fs.mkdirSync(options.dir);
    }
    grunt.log.writeln(
      'Starting SMTP server on 127.0.0.1:' + options.port
    );
    var smtp = simplesmtp.createSimpleServer(options, function (req) {
      var message = '';
      req.on('data', function (chunk) {
        message += chunk.toString();
      });
      req.on('end', function () {
        req.to.forEach(function (to) {
          var email = {
            to: to,
            from: req.from,
            message: message
          };
          var filename = path.resolve(options.dir, email.to);
          var data = [];
          if (fs.existsSync(filename)) {
            data = JSON.parse(fs.readFileSync(filename));
          }
          data.push(email);
          fs.writeFileSync(filename, JSON.stringify(data, null, 4));
        });
      });
      req.accept();
    });
    smtp.listen(options.port, function(err) {
      if (err) {
        grunt.fatal(err);
      }
      else if (!options.keepalive) {
        done();
      }
      else {
        grunt.log.write('Listening...\n');
      }
    });
  });

};
