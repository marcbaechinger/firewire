ResultApp.filter('minute', function() {
	return function(seconds) {
		return Math.floor(seconds / 60);
	}
});

ResultApp.filter('second', function() {
	return function(seconds) {
		var sec = seconds % 60;
		return sec > 9 ? sec : "0" + sec;
	}
}); 