// REQUIRES
//------------------------------------------------------------------------------
var express = require("express");
var path = require("path");
// var apiV1 = require("./scripts/api-v1.js");

var bodyParser = require('body-parser');
var tmp = require('tmp');
var validUrl = require('valid-url');
var renderPdf = require('./scripts/renderPdf.js');

// Create a router for a subapp API
var api = express.Router();

// APP SETTINGS
//------------------------------------------------------------------------------

// Create app
var app = express();
app.set("view engine", "jade");
app.set("views", path.resolve(__dirname, "views"));
var appRouter = express.Router();

// Set body parser to retrieve post parameters

// Support json encoded bodies
app.use(bodyParser.json());
// Support encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Use app router
app.use(appRouter);

// APP ROUTER
//------------------------------------------------------------------------------

// Test page
appRouter.get("/", function(req, res) {
  res.render("index");
});

// Test page
appRouter.get("/report", function(req, res) {
  res.render("report");
});

// Report page
appRouter.post("/render-pdf", function(req, res) {

  // Store post parameters
  var reportData = req.body.data;
  var url = req.body.url;

  // Check if the url format is valid
  if(!validUrl.isUri(url)) {

    // Return a bad request status code
    res.status(400);

    // Return a json with the error description
    res.json("Bad url format");
    return;
  }

  var tmpFileName = './temp/'+tmp.tmpNameSync()+'.pdf';

  // TODO: make it with promise
  renderPdf.render(url, tmpFileName, reportData);

  // Read: https://github.com/ariya/phantomjs/issues/11084
  setTimeout(() => { 

    // Return an OK status code
    res.status(200);
    // Download the generated pdf file
    // res.download(tmpFileName, 'report.pdf');
    res.json({ name: path.resolve(__dirname, tmpFileName)});
  }, 4000);
});

// App listening on port 3000
app.listen(3000, function() {
  console.log("App started on port 3000")
});