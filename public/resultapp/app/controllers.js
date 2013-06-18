ResultApp.controller('NavigationController', function($scope, $route) {
	$scope.$route = $route;
});

ResultApp.controller('ResultController', function($scope, $routeParams, Result, gamestepper) {
	$scope.params = $routeParams;
	$scope.showDetailModal = function(modalId, gameId) {
		$scope.gamesteps = Result.findGamesteps(gameId);
		$(modalId).modal();
	}
	$scope.results = Result.findAllGames();
	gamestepper.register($scope, function(gamestep) {
		$scope.results = Result.findAllGames();
	});
});

// COMMIT