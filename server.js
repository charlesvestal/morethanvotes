var http = require('http');
var fs = require('fs');
var formidable = require("formidable");
var util = require('util');
var zcta = require("us-zcta-counties");
var zipcodes = require('zipcodes');
var google = require('google')


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
 	var county = zcta.find({zip: zipcode}).county;
  	var city = zipcodes.lookup(zipcode).city;

  res.writeHead(200, {
            'content-type': 'text/html'
        });
        
        res.write("For your zipcode " + zipcode +": </br> </br>");

		google(county + " Meeting Calendar" , function (err, gRes){
		  if (err) console.error(err)
		 
		  for (var i = 0; i < 5; ++i) { 
		    var link = gRes.links[i];
		  
		     res.write("<a href=" + link.href + ">" + link.title + "</a> <br/>")
		  
		  }
		 
		 res.end();
		})

        

}


function processAllFieldsOfTheForm(req, res) {
    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
       findCountyAndState(fields, res);

        //Store the data from the fields in your data store.
        //The data store could be a file or database or any other store based
        //on your application.
        // res.writeHead(200, {
        //     'content-type': 'text/plain'
        // });
        // res.write('received the data:\n\n');
        // res.end(util.inspect({
        //     fields: fields,
        //     files: files
        // }));
    });
}

server.listen(1185);
console.log("server listening on 1185");