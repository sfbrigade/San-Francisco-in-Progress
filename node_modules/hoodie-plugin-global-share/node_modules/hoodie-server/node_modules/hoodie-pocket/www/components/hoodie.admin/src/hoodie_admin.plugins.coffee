# HoodieAdmin.Plugins
# =====================

#
class HoodieAdmin.Plugins extends Hoodie.Remote

  name   : 'plugins'

  constructor: (@hoodie) ->
    super(@hoodie)

  
  find: (pluginName) ->
    super('plugin', pluginName).then (response) ->
      return response

  # [
  #   { "name": 'share', "title": "Share Plugin", "description": "", "version": ""},
  #   { "name": 'share', "title": "Share Plugin", "description": "", "version": ""},
  #   ...
  # ]
  findAll: ->
    @hoodie.request('GET', '/_plugins').then (response) ->
      return response

  getConfig: (pluginName) =>
    @find(pluginName)
    .then @_handleGetConfigSucess, @_handleGetConfigError

  updateConfig: (pluginName, config) ->
    @update(pluginName, {config})

  getTemplate: (pluginName) ->
    @hoodie.request('GET', "/_plugins/#{pluginName}/pocket/index.html")


  _handleGetConfigSucess : (response) =>
    (response) -> response.config or {}

  _handleGetConfigError : =>
    @hoodie.resolveWith({})