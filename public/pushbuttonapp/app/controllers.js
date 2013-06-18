'use strict';

function ApplicationController($scope, gamestepper) {
	
	gamestepper.register($scope, function (data) {
		console.log("retrieved data in controller", data);
	});
	
	gamestepper.registerForCommand($scope, function (data) {
		console.log("gamecommand arrived", data);
	});
};
ApplicationController.$inject = ["$scope", "gamestepper"];
