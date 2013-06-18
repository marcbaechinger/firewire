var resultAppConfig = function($routeProvider) {
	$routeProvider.when('/', {
		controller : 'ResultController',
		templateUrl : 'partials/results/overview.html',
		activeTab : 'results'
	})
	.when('/results', {
		controller : 'ResultController',
		templateUrl : 'partials/results/overview.html',
		activeTab : 'results'
	})
	.when('/results/:gameId', {
		controller : 'ResultDetailController',
		templateUrl : 'partials/restults/detail.html',
		activeTab : 'results',
	})
}

ResultApp.config(resultAppConfig);