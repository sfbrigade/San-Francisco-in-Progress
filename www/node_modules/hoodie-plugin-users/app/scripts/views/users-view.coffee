class Users.UsersView extends Users.BaseView
  template: 'users'
  sort: undefined
  sortBy: 'signupDate'
  sortDirection: 'sort-up'
  blockSorting: false

  getConfig: (callback) ->
    hoodieAdmin.request('GET', '/app/config')
    .fail((error) ->callback error)
    .done (response) -> callback null, response

  setConfig: (doc, callback) ->
    hoodieAdmin.request('PUT', '/app/config', data: JSON.stringify(doc))
    .fail((error) -> callback error)
    .done (response) -> callback null, response

  updateConfig: (obj, callback) ->
    @getConfig (err, doc) =>
      return callback(err) if err

      doc.config = _.extend(doc.config, obj)
      @setConfig doc, callback


  events :
    'submit form.userSearch'                      : 'search'
    'submit form.updatePassword'                  : 'updatePassword'
    'submit form.updateUsername'                  : 'updateUsername'
    'submit form.addUser'                         : 'addUser'
    'click .addUser button[type="submit"]'        : 'addUser'
    'click .user a.removeUserPrompt'              : 'removeUserPrompt'
    'click #confirmUserRemoveModal .removeUser'   : 'removeUser'
    'click .clearSearch'                          : 'clearSearch'
    'click .storeDatabases'                       : 'storeDatabases'
    'click .sort-header'                          : 'saveSorting'

  update : =>
    # set initial form values
    @getConfig (err, doc) =>
      console.log('doc: ',doc);
      return console.log(err)  if err
      doc.config.additional_user_dbs = [] unless doc.config.additional_user_dbs
      @databases = doc.config.additional_user_dbs.join(', ')
      console.log('databases: ',@databases);
      @render()
      return
    hoodieAdmin.user.findAll().then (users, object = {}, appConfig = {}) =>
      @totalUsers   = users.length
      @users        = users
      console.log('users: ',users);
      @config       = $.extend @_configDefaults(), object.config
      @editableUser = null
      switch users.length
        when 0
          @resultsDesc = "You have no users yet"
        when 1
          @resultsDesc = "You have a single user"
        else
          @resultsDesc = "Currently displaying all #{@totalUsers} users"

      # config defaults
      @config.confirmationEmailText or= "Hello {name}, Thanks for signing up!"
      @render()

  emailTransportNotConfigured : ->
    isConfigured = @appConfig?.email?.transport?
    not isConfigured

  addUser : (event) ->
    event.preventDefault()
    $btn = $(event.currentTarget);
    username = $('.addUser .username').val()
    password = $('.addUser .password').val()
    $submitMessage = $btn.siblings('.submitMessage')
    if(username and password)
      $btn.attr('disabled', 'disabled')
      $btn.text("Adding #{username}…")

      hoodieId = hoodieAdmin.uuid()
      hoodieAdmin.user.add('user', {
        id : username
        name : "user/#{username}"
        hoodieId : hoodieId
        database : "user/#{hoodieId}"
        signedUpAt : new Date()
        roles : []
        password : password
      })
      .done(@onAddUser)
      .fail (data) ->
        console.log "could not add user: ", data
        $btn.attr('disabled', null)
        if data.name is "HoodieConflictError"
          $submitMessage.text("Sorry, '#{username}' already exists")
        else
          $submitMessage.text("Error: "+data.status+" - "+data.responseText)
        $btn.text("Add user")
        $btn.attr('disabled', null)
    else
      $submitMessage.text("Please enter a username and a password")

  onAddUser: (event) =>
    $('.addUser .username').val("")
    $('.addUser .password').val("")
    $btn = $('form.addUser button').text("Add user").attr('disabled', null)
    $('form.addUser .submitMessage').text("Added new user.")
    @update()
    return

  removeUserPrompt : (event) =>
    event.preventDefault()
    id = $(event.currentTarget).closest("[data-id]").data('id');
    type = $(event.currentTarget).closest("[data-type]").data('type');
    $('#confirmUserRemoveModal')
      .modal('show')
      .data
        id: id
        type: type
      .find('.modal-body').text('Really remove the user '+id+'? This cannot be undone!').end()
      .find('.modal-title').text('Remove user '+id).end()
    #removeUser(event)

  removeUser : (event) =>
    event.preventDefault()
    id = $('#confirmUserRemoveModal').data('id');
    type = $('#confirmUserRemoveModal').data('type');
    hoodieAdmin.user.remove(type, id).then =>
      $('[data-id="'+id+'"]').remove()
      # Because bootstrap
      $('#confirmUserRemoveModal').modal('hide')
      $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();
      @update()

  editUser : (id) ->
    $.when(hoodieAdmin.user.find('user', id)).then (user) =>
      @editableUser = user
      @render()
      return

  updateUsername : (event) ->
    event.preventDefault()
    id = $(event.currentTarget).closest('form').data('id');
    $form = $(event.currentTarget);
    $btn = $form.find('[type="submit"]');
    #oldUsername = $form.find('[name="username"]').data('oldusername')
    #username = $form.find('[name="username"]').val()

  updatePassword : (event) ->
    event.preventDefault()
    id = $(event.currentTarget).closest('form').data('id');
    $form = $(event.currentTarget);
    $btn = $form.find('[type="submit"]');
    password = $form.find('[name="password"]').val()
    if password
      $btn.attr('disabled', 'disabled')
      $form.find('.submitMessage').text("Updating password")
      hoodieAdmin.user.update('user', id, {password: password})
      .done (data) ->
        $btn.attr('disabled', null)
        $form.find('.submitMessage').text("Password updated")
      .fail (data) ->
        $btn.attr('disabled', null)
        $form.find('.submitMessage').text("Error: could not update password")
    else
      $form.find('.submitMessage').text("You didn't change anything.")

  search : (event) ->
    event.preventDefault()
    @searchQuery = $('input.search-query', event.currentTarget).val()
    if !@searchQuery
      @resultsDesc  = "Please enter a search term first"
      @render()
      return

    hoodieAdmin.user.search(@searchQuery).then (users) =>

      @users = users
      switch users.length
        when 0
          @resultsDesc  = "No users matching '#{@searchQuery}'"
        when 1
          @resultsDesc  = "#{users.length} user matching '#{@searchQuery}'"
        else
          @resultsDesc  = "#{users.length} users matching '#{@searchQuery}'"
      @render()

  clearSearch : (event) ->
    event.preventDefault()
    @searchQuery = null
    @update()

  saveSorting: (event) ->
    unless @blockSorting
      # get previous sorting parameters…
      @sortBy = $('#userList .sort-up, #userList .sort-down').data('sort-by')
      if @sortBy
        @sortDirection = 'sort-down'
        if $('#userList .sort-up').length isnt 0
          @sortDirection = 'sort-up'

  afterRender : =>
    userList = document.getElementById('userList')
    if userList
      @sort = new Tablesort(userList);
      # sort by previous sorting parameters.
      # Bit hacky, because tablesort has no api for this
      @blockSorting = true
      sortHeader = $('#userList [data-sort-by="'+@sortBy+'"]')
      sortHeader.click()
      if @sortDirection is 'sort-up'
        sortHeader.click()
      @blockSorting = false
    # Deal with all conditional form elements once after rendering the form
    @$el.find('.formCondition').each (index, el) ->
      users.handleConditionalFormElements(el, 0)

    super

  storeDatabases : =>
    event.preventDefault()
    if @$el.find('[name=userDatabases]')[0].checkValidity()
      dbs = @$el.find("[name=userDatabases]").val().replace(RegExp(" ", "g"), "").split(",")
      console.log('dbs: ',dbs);
      @updateConfig
        additional_user_dbs: dbs
      , (err) =>
        if err
          @setConfig
            additional_user_dbs: dbs
          console.log err
      return

  _configDefaults : ->
    #confirmationEmailText : "Hello {name}! Thanks for signing up with #{@appInfo.name}"
