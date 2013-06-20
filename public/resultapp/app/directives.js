ResultApp.directive('carousel', [
function() {
	return function($scope, elm, attrs) {
		$(attrs.carousel).carousel({
			interval : 2000
		});
	};
}]);

ResultApp.directive('carouselPrev', [
function() {
	return function($scope, elm, attrs) {
		elm.on("click", function() {
			$(attrs.carouselPrev).carousel("prev");
		});
	};
}]);

ResultApp.directive('carouselNext', [
function() {
	return function($scope, elm, attrs) {
		elm.on("click", function() {
			$(attrs.carouselNext).carousel("next");
		});
	};
}]);

ResultApp.directive('fwPopup', [
function() {
	return function($scope, elm, attrs) {
		$scope.$watch('lastCompletedGame', function(newValue, oldValue) {
			if (newValue) {
				if ($scope.liveScrollingOn) {
					setTimeout(function() {
						$(elm).modal();
						setTimeout(function() {
							$(elm).modal('hide');
						}, 5000);
					}, 2000);
				}
			}
		});
	}
}]);

ResultApp.directive('fwScroll', [
function() {
	return function($scope, elm, attrs) {
		$scope.$watch('lastCompletedGame', function(newValue, oldValue) {
			if (newValue && newValue.id == attrs.fwScroll) {
				console.log($(elm).offset().left, $(elm).offset().top);
				window.scrollTo($(elm).offset().left, $(elm).offset().top);
			}
		});
	}
}]);
