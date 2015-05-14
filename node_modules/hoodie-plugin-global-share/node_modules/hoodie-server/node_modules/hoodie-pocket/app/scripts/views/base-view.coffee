class Pocket.BaseView extends Backbone.Layout # Backbone.View

  # A global view helper
  helper: ->
    console.log "HELPDERP"

  # by default, pass entire view to template
  serialize: -> this

  #
  beforeRender: ->
    @appInfo = pocket.appInfo

  #
  afterRender: ->
    $('.timeago').timeago()

  # Turns "email-out" into "Email out"
  makeURLHuman: (@string) ->
    result = @string.replace(/-/g,' ')
    result = result.charAt(0).toUpperCase() + result.slice(1)