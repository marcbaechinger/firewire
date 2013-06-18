var fs = require('fs');

// path to public storage folder
const __path = __dirname + "/public/storage";
const __indexPath = __path + "/index.json";

// array containing steps for a single given game
var steps = new Array();
// array containing a summary of final steps
var index = new Array();

// read existing file and append current step
var updateStepToFile = function(filePath, step) {
	fs.readFile(filePath, function(err, data) {
		if (err) {
			console.log(err);
		} else {
			steps = JSON.parse(data);
			writeStepToFile(filePath, step);
		}
	});
}
// add current step to steps array and write array into file
var writeStepToFile = function(filePath, step) {
	steps.push(step);
	fs.writeFile(filePath, JSON.stringify(steps, null, 4), function(err) {
		if (err) {
			console.log(err);
		}
	});
}
var saveStep = function(step) {
	var filePath = __path + "/games/steps_" + step.id + ".json";
	fs.exists(filePath, function(exists) {
		if (exists) {
			updateStepToFile(filePath, step);
		} else {
			writeStepToFile(filePath, step);
		}

	});
	// add step to index if type is game-complete or failure
	switch (step.type) {
		case "game-complete":
		case "failure":
			writeFinalStepToIndex(step);
			break;
		default:
			break;
	}
}
var writeFinalStepToIndex = function(step) {
	index.push(step);
	fs.writeFile(__indexPath, JSON.stringify(index, null, 4), function(err) {
		if (err) {
			console.log(err);
		}
	});
}
var readFileToIndex = function() {
	fs.exists(__indexPath, function(exists) {
		if (exists) {
			fs.readFile(__indexPath, function(err, data) {
				if (err) {
					console.log(err);
				} else {
					index = JSON.parse(data);
				}
			});
		}
	});
}

var getIndex = function(){
	return index;
}

module.exports = {
	saveStep : saveStep,
	readFileToIndex : readFileToIndex,
	getIndex : getIndex
};
