// REQUIRES
//------------------------------------------------------------------------------
var express = require("express");
var path = require("path");
var apiV1 = require("./scripts/api-v1.js")

// APP SETTINGS
//------------------------------------------------------------------------------

// Create app
var app = express();
app.set("view engine", "jade");
app.set("views", path.resolve(__dirname, "views"));

// ROUTER
//------------------------------------------------------------------------------

// Use router api
app.use("/v1", apiV1);

// Test page
app.use("/", function(req, res) {
  res.render("index");
});

// App listening on port 3000
app.listen(3000, function() {
  console.log("App started on port 3000")
});