var phantom = require('phantom');
var extend = require('extend');

var render = function(url, filename, reportData, config) {

  // Variables
  var sitepage = null;
  var phInstance = null;
  var reportData = reportData;

  var defaultConfig = {
    // Options type: "viewportSize" and "paperSize"
    view: {
      type: "paperSize",
      size: {
        format: 'A4',
        orientation: 'portrait',
        margin: '1cm'
      }
    },
    file: {
      format: 'pdf',
      quality: '100'
    },
    // Change timeout as required to allow sufficient time 
    renderTime: 2000
  }

  // Merge defaultConfig with function parameter config (if it exists)
  var config = config ? extend(defaultConfig, config) : defaultConfig;

  // Create new Promise for the render process
  var promise = new Promise(

    function(resolve, reject) {

      phantom.create()
      .then(instance => {
        // After instance is created

        // Assign to function scope
        phInstance = instance;

        // Create a page object and return the promise
        return instance.createPage();
      })
      .then(page => {
        // After page is created              

        // Assign to function scope
        sitepage = page;

        // Set the layou properties
        sitepage.property(config.view.type, config.view.size);

        // Doesn't actually open any page
        sitepage.setContent("", url);

        sitepage.evaluate(function(reportData) {

          // Clear sessionStorage
          sessionStorage.clear();

          // Populate sessionStorage with reportData
          sessionStorage.setItem("reportData", reportData);
        }, reportData);

        // Open the page and return the promise
        return sitepage.open(url);
      })
      .then(status => {

        // Check the status
        if (status !== 'success') {

          reject('Unable to load the address!');
          phantom.exit();
        } else {

          // Read: https://github.com/ariya/phantomjs/issues/11084
          setTimeout(function () {

            // Render page with render config
            sitepage.render(filename, config.file);

            // Close streams
            sitepage.close();
            phInstance.exit();

            // Resolve promise
            resolve();
          }, config.renderTime); 
        }
      })
      .catch(error => {

        phInstance.exit();
        reject(error);
      });

    }); 

  return promise;
}

exports.render = render;