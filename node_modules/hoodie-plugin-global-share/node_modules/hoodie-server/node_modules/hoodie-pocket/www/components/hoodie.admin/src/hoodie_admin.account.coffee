# HoodieAdmin.Account
# ================

#
class HoodieAdmin.Account extends Hoodie.Account

  # 
  constructor : (@hoodie) ->

    @username = 'admin'
    @_requests = {}

    # hide useless methods
    noop = ->
    @[method] = noop for method in [
      'init'
      'signUp'
      'destroy'
      'anonymousSignUp'
      'hasAnonymousAccount'
      'setAnonymousPassword'
      'getAnonymousPassword'
      'removeAnonymousPassword'
      'resetPassword'
      '_checkPasswordResetStatus'
    ]

    super
  
  # On
  # ---

  # On
  # ---

  # shortcut for `hoodie.admin.on`
  on : (event, cb) -> 
    event = event.replace /(^| )([^ ]+)/g, "$1account:$2"
    @hoodie.on event, cb


  # Trigger
  # ---

  # shortcut for `hoodie.admin.trigger`
  trigger : (event, parameters...) -> 
    @hoodie.trigger "account:#{event}", parameters...


  # Request
  # ---

  # shortcut for `hoodie.admin.request`
  request : (type, path, options = {}) ->
    @hoodie.request arguments...


  # 
  signIn : (password) ->
    username = 'admin'
    @_sendSignInRequest username, password


  # 
  signOut : (password) ->
    @_sendSignOutRequest().then => @trigger 'signout'

  #
  _handleAuthenticateRequestSuccess : (response) =>
    if response.userCtx.name is 'admin'
      @_authenticated = true
      @trigger 'authenticated', @username
      @hoodie.resolveWith @hoodie
    else
      @_authenticated = false
      @trigger 'error:unauthenticated'
      @hoodie.rejectWith()

  #
  _handleSignInSuccess : (options = {}) =>
    return (response) =>
      @trigger 'signin', @username
      @trigger 'authenticated', @username
      @hoodie.resolveWith @hoodie

  #
  _userKey : ->
    'admin'

