var fs = require('fs');

/**
 * Module dependencies.
 */

var express = require('express'), routes = require('./routes'), user = require('./routes/user'), http = require('http'), path = require('path');

var app = express();

app.configure(function() {
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(require('less-middleware')({
		src : __dirname + '/public'
	}));
	app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
	app.use(express.errorHandler());
});

app.get('/', routes.index);

// REST service to persist game steps into file using a POST request
app.post('/api/gamestep', function(req, res) {
	console.log("POST: ");
	console.log(req.body);

	var gamesteps = new Array();

	var gamestep = new Object();
	gamestep.id = req.body.id;
	gamestep.image = req.body.image;
	gamestep.timestamp = req.body.timestamp;
	gamestep.step = req.body.step;

	var outputFilename = __dirname + "/storage/games/" + "gamesteps_" + gamestep.id + ".json";

	fs.exists(outputFilename, function(exists) {
		if (exists) {
			readAndWriteToExistingFile();
		} else {
			writeToNewFile();
		}

	});

	// read existing file and append current gamestep
	function readAndWriteToExistingFile() {
		fs.readFile(outputFilename, function(err, data) {
			if (err) {
				console.log(err);
			} else {
				gamesteps = JSON.parse(data);
				writeToNewFile();
			}
		});
	}

	// add current gamestep to gamesteps array and write array into file
	function writeToNewFile() {
		gamesteps.push(gamestep);

		fs.writeFile(outputFilename, JSON.stringify(gamesteps, null, 4), function(err) {
			if (err) {
				console.log(err);
			}
		});
	}

	return res.send(gamestep);
});

http.createServer(app).listen(app.get('port'), function() {
	console.log("Express server listening on port " + app.get('port'));
});
