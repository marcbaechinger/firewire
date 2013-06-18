ResultApp.factory('ResultService', function($resource) {
	var Result = $resource('/api/games/:gameId', {}, {});

	Result.findAllGames = function() {
		return Result.query();
	};
	Result.findGameById = function(id) {
		return Result.get({ gameId : id });
	};

	return Result;
});