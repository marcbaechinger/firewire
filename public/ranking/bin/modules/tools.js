(function (global) {
	var indexFile = "/index.json",
		stepBase = "/games/steps_",
		jsonPostfix = ".json",
		removeCheaters = function (games) {
			return games.filter(function (game) {
				if (game.id === "B6578C05-D251-407A-AEA5-D2B97D684A5B") {
					// corrupt file; seems to be caused by a bug 
					// (Player 'Vince' started about 20 games in 
					// some millisecs (2013-09-27T09:55:17.601Z))
					return false;
				} else if (game.player === "Bmu") {
					// remove ben
					return false;
				} else if (game.type === "game-complete" && game.duration < 30) {
					return false;
				}
				return true;
			});
		},
		merge = function (dir, games) {
			return games.map(function (game) {
				var path = dir + stepBase + game.id + jsonPostfix;
			
				game.score = 0;
				try {
					delete game.image;
					game.steps = require(path).map(function (step) {
						if (step.type === "milestone-1" && game.score < 1) {
							game.score = 1;
						} else if (step.type === "milestone-2" && game.score < 2) {
							game.score = 2;
						} else if (step.type === "milestone-3" && game.score < 3) {
							game.score = 3;
						} else if (step.type === "game-complete") {
							game.score = 4;
						}
					
						delete step.image;
						delete step.id;
						delete step.player;
						delete step.timestamp;
						return step;
					});
					return game;
				} catch (err) {
					console.error(err);
					errCount++;
				}
				return game;
			});
		},
		rank = function (games) {
			return games.sort(function (a, b) {
				if (a.type === "failure" && b.type === "game-complete") {
					return 1;
				} else if (a.type === "game-complete" && b.type === "failure") {
					return -1;
				} else if (a.score !== b.score) {
					return b.score - a.score;
				} else {
					return a.duration - b.duration;
				}
			});
		},
		analyse = function (path) {
			var stats = require( path + indexFile)
				.reduce(function (stats, game) {
						stats.count++;
						if (game.type === "failure") {
							stats.failureCount++;
							stats.failureDuration += game.duration;
						} else {
							stats.successCount++;
							stats.successDuration += game.duration;
						}
						stats.totalDuration += game.duration;
						return stats;
					},
					{
						count: 0,
						failureCount: 0,
						successCount: 0,
						totalDuration: 0,
						failureDuration: 0,
						successDuration: 0
					}
				);
	
			stats.averageDuration = stats.totalDuration / stats.count;
			stats.averageFailureDuration = stats.failureDuration / stats.failureCount;
			stats.averageSuccessDuration = stats.successDuration / stats.successCount;
			return stats;
		};

		global.transform = function (path) {
			return rank(
				merge(path, 
					removeCheaters(
						require(path + indexFile)
					)
				)
			)
		};
		
		global.stats = analyse;
}(this));
