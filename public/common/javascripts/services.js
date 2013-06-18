'use strict';

(function () {
	var module = angular.module('common.services', []);
	
	module.factory("gamestepper", [function () {
		var websocketUrl = "http://" + document.location.host,
			socket = io.connect(websocketUrl),
			clients = [];

		console.log("connected to ", websocketUrl);
		
		socket.on("gamestep", function (data) {
			clients.forEach(function (callback) {
				callback._scope.$apply(function () {
					callback(data);
				});
			});
		});
		
		return {
			register: function (scope, callback) {
				callback._scope = scope;
				clients.push(callback);
			}
		};
	}]);
}());