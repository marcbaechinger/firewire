'use strict';

/* Filters */

angular.module('myApp.filters', []).
  filter('minute', function() {
    return function(seconds) {
      return Math.floor(seconds / 60);
    }
  }).
	filter('second', function() {
		return function(seconds) {
			var sec = seconds % 60;
			return sec > 9 ? sec : "0" + sec;
		}
	});