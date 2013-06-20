ResultApp.controller('ResultController', function($scope, Result, gamestepper) {
	$scope.results = Result.findAllGames();
	gamestepper.registerNewGameAvailable($scope, function(gamestep) {
		$scope.results = Result.findAllGames();
		$scope.lastCompletedGame = game;
	});
});

ResultApp.controller('ResultDetailController', function($scope, $routeParams, Result) {
	$scope.params = $routeParams;
	$scope.gamesteps = Result.findGamesteps($routeParams.gameId);
	$scope.gamesteps.$then(function(httpResponse) {
		$scope.player = $scope.gamesteps[0].player;
	});
});
