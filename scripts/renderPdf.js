var phantom = require('phantom');
var extend = require('extend');

var render = function(url, filename, reportData, config) {

  // Variables
  var sitepage = null;
  var phInstance = null;
  var reportData = reportData;

  var defaultConfig = {
    paperSize: {
      format: 'A2',
      orientation: 'portrait',
      margin: '0'
    },
    viewportSize: {
      width: '960px'
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

        // Set the layout properties
        sitepage.property('paperSize', config.paperSize);
        sitepage.property('viewportSize', config.viewportSize);

        // Doesn't actually open any page
        sitepage.setContent("", url);

        sitepage.evaluate(function(reportData) {

          // Populate sessionStorage with reportData
          sessionStorage.setItem("reportData", JSON.stringify(reportData));

          var ziocane = reportData;
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
            try {            
              sitepage.render(filename, config.file);
            }
            catch(error) {
              reject(error);
            }

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