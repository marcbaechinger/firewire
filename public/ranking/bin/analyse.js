var dataDirectory = require("path").resolve(__dirname, "../data"),
	tools = require("./modules/tools.js");

console.log(
	JSON.stringify(
		tools.stats(dataDirectory)
	)
);