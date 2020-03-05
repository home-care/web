const indexRouter = require("../routes/index");
const userRouter = require("../routes/user");
const dataRouter = require("../routes/data");
const alertRouter = require("../routes/alert");
const deviceRouter = require("../routes/device");

module.exports = function registerRoutes(app) {
  app.use("/", indexRouter);
  app.use("/user", userRouter);
  app.use("/data", dataRouter);
  app.use("/alert", alertRouter);
  app.use("/device", deviceRouter);
};
