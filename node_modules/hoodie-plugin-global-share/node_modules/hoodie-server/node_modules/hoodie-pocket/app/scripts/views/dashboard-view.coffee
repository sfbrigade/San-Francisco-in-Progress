class Pocket.DashboardView extends Pocket.BaseView
  template: 'dashboard'


  emailTransportNotConfigured : ->
    isConfigured = @appConfig?.email?.transport?
    not isConfigured
