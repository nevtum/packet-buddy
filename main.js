
var decoder = require('./decoder');
var fs = require('fs');
var analyzeconfigs = require('./analyzeconfigs')

var contents = fs.readFileSync('datablocks.txt', 'utf8').toString();
// console.log(contents);

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