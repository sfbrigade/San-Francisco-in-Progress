# HoodieAdmin.Users
# ================

# inherits from [Hoodie.Remote](http://hoodiehq.github.com/hoodie.js/doc/hoodie/remote.html)
# and adds these extra methods:
#
# * total
# * search
#
class HoodieAdmin.Users extends Hoodie.Remote

  name   : '_users'
  prefix : 'org.couchdb.user:'

  constructor: (@hoodie) ->
    super(@hoodie)

  # 
  # sign ups new user, and signs out directly after
  addTestUser: (options = {}) ->
    hash  = "test#{@hoodie.uuid(5)}"
    email = "#{hash}@example.com" 
    @_signUpUser(hash, email)

  # 
  # signs up multiple users
  addTestUsers: ( nr = 1 ) ->
    timestamp = (new Date).getTime()
    if nr > 10
      @addTestUsers(10).then =>
        nr -= 10
        @addTestUsers(nr)
    else
      promises = for i in [1..nr]
        @addTestUser()

    $.when promises...

  # 
  # gets a test user. If non exists yet, one gets created
  getTestUser : ->
    @hoodie.rejectWith(error: "deprecated")



  removeAllTestUsers: ->
    @hoodie.rejectWith(error: "deprecated")


  getTotal : ->
    @findAll().pipe (users) -> users.length

  search : (query) ->
    path = "/_all_docs?include_docs=true"
    path = "#{path}&startkey=\"org.couchdb.user:user/#{query}\"&endkey=\"org.couchdb.user:user/#{query}|\""

    @request("GET", path)
    .pipe(@_mapDocsFromFindAll).pipe(@_parseAllFromRemote)




  #
  request : (type, path, options = {}) ->
    path = "/#{encodeURIComponent @name}#{path}" if @name

    options.contentType or= 'application/json'
    if type is 'POST' or type is 'PUT'
      options.dataType    or= 'json'
      options.processData or= false
      options.data = JSON.stringify options.data

    @hoodie.request type, path, options


  # filter out non-user docs
  _mapDocsFromFindAll : (response) =>
    rows = response.rows.filter (row) -> /^org\.couchdb\.user:user(_anonymous)?\/[^\/]+$/.test row.id
    rows.map (row) -> row.doc
  _handlePullResults : (changes) =>
    changes = changes.filter (change) -> /^org\.couchdb\.user:user(_anonymous)?\/[^\/]+$/.test change.id
    super changes


  # sign up user by PUTing a doc in _users
  _signUpUser : (ownerHash, username, password = '') -> 
    unless username
      return @hoodie.rejectWith(error: 'username must be set')

    key = "user/#{username}"
    db  = "user/#{ownerHash}"
    now = new Date
    id  = "org.couchdb.user:#{key}"
    url = "/#{encodeURIComponent id}"

    options =
      data         :
        _id        : id
        name       : key
        type       : 'user'
        roles      : []
        password   : password
        ownerHash  : ownerHash
        database   : db
        updatedAt  : now
        createdAt  : now
        signedUpAt : now

    @request('PUT', url, options)