(function (global) {
	var getJson = function (url, success) {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);

		xhr.overrideMimeType('application/json; charset=utf-8');
		xhr.onreadystatechange = function(e) {
			if (this.readyState == 4) {
				success(JSON.parse(this.responseText));
			}
		};
		xhr.send();
	};
	
	global.net = {
		getJson: getJson
	};
}(this));