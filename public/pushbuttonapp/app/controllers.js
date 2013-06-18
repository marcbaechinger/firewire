'use strict';

function ApplicationController($scope, gamestepper) {
	
	var canvas = angular.element(document.querySelector(".canvas"));
	
	$scope.model = {
		gameState: "stopped",
		inputPlaceholder: "your name goes here"
	};
	
	gamestepper.register($scope, function (data) {
		if (data.type === "game-start") {
			$scope.model.gameState = "started";
			delete $scope.model.step;
		} else if (data.type === "failure" || data.type === "game-complete") {
			$scope.model.gameState = "finished";
			$scope.model.player = "";
		} else if (canvas.hasClass("right")) {
			canvas.removeClass("right");
		} else {
			canvas.addClass("right");
		}
		$scope.model.step = data;
	});
	
	gamestepper.registerForCommand($scope, function (data) {
		console.log("gamecommand arrived", data);
	});
};
ApplicationController.$inject = ["$scope", "gamestepper"];
