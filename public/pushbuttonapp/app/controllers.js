'use strict';

function ApplicationController($scope, gamestepper) {
	
	gamestepper.register($scope, function (data) {
		console.log("retrieved data in controller", data);
	});
};
ApplicationController.$inject = ["$scope", "gamestepper"];
