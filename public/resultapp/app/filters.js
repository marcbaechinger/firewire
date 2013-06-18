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

ResultApp.filter('replaceGamestepType', function() {
	return function(value) {
		switch(value){
			case "game-start":
				return "After having started";
				break;
			case "game-complete":
				return "After a successful finish";
				break;
			case "failure":
				return "After failure";
				break;
			case "milestone-1":
				return "After reaching milestone 1";
				break;
			case "milestone-2":
				return "After reaching milestone 2";
				break;
			case "milestone-3":
				return "After reaching milestone 3";
				break;
		}
	}
});

ResultApp.filter('typeDependingMessage', function() {
	return function(value){
		switch(value){
			case "game-complete":
				return "succeed";
			default:
				return "fail";
		}
	}
});