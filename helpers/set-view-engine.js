const path = require("path");

module.exports = function setViewEngine(app) {
  app.set("views", path.join(__dirname, "..", "views"));
  app.set("view engine", "hbs");
};
