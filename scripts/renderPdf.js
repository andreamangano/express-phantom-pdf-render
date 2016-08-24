var phantom = require('phantom');

// TODO: make function more generic passing config parameter

var render = function(url, filename, reportData) {

  // Variables
  var sitepage = null;
  var phInstance = null;
  var reportData = reportData;

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
    sitepage.property('viewportSize', {
      width: 1024,
      height: 768
    });

    // Doesn't actually open any page
    sitepage.setContent("", url);

    var evaluateFunc = function() {

      // TODO: set reportData into localStorage
      // // Clear previous reportData
      // localStorage.removeItem("reportData");

      // // Set new reportData
      // localStorage.setItem("reportData", reportData);
    }

    // Set the sitepage scope
    //evaluateFunc.apply(sitepage);

    sitepage.evaluate(evaluateFunc);

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

        sitepage.render(filename, {format: 'pdf', quality: '100'});
        sitepage.close();
        phInstance.exit();
      }, 2000); // Change timeout as required to allow sufficient time 
    }
  });
  // .catch(error => {
  //   // console.log(error);
  //   phInstance.exit();
  // });
}

exports.render = render;