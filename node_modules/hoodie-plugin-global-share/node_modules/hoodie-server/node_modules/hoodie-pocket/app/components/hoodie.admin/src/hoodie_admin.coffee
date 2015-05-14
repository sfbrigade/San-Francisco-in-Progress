# HoodieAdmin
# ==============

# Extends hoodie with an admin plugin with
# commont tasks needed for the pocket admin UI.
#

#
class HoodieAdmin extends Hoodie

  constructor: (@baseUrl) ->

    if @baseUrl
      # remove trailing slash(es)
      @baseUrl = @baseUrl.replace /\/+$/, ''

    else 
      @baseUrl = "/_api"

    # init core admin plugins
    @account = new HoodieAdmin.Account this
    @app     = new HoodieAdmin.App     this
    @users   = new HoodieAdmin.Users   this
    @config  = new HoodieAdmin.Config  this
    @logs    = new HoodieAdmin.Logs    this
    @plugins = new HoodieAdmin.Plugins this


  # trigger
  # ---------

  # proxies to `hoodie.trigger` with `admin` prefix
  trigger : (event, parameters...) ->
    super "admin:#{event}", parameters...


  # on
  # ---------

  # proxies to `hoodie.on` with `admin` prefix
  on : (event, data) ->
    event = event.replace /(^| )([^ ]+)/g, "$1admin:$2"
    super event, data


  # request
  # --------------

  # just like the standard hoodie.request method,
  # but with an `admin.` subdomain on hoodie.baseUrl,
  # so that interaction with hoodie.admin does not 
  # interfere with other hoodie.requests.
  request : (type, path, options = {}) ->

    defaults =
      type        : type
      url         : "#{@baseUrl}#{path}"
      xhrFields   : withCredentials: true
      crossDomain : true
      dataType    : 'json'

    $.ajax $.extend defaults, options


  # Open store
  # ------------

  # same as hoodie.open, but as admin
  #
  open : (storeName, options = {}) ->
    $.extend options, name: storeName

    options.baseUrl = @baseUrl if @baseUrl isnt @baseUrl
    new Hoodie.Remote this, options


  # authenticate
  # --------------

  #
  authenticate : ->
    @account.authenticate()


  # sign in
  # --------------

  #
  signIn : (password) ->
    @account.signIn(password)


  # sign out
  # --------------

  #
  signOut : () ->
    @account.signOut()

Hoodie.extend 'admin', HoodieAdmin