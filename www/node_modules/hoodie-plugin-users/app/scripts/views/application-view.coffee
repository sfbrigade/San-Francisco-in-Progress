class Users.ApplicationView extends Users.BaseView

  events:
    "click a"       : "handleLinks"

  views:
    "body" : new Users.UsersView

  initialize: ->
    super

    @setElement( $('html') )
    @render()
    @views.body.update()

  handleLinks: (event) ->
    path = $(event.target).attr 'href'
    if /\.pdf$/.test path
      return true
    if /^\/[^\/]/.test(path)
      users.router.navigate path.substr(1), true
      return false
