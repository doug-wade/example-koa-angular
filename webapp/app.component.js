((app) => {
  app.AppComponent = ng.core
    .Component({
      selector: 'example-koa-angular',
      template: '<h1>example-koa-angular/h1>'
    })
    .Class({
      constructor: () => {}
    });
})(window.app || (window.app = {}));
