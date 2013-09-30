var tools = require("./modules/tools.js"),
	dataDirectory = require('path').resolve(__dirname, "../data");

console.log(
	JSON.stringify(
		tools.transform(dataDirectory)
	)
);