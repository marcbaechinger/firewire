var fs = require('fs');

var outputFilename;

// read existing file and append current gamestep
var readAndWriteToExistingFile = function(gamestep) {
	fs.readFile(outputFilename, function(err, data) {
		if (err) {
			console.log(err);
		} else {
			gamesteps = JSON.parse(data);
			writeToNewFile(gamestep);
		}
	});
}
// add current gamestep to gamesteps array and write array into file
var writeToNewFile = function(gamestep) {
	gamesteps.push(gamestep);
	fs.writeFile(outputFilename, JSON.stringify(gamesteps, null, 4), function(err) {
		if (err) {
			console.log(err);
		}
	});
}
var saveGamestep = function(gamestep) {
	outputFilename = __dirname + "/storage/games/" + "gamesteps_" + gamestep.id + ".json";
	fs.exists(outputFilename, function(exists) {
		if (exists) {
			readAndWriteToExistingFile(gamestep);
		} else {
			writeToNewFile(gamestep);
		}

	});
}

module.exports = {
	saveGamestep : saveGamestep
}; 