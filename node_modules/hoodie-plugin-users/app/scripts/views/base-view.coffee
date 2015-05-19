class Users.BaseView extends Backbone.Layout # Backbone.View

  # by default, pass entire view to template
  serialize: -> this

  #
  beforeRender: ->
    #@appInfo = users.appInfo
    @appInfo = {name: "TEST"}

  #
  afterRender: ->
    $('.timeago').timeago()

  # Turns "email-out" into "Email out"
  makeURLHuman: (@string) ->
    result = @string.replace(/-/g,' ')
    result = result.charAt(0).toUpperCase() + result.slice(1)