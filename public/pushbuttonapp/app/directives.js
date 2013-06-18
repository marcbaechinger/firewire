'use strict';

angular.module('pushbutton.directives', []).
	directive('startGame', ["gamestepper", function(gamestepper) {
	  return function($scope, elm, attrs) {
		elm.bind("click", function (ev) {
			ev.stopPropagation();
			ev.preventDefault();
			gamestepper.emit("gamecommand", {type: "start"})
		});
	  };
	}]);