var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.get('/scrape', function(req, res){

  //All the web scraping magic will happen here
  url = 'http://fairandsimple.com/shop/direct/accessories';

  // The structure of our request call
  // The first parameter is our URL
  // The callback function takes 3 parameters, an error, response status code and the html

  request(url, function(error, response, html){

      // First we'll check to make sure no errors occurred when making the request

      if(!error){
          // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

          var $ = cheerio.load(html);

          // Finally, we'll define the variables we're going to capture

          var imageURL, productURL, productName, pageTitle, productPrice, productDescription;
          var json = { imageURL : "", productURL : "", productName : "", pageTitle : "", productPrice : "", productDescription : ""};

          // We'll use the unique header class as a starting point.

          $('.product-box').filter(function(){

         // Let's store the data we filter into a variable so we can easily see what's going on.

              var data = $(this);

         // In examining the DOM we notice that the title rests within the first child element of the header tag.
         // Utilizing jQuery we can easily navigate and get the text by writing the following code:

              imageURL = data.children().first().next().attr('src');
              productURL = data.children().last().attr('href');
              productPrice = data.children().last().text();
              productName = data.children().first().next().next().text();

         // Once we have our title, we'll store it to the our json object.

             json.imageURL = imageURL;
             json.productURL = productURL;
             json.productPrice = productPrice;
             json.productName = productName;
     })
  }

// To write to the system we will use the built in 'fs' library.
// In this example we will pass 3 parameters to the writeFile function
// Parameter 1 :  output.json - this is what the created filename will be called
// Parameter 2 :  JSON.stringify(json, null, 4) - the data to write, here we do an extra step by calling JSON.stringify to make our JSON easier to read
// Parameter 3 :  callback function - a callback function to let us know the status of our function

fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){

    console.log('File successfully written! - Check your project directory for the output.json file');

})

// Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
res.send('Check your console!')

    }) ;
})

app.listen('8080')

console.log('Magic happens on port 8080');

exports = module.exports = app;
