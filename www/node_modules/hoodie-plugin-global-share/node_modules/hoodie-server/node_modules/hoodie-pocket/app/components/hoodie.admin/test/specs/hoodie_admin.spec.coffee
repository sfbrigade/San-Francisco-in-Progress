describe "HoodieAdmin", ->
  beforeEach ->
    @hoodieAdmin = new HoodieAdmin 'http://couch.example.com'
    spyOn($, "ajax").andReturn $.Deferred()

  describe "constructor", ->
    it "should have some specs", ->
      expect('HoodieAdmin').toBe 'tested'
  # /constructor

# /HoodieAdmin