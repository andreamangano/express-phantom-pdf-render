var express = require("express");
var tmp = require('tmp');
var renderPdf = require('./renderPdf.js');

// Create a router for a subapp API
var api = express.Router();

// Generate PDF
api.get("/generatepdf/:url", function(req, res) {

  var url = req.params.url;

  var url = "http://localhost:3000";

  // TODO: Check if url is a valid url (by regex)
  // https://regex.wtf/url-matching-regex-javascript/
  // add condition

  if(false) {

    // Return a bad request status code
    res.status(400);

    // Return a json with the error description
    res.json({ error: "Bad url format"});
    return;
  }

  var tmpFileName = './temp/'+tmp.tmpNameSync()+'.pdf';
  renderPdf.render(url, tmpFileName);
  //.then(function () {console.log('ciao');});

  //- TODO: occorre gestire il download a fine del processo di render


  // Read: https://github.com/ariya/phantomjs/issues/11084
  setTimeout(() => { 

    // Return an OK status code
    res.status(200);

    // Download the generated pdf file
    res.download(tmpFileName, 'report.pdf');
  }, 3000);

});

module.exports = api;