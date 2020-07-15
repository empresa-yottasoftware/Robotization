const gecko = require("geckodriver");
const selenium = require("selenium-server");
const chrome = require("chromedriver");
module.exports = (function (settings) {
  settings.test_workers = false;
  return settings;
})(require("./nightwatch.json"));