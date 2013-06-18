ResultApp.controller('NavigationController', function($scope, $route) {
	$scope.$route = $route;
});

ResultApp.controller('ResultController', function($scope, ResultService) {
	$scope.results = ResultService.findAllGames();
});

