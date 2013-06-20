ResultApp.controller('ResultController', function($scope, Result, gamestepper) {
	$scope.results = Result.findAllGames();
	gamestepper.register($scope, function(gamestep) {
		if(gamestep.type == "game-complete" || gamestep.type == "failure"){
			$scope.results = Result.findAllGames();
		}
	});
	
	gamestepper.registerGameRankAvailable($scope, function(game) {
		$scope.lastCompletedGame = game;
	});
});

ResultApp.controller('ResultDetailController', function($scope, $routeParams, Result) {
	$scope.params = $routeParams;
	$scope.gamesteps = Result.findGamesteps($routeParams.gameId);
	$scope.gamesteps.$then(function(httpResponse){
		$scope.player = $scope.gamesteps[0].player;
	});
});
