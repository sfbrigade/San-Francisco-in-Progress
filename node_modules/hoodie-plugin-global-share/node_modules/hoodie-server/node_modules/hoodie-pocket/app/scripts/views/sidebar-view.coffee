class Pocket.SidebarView extends Pocket.BaseView
  template: 'sidebar'

  handleNavigationStates: (route) ->
    route = route.replace 'route:', ''
    $el = $('nav a[href="/#'+route+'"]').parent()
    unless $el.hasClass("active")
      $("nav li.active").removeClass "active"
      $el.addClass "active"

  afterRender: ->
    @loadAppName()
    Backbone.history.bind "all", (route) =>
      @handleNavigationStates Backbone.history.fragment
    @loadPlugins()
    super

  loadAppName: ->
    hoodieAdmin.app.getInfo().then(@renderAppName)

  renderAppName: (@appInfo) =>
    @$el.find('header .appName a').text @appInfo.name
    $('.sidebar header .appName').bigtext({
      maxfontsize: 20
    })

  getUserPluginLabel: (@totalUsers) ->
    switch @totalUsers
      when 0
        @label = "No users"
      when 1
        @label = "One user"
      else
        @label = "#{@totalUsers} users"

  updateUserCount: (eventName, userObject) =>
    $.when(
      hoodieAdmin.users.getTotal()
    ).then (@totalUsers) =>
      $('.sidebar .plugins .users .name').text(@getUserPluginLabel(@totalUsers))

  loadPlugins: ->
    debouncedUserCount = _.debounce(@updateUserCount, 300)
    hoodieAdmin.users.on "change", (eventName, userObject) ->
      debouncedUserCount(eventName, userObject)
    hoodieAdmin.users.connect();
    $.when(
      hoodieAdmin.plugins.findAll(),
      hoodieAdmin.users.getTotal()
    ).then @renderPlugins

  # Generates plugin menu with badges
  renderPlugins: (@plugins, @totalUsers) =>
    for key, plugin of @plugins
      plugin.url = plugin.name
      plugin.cleanName = plugin.title
      # Special treatment for the users plugin: show user amount
      if plugin.cleanName is "Users"
        plugin.cleanName = @getUserPluginLabel(@totalUsers)
      plugin.badgeStatus = 'badge-'+plugin.status
      if plugin.messages
        plugin.messageAmount = plugin.messages.length
      else
        plugin.messageAmount = ''

    @$el.find('nav ul.plugins').html JST['sidebar-plugins'](this)
