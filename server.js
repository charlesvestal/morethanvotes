var http = require('http');
var fs = require('fs');
var formidable = require("formidable");
var util = require('util');
var google = require('google');
var zipcodes = require('zipcodes');
var zcta = require("us-zcta-counties");
var express = require('express'); 
var bodyParser = require('body-parser');
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

var app = express();

app.use(express.static('public'))

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());


app.post("/", function (req, res) {
    var data = req.body;
    findCountyAndState(data, res) 
});


function findCountyAndState(data, res) {

var zipcode = data.zipcode;

if(zipcodes.lookup(zipcode)){

    var dataType = data.dataType;
    var city = zipcodes.lookup(zipcode).city;
    var state = zipcodes.lookup(zipcode).state;
    var county = zcta.find({zip: zipcode}).county;

    if(state == "OR")
        { state = "Oregon"; }

    console.log("zipcode:"    + zipcode);
    console.log("city: "      + zipcodes.lookup(zipcode).city);
    console.log("state: "     + zipcodes.lookup(zipcode).state);  


    if(dataType == "city") {
        var searchPhrase = city + " " + state  + " " + 
        "City Council Calendar";
    }
    if(dataType == "county") {
        var searchPhrase = county + " " + state  + " " + 
        "Council Calendar";
    }

    console.log(searchPhrase);
    searchFor(searchPhrase, res);
    
}

else
    {
    var searchPhrase = data.zipcode + " " + 
        "Meetings Calendar";

    console.log(searchPhrase);
    searchFor(searchPhrase, res);
} 	
}


function searchFor(searchPhrase, res) {

    google(searchPhrase, function (err, gRes){
      
      if (err) logger.info(err)
   
        var url = gRes.links[0].href;
       
        console.log("url: " + url);
        res.redirect(url);
    
        res.end();
 
});
}

app.listen(1185);
console.log("server listening on 1185");