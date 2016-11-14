var http = require('http');
var fs = require('fs');
var formidable = require("formidable");
var util = require('util');
var google = require('google');
var zipcodes = require('zipcodes');

  var winston = require('winston');

  
  require('winston-papertrail').Papertrail;

  var winstonPapertrail = new winston.transports.Papertrail({
    host: 'logs.papertrailapp.com',
    port: 29959
  })

  winstonPapertrail.on('error', function(err) {
    // Handle, report, or silently ignore connection errors and failures
  });

  var logger = new winston.Logger({
    transports: [winstonPapertrail]
  });



var server = http.createServer(function (req, res) {
    if (req.method.toLowerCase() == 'get') {
        displayForm(res);
    } else if (req.method.toLowerCase() == 'post') {
        processAllFieldsOfTheForm(req, res);
    }

});


function displayForm(res) {
    fs.readFile('form.html', function (err, data) {
        res.writeHead(200, {
            'Content-Type': 'text/html',
                'Content-Length': data.length
        });
        res.write(data);
        res.end();
    });
}

function zipCodeNotFound(res) {
     res.writeHead(200, {
            'Content-Type': 'text/html',
               
        });
        res.write("<p>Zip code not found. Sorry!</p>");
        res.end();
}


function findCountyAndState(data, res) {

var zipcode = data.zipcode;

if(zipcodes.lookup(zipcode)){
    var city = zipcodes.lookup(zipcode).city;
    var state = zipcodes.lookup(zipcode).state;
    if(state == "OR")
        { state = "Oregon"; }


    // logger.info("zipcode:"    + zipcode);
    // logger.info("city: "      + zipcodes.lookup(zipcode).city);
    // logger.info("state: "     + zipcodes.lookup(zipcode).state);  

    var searchPhrase = city + " " + state  + " " + 
        "City Council Calendar";

    google(searchPhrase, function (err, gRes){
      
      if (err) logger.info(err)
    
   
        var url = gRes.links[0].href;
       
        logger.info("url: " + url);

        res.writeHead(302, {
          'Location': url
        });
        res.end();
 
});
}
else
    {
        zipCodeNotFound(res);
}
  	

}


function processAllFieldsOfTheForm(req, res) {
    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
       findCountyAndState(fields, res);
    });
}

server.listen(1185);
console.log("server listening on 1185");