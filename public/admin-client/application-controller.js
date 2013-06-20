(function (global) {
	var ApplicationController = function () {
		$(document.body).on("click touchstart", function() {
			alert("das")
		});
	};
	global.ApplicationController = ApplicationController;
}(this));