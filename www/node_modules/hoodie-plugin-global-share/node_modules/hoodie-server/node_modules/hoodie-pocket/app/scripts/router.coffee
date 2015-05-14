class Pocket.Router extends Backbone.Router

  routes:
    ""                                  : "dashboard"
    "plugins/:pluginName"               : "plugins"
    "plugins/:pluginName/*subroute"     : "plugins"

  dashboard: ->
    console.log("dashboard: ");
    view = new Pocket.DashboardView
    pocket.app.views.body.setView(".main", view)

    $.when(
      hoodieAdmin.app.getStats(1358610679),
      hoodieAdmin.config.get()
    ).then (stats, appConfig) ->
      view.stats     = stats
      view.appConfig = appConfig
      view.render()

  plugins: (pluginName, subroute) ->
    console.log("plugins: ",pluginName, subroute);

    unless Pocket.Routers
      Pocket.Routers = {}


    hoodieAdmin.plugins.getConfig(pluginName).then (config) =>
      pluginViewName = @capitaliseFirstLetter(pluginName)+"View"

      view = new Pocket.PluginsView
      pocket.app.views.body.setView(".main", view)
      view.plugin = {
        name: pluginName,
        config: config
      }
      view.render()

  capitaliseFirstLetter : (string) ->
    string.charAt(0).toUpperCase() + string.slice(1)
