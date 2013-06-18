ResultApp.controller('NavigationController', function($scope, $route) {
	$scope.$route = $route;
});

ResultApp.controller('ResultController', function($scope, Result) {
	$scope.results = Result.findAllGames();
	$scope.getGamesteps = function(gameId) {
		$scope.gamesteps = Result.findGamesteps(gameId);
	}
});

