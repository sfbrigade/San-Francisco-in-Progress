function hoodieAdminUser(hoodieAdmin) {
  var PREFIX = 'org.couchdb.user:';
  var user = hoodieAdmin.open('_users', {
    prefix: PREFIX
  });

  user.search = function search(query) {
    var userPrefix = PREFIX + 'user/';
    var startkey = encodeURIComponent(userPrefix + query);
    var endkey = encodeURIComponent(userPrefix + query + '|');
    return hoodieAdmin.user.request('GET', '/_all_docs?include_docs=true&startkey="'+startkey+'"&endkey="'+endkey+'"')
    .then(function(response){
      return response.rows.map(function(row) { 
        var doc = row.doc;
        doc.id = doc.name.split('/').pop();
        return doc;
      });
    });
  };

  hoodieAdmin.user = user;
}

module.exports = hoodieAdminUser;

