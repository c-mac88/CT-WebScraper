var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

app.get('/scrape', function(req, res) {

    url = 'https://origin-web-scraping.herokuapp.com/';

    request(url, function(error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);

            var name, author, imageUrl;
            var json = { name: "", imageUrl: "", price: "", };

            // We'll use the unique header class as a starting point.

            $('.panel-heading').each(function(i, element) {
                var data = $(this);
                //.prev();
                name = data.text().trim();
                json.name = name;
            })

            $('.panel-body').each(function(i, element) {
                var data = $(this);

                imageUrl = data.children().first().attr('src');
                price = data.children().last().text();

                json.imageUrl = imageUrl;
                json.price = price;
            })

            // To write to the system we will use the built in 'fs' library.
            // In this example we will pass 3 parameters to the writeFile function
            // Parameter 1 :  output.json - this is what the created filename will be called
            // Parameter 2 :  JSON.stringify(json, null, 4) - the data to write, here we do an extra step by calling JSON.stringify to make our JSON easier to read
            // Parameter 3 :  callback function - a callback function to let us know the status of our function
        }

        fs.appendFile('output.json', JSON.stringify(json, null, 4), { 'flag': 'a' }, function(err) {
                   console.log('File write success!');
               })



        // Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
        res.send('Check your console!')

    })

});

app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;
