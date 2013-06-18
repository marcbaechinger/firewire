var resultAppConfig = function($routeProvider, $locationProvider) {
	$locationProvider.hashPrefix('!');
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
		templateUrl : 'partials/results/detail.html',
		activeTab : 'results',
		
	})
	.otherwise({redirectTo: '/'});
}

ResultApp.config(resultAppConfig);