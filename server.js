var http = require('http');
var fs = require('fs');
var formidable = require("formidable");
var util = require('util');
//var zcta = require("us-zcta-counties");
var zipcodes = require('zipcodes');


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


function findCountyAndState(data, res) {

	var zipcode = data.zipcode;
	console.log(zipcode);
// 	var county = zcta.find({zip: zipcode}).county;
  	var city = zipcodes.lookup(zipcode).city;


    res.writeHead(302, {
      'Location': ' https://duckduckgo.com/?q=!ducky+' + city + " City Council Meetings"
    });
    res.end();

}


function processAllFieldsOfTheForm(req, res) {
    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
       findCountyAndState(fields, res);
    });
}

server.listen(1185);
console.log("server listening on 1185");