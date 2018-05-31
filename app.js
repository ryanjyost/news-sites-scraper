"use strict";

const express = require("express");
const path = require("path");
const db = require("./db");
const favicon = require("serve-favicon");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cron = require("node-cron");
const getPort = require("get-port");

const index = require("./routes/index");
const users = require("./routes/users");

const app = express();

//======================================
// Create a new batch of records
const createBatch = require("./createBatch");

// const task = cron.schedule(
//   "* * * * *",
//   function() {
//     saveScreenshots(sites);
//   },
//   false
// );

// task.start();

try {
  createBatch();
} catch (e) {
  console.log("eRROR");
}

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
// app.set("port");

//======================================
//middleware
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//======================================
//routing
//app.use("/", index);

//=================================
// error handler
app.use(function(req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

//=================================
//Listen on port
app.listen(app.get("port"), error => {
  if (error) console.error(error);
  // console.log("app is running");
});

module.exports = app;
