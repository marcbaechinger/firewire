'use strict';

/* Directives */


angular.module('myApp.directives', []).
  directive('captureGameKeys', function() {
	var lastProcessed = 0,
		isReady = function () {
			var now = (new Date()).getTime(),
				lag = now - lastProcessed;
				
			if (lag > 1200) {
				lastProcessed = now;
				return true;
			}
			return false;
		},
		keys = {
		37: function left($scope) {
			console.log("left arrow key");
			$scope.milestone1();
		},
		38: function up($scope) {
			console.log("up arrow key");
			$scope.milestone2();
		},
		39: function right($scope) {
			console.log("right arrow key");
			$scope.milestone3();
		},
		40: function down($scope) {
			console.log("down arrow key");
			$scope.wireContact();
		},
		32: function space($scope) {
			$scope.challengeEnd();
		}
	}; 
    return function($scope, elm, attrs) {
		document.addEventListener("keydown", function (ev) {
			if (keys[ev.which]) {
				ev.preventDefault();
				if ($scope.model.challengeStarted && !$scope.model.challengeCompleted && isReady()) {
					$scope.$apply(function () {
						keys[ev.which].call(undefined, $scope);	
					});
				}
			}
		}, false);
		
		document.addEventListener("click", function (ev) {
			console.log("$scope.model.gameStarted", $scope.model.gameStarted);
			console.log("$scope.model.challengeStarted", $scope.model.challengeStarted);
			if ($scope.model.gameStarted && !$scope.model.challengeStarted && isReady()) {
				ev.preventDefault();
				$scope.challengeStart();
			}
		}, false);
    };
  }).
  directive('resetChallenge', function() {
    return function($scope, elm, attrs) {
		elm.bind("click", function (ev) {
			ev.stopPropagation();
			ev.preventDefault();
			$scope.$apply(function () {
				$scope.resetChallenge();	
			});
		});
    };
  });
