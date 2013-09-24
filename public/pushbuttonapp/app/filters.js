'use strict';

/* Filters */

angular.module('pushbutton.filters', [])
	.filter('seconds2time', function() {
    return function(input, uppercase) {
		var seconds, 
			timestring = "" + parseInt(input/60, 10);
		
		timestring += ":";
		seconds = input % 60;
		if (seconds <= 9) {
			timestring += "0";
		}
		timestring += seconds;
		return timestring;
    }
  });;