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
				return "When there was hope";
				break;
			case "game-complete":
				return "When a hero was born";
				break;
			case "failure":
				return "When all hope died";
				break;
			case "milestone-1":
				return "Milestone 1 reached";
				break;
			case "milestone-2":
				return "Milestone 2 reached";
				break;
		}
	}
});
