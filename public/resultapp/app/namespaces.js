var ResultApp = angular.module('ResultApp', ['ngResource', 'common.services']);

ResultApp.directive('carousel', [
function() {
	return function($scope, elm, attrs) {
		$(attrs.carousel).carousel({
			interval : 2000
		});
	};
}]).directive('carouselPrev', [
function() {
	return function($scope, elm, attrs) {
		elm.on("click", function() {
			$(attrs.carouselPrev).carousel("prev");
		});
	};
}]).directive('carouselNext', [
function() {
	return function($scope, elm, attrs) {
		elm.on("click", function() {
			$(attrs.carouselNext).carousel("next");
		});
	};
}]).directive('fwPopup', [
function() {
	return function($scope, elm, attrs) {
		$scope.$watch('lastCompletedGame', function(newValue, oldValue) {
			if (newValue) {
				$(".animate").one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(e) {
					$(elm).modal();
					setTimeout(function() {
						$(elm).modal('hide');
					}, 5000);
				});
			}
		});
	}
}]);
