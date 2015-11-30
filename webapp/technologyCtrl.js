function TechnologyController(scope, technologies, log) {
  this.scope = scope;
  this.scope.technologies = technologies;
  log.info("Bound " + technologies.length + " techologies to scope.");
}

angular.module("example-koa-angular").controller("TechnologyController", ["$scope", "TECHNOLOGIES", "$log", TechnologyController]);
