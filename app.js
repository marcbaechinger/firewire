var storageProvider = require('./storageProvider.js');

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

// initialize cache used for index
storageProvider.readFileToIndex();

// REST service to persist game steps into file using a POST request
app.post('/api/gamestep', function(req, res) {
	var gamestep = req.body;

	console.log("POST: ");
	console.log(gamestep);

	// save current step into storage and add game to index if necessary
	storageProvider.saveStep(gamestep);
	
	return res.send(gamestep);
});

http.createServer(app).listen(app.get('port'), function() {
	console.log("Express server listening on port " + app.get('port'));
});
