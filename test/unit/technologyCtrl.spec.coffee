describe("TechnologyController", ->
  beforeEach -> module "example-koa-angular"

  it("should attach the catalog to the scope", inject(($rootScope, $controller) ->
    scope = $rootScope.$new()
    underTest = $controller("TechnologyController", "$scope": scope)

    expect(scope.technologies).to.be.a("array")
    expect(scope.technologies).to.be.ok)
  )
)
