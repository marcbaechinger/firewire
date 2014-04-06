'use strict';

angular.module('pushbutton.directives', []).
	directive('startGame', ["gamestepper", function(gamestepper) {
	  return function($scope, elm, attrs) {
		elm.bind("click", function (ev) {
			ev.stopPropagation();
			ev.preventDefault();
			// we need at least a playername
			if ($scope.model.player.name) { 
				angular.element(document.body).removeClass("invalid");
				gamestepper.emit("gamecommand", {type: "start", name: $scope.model.player});
			} else {
				angular.element(document.body).addClass("invalid");
				$scope.$apply(function () {
					$scope.model.inputPlaceholder = "Dude, type your name!";
				});
			}
		});
	  };
	}]);