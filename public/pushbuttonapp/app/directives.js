'use strict';

angular.module('pushbutton.directives', []).
	directive('startGame', ["gamestepper", function(gamestepper) {
	  return function($scope, elm, attrs) {
		elm.bind("click", function (ev) {
			ev.stopPropagation();
			ev.preventDefault();
			if ($scope.model.player.name) { // we need at least a playername
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