(function (global) {
	var ApplicationController = function (spec) {
		
		var that = this;
		
		$.extend(this, spec);
		
		$(document.body).on("click", function(ev) {
			var target = $(ev.target),
				action = target.closest("[data-action]").data("action");
			
			if (that.actions[action]) {
				that.actions[action].call(that, target);
			}
		});
	};
	global.ApplicationController = ApplicationController;
}(this));

new ApplicationController({
	actions: {
		disconnect: function (target) {
			$.ajax({
				type: "DELETE",
				url: "/api/disconnect/" + $(target).data("client"),
				success: function (res) {
					target.closest("li").remove();
				},
				error: function (res) {
					alert("disconnecting client failed");
				}
			});
		},
		deleteGame: function (target) {
			$.ajax({
				type: "DELETE",
				url: "/api/games/" + $(target).data("game"),
				success: function (res) {
					target.closest("li").remove();
				},
				error: function (res) {
					alert("deleting game failed");
				}
			});
		},
		togglePic: function (target) {
			target.closest("li").toggleClass("show-pic");
		}
	}
});