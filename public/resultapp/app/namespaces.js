var ResultApp = angular.module('ResultApp', ['ngResource', 'common.services']);

ResultApp
	.directive('carouselPrev', [function() {
	  return function($scope, elm, attrs) {
		  elm.on("click", function () {
			  $(attrs.carouselPrev).carousel("prev");
		  });
	  };
	}])
	.directive('carouselNext', [function() {
	  return function($scope, elm, attrs) {
		  elm.on("click", function () {
			  $(attrs.carouselNext).carousel("next");
		  });
	  };
	}]);
