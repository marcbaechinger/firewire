var redis = require('redis');

const __overviewKeyPrefix = "overview_";
const __indexKey = "firewireIndexKey";

// init RedisClient
var client = redis.createClient(19477, "pub-redis-19477.us-east-1.1.azure.garantiadata.com");
client.auth("firewire69", redis.print);

// WrapperHelper for DB
var getRedisValue = function(key, successCallback) {

	client.get(key, function(err, res) {

		if (err) {
			console.log(err);
		} else {
			successCallback(res);
		}
	});
}
var readFileToIndex = function() {

};

var appendStepToGame = function(game, step) {
	game.push(step);
	client.set(step.id, JSON.stringify(game, null, 4), redis.print);
}
var saveStep = function(step, completedCallback) {

	getRedisValue(step.id, function(gameAsJSONString) {
		if (gameAsJSONString != null) {
			var game = JSON.parse(gameAsJSONString);
			appendStepToGame(game, step);
		} else {
			appendStepToGame(new Array(), step);
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
var writeFinalStepToIndex = function(step, completedCallback) {

	// load index aggregate, insert and sort
	getAllSortedGames(function(sortedGameOverviews) {

		sortedGameOverviews.push(step);
		sortedGameOverviews = sortGames(sortedGameOverviews);
		var indexAsStringArray = sortedGameOverviews.map(function(item) {
			return __overviewKeyPrefix + item.id;
		});
		client.set(__indexKey, indexAsStringArray.join(","), redis.print);

		client.set(__overviewKeyPrefix + step.id, JSON.stringify(step, null, 4), redis.print);
		var index = sortedGameOverviews.indexOf(step);
		step.rank = index + 1;
		completedCallback(step);
	});
}
var sortGames = function(games) {
	var gamesSorted = games;
	gamesSorted.sort(function(gameA, gameB) {
		var typeCompare = gameB.type.localeCompare(gameA.type);
		if (typeCompare != 0) {
			return typeCompare;
		} else {
			return gameB.duration < gameA.duration;
		}
	});
	return gamesSorted;
}
var getAllSortedGames = function(callback) {

	getRedisValue(__indexKey, function(indexArrayAsString) {

		// Check if return Value empty
		if (!indexArrayAsString) {
			callback(new Array());
			return;
		}

		var indexAsStringArray = indexArrayAsString.split(",");

		client.mget(indexAsStringArray, function(err, sortedGameOverviews) {

			if (err) {
				console.log(err);
				return;
			}

			var gamesRanked = sortedGameOverviews.map(function(gameOverviewAsJSONString, index) {
				var gameOverview = JSON.parse(gameOverviewAsJSONString);
				gameOverview.rank = index + 1;
				return gameOverview;
			});

			callback(gamesRanked);
		});
	});
}
var getAllGamesteps = function(gameId, callBack) {

	getRedisValue(gameId, function(gameAsJSONString) {
		var game = JSON.parse(gameAsJSONString);
		callBack(game);
	});
}
var deleteGame = function(gameId, callback) {

	client.del(gameId);
	client.del(__overviewKeyPrefix + gameId);

	getRedisValue(__indexKey, function(indexArrayAsString) {
		var indexAsStringArray = indexArrayAsString.split(",");
		var index = indexAsStringArray.indexOf(__overviewKeyPrefix + gameId);
		indexAsStringArray.splice(index, 1);
		client.set(__indexKey, indexAsStringArray.join(","), callback);
	});
};

var getSortedGameById = function(gameId, callback) {

	getRedisValue(__indexKey, function(indexArrayAsString) {
		var indexAsStringArray = indexArrayAsString.split(",");
		var rank = indexAsStringArray.indexOf(__overviewKeyPrefix + gameId) + 1;
		getRedisValue(__overviewKeyPrefix + gameId, function(gameOverviewAsJSONString) {
			var gameOverview = JSON.parse(gameOverviewAsJSONString);
			gameOverview.rank = rank;
			callback(gameOverview);
		});
	});
}

module.exports = {
	readFileToIndex : readFileToIndex,
	deleteGame : deleteGame,
	saveStep : saveStep,
	getAllSortedGames : getAllSortedGames,
	getAllGamesteps : getAllGamesteps,
};
