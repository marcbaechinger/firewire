ResultApp.controller('NavigationController', function($scope, $route) {
	$scope.$route = $route;
});

ResultApp.controller('ResultController', function($scope, Result, gamestepper) {
	$scope.results = Result.findAllGames();
	gamestepper.register($scope, function(gamestep) {
		if(gamestep.type == "game-complete" || gamestep.type == "failure"){
			$scope.results = Result.findAllGames();
		}
	});
});

ResultApp.controller('ResultDetailController', function($scope, $routeParams, Result) {
	$scope.params = $routeParams;
	$scope.gamesteps = Result.findGamesteps($routeParams.gameId);
});
