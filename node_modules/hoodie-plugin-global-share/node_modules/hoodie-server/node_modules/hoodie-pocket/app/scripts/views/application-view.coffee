class Pocket.ApplicationView extends Pocket.BaseView

  events:
    "click a"       : "handleLinks"

  views:
    "body" : new Pocket.MainView

  initialize: ->
    super

    @setElement( $('html') )
    @render()

  handleLinks: (event) ->
    path = $(event.target).attr 'href'
    if /\.pdf$/.test path
      return true
    if /^\/[^\/]/.test(path)
      pocket.router.navigate path.substr(1), true
      return false

  beforeRender: ->
    if pocket.isAuthenticated
      @views.body.template = 'main'
    else
      @views.body.template = 'signin'

    console.log '@views.body.template', @views.body.template
    super
