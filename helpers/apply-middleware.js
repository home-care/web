const path = require("path");
const express = require("express");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");

module.exports = function applyMiddleware(app) {
  app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(
    session({ secret: process.env.SESSION_SECRET, cookie: { maxAge: 86400 } })
  );
  app.use(express.static(path.join(__dirname, "..", "public")));
};
