class Pocket.MainView extends Pocket.BaseView


  # Template is selected dynamically by ApplicationView::initialize

  views:
    ".sidebar" : new Pocket.SidebarView
    ".main"    : new Pocket.DashboardView

  events:
    "submit form.signIn": "signIn"

  signIn : (event) ->
    @$el.find('#signIn').attr('disabled', 'disabled')
    event.preventDefault()
    password = @$el.find('#signInPassword').val()
    hoodieAdmin.signIn(password).done(@onSignInSuccess).fail(@onSignInFail)

  onSignInFail: () =>
    $('form.signIn .error').text('Wrong password, please try again')
    $('#signIn').attr('disabled', null)

  onSignInSuccess: () =>
    window.location.reload()
