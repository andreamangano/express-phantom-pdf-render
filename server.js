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

// Load external app settings
var appSettings = require('./settings/app-settings.js');

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

  // TODO: improve with path resolve
  var tmpFileName = appSettings.tempFolder+tmp.tmpNameSync()+'.pdf';

  var promise = renderPdf.render(url, '.'+tmpFileName, reportData);

  promise.then(

    function() {

      // Return an OK status code
      res.status(200);

      // Return the relative path to file
      res.json({ path: tmpFileName});
    })
  .catch(
    function(error) {

      // Return a server error
      res.status(500);

      // Return a json with the error description
      res.json("Server error");
    }
  );
});

// Hide the path to final user
appRouter.get("/download-pdf/:filepath", function(req, res, params) {
  
  try {

    // Renamed the requested file e download it
    res.download('.'+req.params.filepath,"report.pdf");
  } catch(error) {

    res.status(404);
    res.json(error);
  }
});

// App listening on port 3000
app.listen(3000, function() {
  console.log("App started on port 3000")
});