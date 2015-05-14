describe "HoodieAdmin.Users", ->
  beforeEach ->
    @admin = new Mocks.HoodieAdmin
    @adminUsers = new HoodieAdmin.Users @admin

  describe "constructor", ->
    it "should have some specs", ->
      expect('HoodieAdmin.Users').toBe 'tested'
  # /constructor

  describe "#search(query)", ->
    beforeEach ->
      @requestDefer = $.Deferred()
      spyOn(@adminUsers, "request").andReturn @requestDefer.promise()

    _when "search succeeds an returns 2 results, of which one is a user doc", ->
      beforeEach ->
        @requestDefer.resolve window.Mocks.usersAllDocsResponse()

      it "should return 1 user doc", ->
        expectedUserObject = 
          _rev : "2-120973b883d8abe355fa58cf68167eca"
          name : "user/testf8le0@example.com"
          type : "user"
          roles : ["testf8le0","confirmed"]
          ownerHash : "testf8le0"
          database : "user/testf8le0"
          # updatedAt : new Date Date.parse("2013-04-15T18:08:01.000Z")
          # createdAt : new Date Date.parse("2013-04-15T18:08:01.000Z")
          signedUpAt : "2013-04-15T18:08:01.593Z"
          $state : "confirmed"
          salt : "9303e4d96ebdb4fe926f5f57ded5f677"
          password_sha : "61a4c8acb6ff993389e31e7a7cdf3ab02d9fb810"
          id : "testf8le0@example.com"


        expect(@adminUsers.search("blup")).toBeResolvedWith [expectedUserObject]

    
  # /#search(query)

# /HoodieAdmin