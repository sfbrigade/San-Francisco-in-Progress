class Pocket.PluginsView extends Pocket.BaseView
  template: 'plugin'

  beforeRender: () =>
    @plugin.url = @plugin.name.replace('worker-', '')
    @plugin.cleanName = @makeURLHuman @plugin.url
    @appInfo = pocket.appInfo
    @baseUrl = hoodieAdmin.baseUrl

    @removeView(".plugin-content") if @getView(".plugin-content")

  _cachedViews : {}
  getPluginView : (name) ->
    unless @_cachedViews[name]
      @_cachedViews[name] = new Pocket.PluginsView["plugin-#{@plugin.name}"]

    return @_cachedViews[name]
