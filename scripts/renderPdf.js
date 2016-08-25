var phantom = require('phantom');
var extend = require('extend');
// TODO: make function more generic passing config parameter

var render = function(url, filename, reportData, config) {

  // Variables
  var sitepage = null;
  var phInstance = null;
  var reportData = reportData;

  var defaultConfig = {
    viewportSize: {
      width: 1024,
      height: 768
    },
    render: {
      format: 'pdf',
      quality: '100'
    },
    // Change timeout as required to allow sufficient time 
    renderTime: 2000
  }

  // Merge defaultConfig with function parameter config (if it exists)
  var config = config ? extend(defaultConfig, config) : defaultConfig;

  // Create the Phantom instance
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

    // TODO: set the layout properties
    // Set the layou properties
    sitepage.property('viewportSize', config.viewportSize);

    // Doesn't actually open any page
    sitepage.setContent("", url);

    sitepage.evaluate(function(reportData) {

      // Clear localStorage
      localStorage.clear();

      // Populate localstorage with reportData
      localStorage.setItem("reportData", reportData);
    }, reportData);

    // Open the page and return the promise
    return sitepage.open(url);
  })
  .then(status => {

    // Check the status
    if (status !== 'success') {
      //console.log('Unable to load the address!');
      phantom.exit();
    } else {

      setTimeout(function () {

        // Render page with render config
        sitepage.render(filename, config.render);

        // Close streams
        sitepage.close();
        phInstance.exit();
      }, config.renderTime); 
    }
  });
  // .catch(error => {
  //   // console.log(error);
  //   phInstance.exit();
  // });
}

exports.render = render;