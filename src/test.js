
var decoder = require('./xseries/decoder');
var fs = require('fs');
var analyzeconfigs = require('./xseries/analyzeconfigs');

var contents = fs.readFileSync('datablocks.txt', 'utf8').toString();

var handler = function(error, xpacket) {
	if (error) {
		console.log(error);
	}
	else {
		var json = JSON.stringify(xpacket.asJson(), null, 2)
		console.log(json);
		analyzeconfigs.record(xpacket.asJson());
	}
}

decoder.parse(contents, handler)

// console.log(analyzeconfigs.BCVsFound());
// console.log(analyzeconfigs.RTPsFound());