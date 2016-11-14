var zcta = require("us-zcta-counties");
var zipcodes = require('zipcodes');
var google = require('google')

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('What is your zip code? ', (answer) => {
  // TODO: Log the answer in a database
  
  var county = zcta.find({zip: answer}).county;
  var city = zipcodes.lookup(answer).city;

  console.log(
  	"Your county is: " 	+ county + "\n" +
  	"Your city is: " 	+ city
  	);
 
google(county + " Meeting Calendar" , function (err, res){
  if (err) console.error(err)
 
  for (var i = 0; i < 5; ++i) { 
    var link = res.links[i];
    console.log(link.title + ' - ' + link.href)
  }
 
})
{
  rl.close();
}
});

	
	