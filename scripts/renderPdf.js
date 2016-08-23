var phantom = require('phantom');
var Promise = require("es6-Promise").Promise;

var render = function(url, filename) {

  // Variables
  var sitepage = null;
  var phInstance = null;

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

    // Open the page
    return page.open(url);
  })
  .then(status => {

    // Check the status
    if (status !== 'success') {
      //console.log('Unable to load the address!');
      phantom.exit();
    } else {
      sitepage.render(filename, {format: 'pdf', quality: '100'});
      sitepage.close();
      phInstance.exit();
    }
  });
  // .catch(error => {
  //   // console.log(error);
  //   phInstance.exit();
  // });
}

exports.render = render;