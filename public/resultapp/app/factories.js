ResultApp.factory('Result', function($resource) {
	var Result = $resource('/api/games/:gameId', {}, {});

	Result.findAllGames = function() {
		return Result.query();
	};
	Result.findGamesteps = function(id) {
		return Result.query({gameId:id});
	};

	return Result;
});