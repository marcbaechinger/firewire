(function (global) {
	global.format = {
		time: function (duration) {
			var buf = [ parseInt(duration/60, 10), ":" ];
			if (duration % 60 < 10) {
				buf.push("0");
			}
			buf.push(duration % 60);
			return buf.join("");
		}
	};
}(this));