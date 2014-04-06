ResultApp.controller('MainController', function($scope) {
	$scope.liveScrollingOn = true;
	
	$scope.fullscreen = function toggleFullScreen() {
		var div = document.documentElement;
		if (document.fullScreenElement || window.fullScreen) {
			if (div.exitFullscreen) {
				div.exitFullscreen();
			} else if (div.mozCancelFullScreen) {
				div.mozCancelFullScreen();
			} else if (div.msRequestFullscreen) {
				div.webkitExitFullscreen();
			} else if (div.requestFullscreen) {
				div.webkitExitFullscreen(); 
			}
		} else if (div.webkitRequestFullscreen) {
			div.webkitRequestFullscreen();
		} else if (div.mozRequestFullScreen) {
			div.mozRequestFullScreen();
		} else if (div.msRequestFullscreen) {
			div.msRequestFullscreen();
		} else if (div.requestFullscreen) {
			div.requestFullscreen(); 
		}
	};
});

ResultApp.controller('ResultController', function($scope, Result, gamestepper) {
	$scope.results = Result.findAllGames();
	gamestepper.registerNewGameAvailable($scope, function(game) {
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
