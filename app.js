var storageProvider = require('./storageProvider.js');
/**
 * Module dependencies.
 */

var express = require('express'), routes = require('./routes'), user = require('./routes/user'), http = require('http'), path = require('path'), socketio = require('socket.io');

var app = express();
var server = http.createServer(app);
var io = socketio.listen(server);

var socketListeners = {},
	notifyClients = function (eventName, data) {
		// iterate over all socket listeners and emit event
		Object.keys(socketListeners).forEach(function(key) {
//			console.log(socketListeners[key]);
			socketListeners[key].emit(eventName, data);
		});
	};

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

io.sockets.on('connection', function(socket) {
	socketListeners[socket.id] = socket;
	console.log("Socket Listener added");
	socket.on("gamecommand", function (data) {
		notifyClients("gamecommand", data);
	});
});

// initialize cache used for index
storageProvider.readFileToIndex();

// REST service to persist game steps into file using a POST request
app.post('/api/gamestep', function(req, res) {
	var gamestep = req.body;

	console.log("POST: ");

	// notify websockets clients
	notifyClients("gamestep", gamestep);
	
	// save current step into storage and add game to index if necessary
	storageProvider.saveStep(gamestep);
	res.send(gamestep);
});

app.get('/api/games', function(req, res){
  var games = storageProvider.getAllSortedGames();
  
  res.send(games);
});

app.get('/api/games/:gameId', function(req, res) {
	console.log('Get Game by id: ' + req.params.gameId);
	var gamesteps = storageProvider.getAllGamesteps(req.params.gameId);
	
	res.send(gamesteps);
});

server.listen(app.get('port'), function() {
	console.log("Express server listening on port " + app.get('port'));
});
