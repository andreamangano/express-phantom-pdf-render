var express = require("express");
var tmp = require('tmp');
var validUrl = require('valid-url');
var renderPdf = require('./renderPdf.js');

// Create a router for a subapp API
var api = express.Router();

// Generate PDF
api.get("/generatepdf", function(req, res) {

  var url = req.query.url;

  // Check if the url format is valid
  if(!validUrl.isUri(url)) {

    // Return a bad request status code
    res.status(400);

    // Return a json with the error description
    res.json({ error: "Bad url format"});
    return;
  }

  var tmpFileName = './temp/'+tmp.tmpNameSync()+'.pdf';
  renderPdf.render(url, tmpFileName);

  // Read: https://github.com/ariya/phantomjs/issues/11084
  setTimeout(() => { 

    // Return an OK status code
    res.status(200);

    // Download the generated pdf file
    res.download(tmpFileName, 'report.pdf');
  }, 3000);

});

module.exports = api;