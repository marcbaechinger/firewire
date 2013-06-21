var fs = require('fs');

// path to public storage folder
const __path = __dirname + "/public/storage";
const __indexPath = __path + "/index.json";

// array containing steps for a single given game
var steps = new Array();
// array containing a summary of final steps
var index = new Array();

var getGameFilePath = function(gameId) {
	return __path + "/games/steps_" + gameId + ".json";
};

var saveIndexFile = function() {
	fs.writeFile(__indexPath, JSON.stringify(index, null, 4), function(err) {
		if (err) {
			console.log(err);
		}
	});
};

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
var saveStep = function(step, completedCallback) {
	var filePath = getGameFilePath(step.id);
	fs.exists(filePath, function(exists) {
		if (exists) {
			updateStepToFile(filePath, step);
		} else {
			steps = [];
			writeStepToFile(filePath, step);
		}

	});
	// add step to index if type is game-complete or failure
	switch (step.type) {
		case "game-complete":
		case "failure":
			writeFinalStepToIndex(step, completedCallback);
			break;
		default:
			break;
	}
}
var deleteGame = function(gameId, callback) {
	var filePath = getGameFilePath(gameId);
	fs.exists(filePath, function(exists) {
		if (exists) {
			fs.unlink(filePath, function(err) {
				if (err) {
					callback(err);
				} else {
					index.forEach(function(game, idx) {
						if (game.id === gameId) {
							index.splice(idx, 1);
						}
					});
					saveIndexFile();
					callback();
				}
			});
		}
	});
};
var writeFinalStepToIndex = function(step, completedCallback) {
	index.push(step);
	saveIndexFile();
	getSortedGameById(step.id, function(game) {
		completedCallback(game);
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
var getAllSortedGames = function(callback) {
	var gamesSorted = index;
	gamesSorted.sort(function(gameA, gameB) {
		var typeCompare = gameB.type.localeCompare(gameA.type);
		if (typeCompare != 0) {
			return typeCompare;
		} else {
			return gameB.duration < gameA.duration;
		}
	});

	gamesRanked = gamesSorted.map(function(game, index) {
		game.rank = index + 1;
		return game;
	});

	callback(gamesRanked);
}
var getAllGamesteps = function(gameId, callback) {
	var filePath = __path + "/games/steps_" + gameId + ".json";
	var data = fs.readFileSync(filePath);
	var gamesteps = JSON.parse(data);
	callback(gamesteps);
}
var getSortedGameById = function(gameId, callback) {
	getAllSortedGames(function(games) {
		var game = games.filter(function (item) {
		return item.id === gameId;
		})[0];
		callback(game);
	});
}

module.exports = {
	saveStep : saveStep,
	deleteGame : deleteGame,
	readFileToIndex : readFileToIndex,
	getAllSortedGames : getAllSortedGames,
	getAllGamesteps : getAllGamesteps,
};
