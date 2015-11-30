var chai, chaiAsPromised, expect;

chai           = require("chai");
chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
expect = chai.expect;

describe("example-koa-angular", function() {
  it("should have a title", function() {
    browser.get("http://localhost:3000/");
    return expect(browser.getTitle()).to.eventually.equal("example-koa-angular");
  });
  return it("should have a welcome banner", function() {
    var banner;
    browser.get("http://localhost:3000/");
    banner = element(By.tagName("h1"));
    return expect(banner.getText()).to.eventually.equal("'Allo 'Allo 'Allo!");
  });
});
