const express = require("express");
const router = express.Router();
const {
  isValidUser,
  isValidDevice,
  isLoggedIn,
  getUser
} = require("../helpers/users");
const Database = require("../helpers/database");

router.get("/", function(req, res, next) {
  res.redirect("/user/login");
});

router.get("/dashboard", isLoggedIn(), async function(req, res, next) {
  const database = new Database();
  database.connect();
  const query = "SELECT * FROM ?? WHERE ?? = ?";
  const inserts = ["notifications", "user_id", req.session.userId];
  const results = await database.query(query, inserts);
  database.disconnect();
  res.render("user/dashboard/index", {
    message: "dashboard",
    notifications: results
  });
});

router.get("/dashboard/settings", isLoggedIn(), async function(req, res, next) {
  const database = new Database();
  database.connect();
  const query = "SELECT * FROM ?? WHERE ?? = ?";
  const inserts = ["contacts", "user_id", req.session.userId];
  const results = await database.query(query, inserts);
  database.disconnect();
  res.render("user/dashboard/settings", {
    message: "dashboard",
    contacts: results
  });
});

router.post("/settings/update", isLoggedIn(), async function(req, res, next) {
  const allowedMethods = ["SMS", "WA"];
  const name = req.body["contact-person-name"];
  const number = req.body["contact-person-number"];
  const method = req.body["contact-person-method"];
  if (allowedMethods.includes(method) && name && number) {
    const database = new Database();
    database.connect();
    const query = "INSERT INTO ?? SET ?";
    const newContact = {
      user_id: req.session.userId,
      contact_name: name,
      contact_number: number,
      contact_contact_method: method
    };
    const inserts = ["contacts", newContact];
    await database.query(query, inserts);
    database.disconnect();
  }
  res.redirect("/user/dashboard/settings");
});

router.get("/login", function(req, res, next) {
  res.render("user/login");
});

router.post("/login", async function(req, res, next) {
  const deviceId = req.body["device-id"];
  const phoneNumber = req.body["phone-number"];

  if ((await isValidUser(phoneNumber)) && (await isValidDevice(deviceId))) {
    const user = await getUser(phoneNumber);
    const { id } = user;
    req.session.loggedIn = true;
    req.session.userId = id;
    res.redirect("/user/dashboard");
  } else {
    res.redirect("/user/login");
  }
});

router.post("/logout", function(req, res, next) {
  req.session.loggedIn = false;
  res.redirect("/user/login");
});

router.get("/sign-up", function(req, res, next) {
  res.render("user/sign-up");
});

router.post("/sign-up", async function(req, res, next) {
  const deviceId = req.body["device-id"];
  const phoneNumber = req.body["phone-number"];
  if (deviceId && phoneNumber) {
    const database = new Database();
    database.connect();
    const userQuery = "INSERT INTO ?? SET ?";
    const newUser = {
      phone_number: phoneNumber
    };
    const userInserts = ["users", newUser];
    await database.query(userQuery, userInserts);
    const user = await getUser(phoneNumber);
    const { id } = user;
    const deviceQuery = "INSERT INTO ?? SET ?";
    const newDevice = {
      device_id: deviceId,
      user_id: id
    };
    const deviceInserts = ["devices", newDevice];
    await database.query(deviceQuery, deviceInserts);
    database.disconnect();
    req.session.loggedIn = true;
    req.session.userId = id;
    res.redirect("/user/dashboard");
  } else {
    res.redirect("/user/sign-up");
  }
});

module.exports = router;
