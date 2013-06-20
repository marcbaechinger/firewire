var storageProvider = require('./storageProvider.js');
/**
 * Module dependencies.
 */

var express = require('express'), routes = require('./routes'), admin = require('./routes/admin'), http = require('http'), path = require('path'), socketio = require('socket.io');

var app = express();
var server = http.createServer(app);
var io = socketio.listen(server, {
	log:true
});

var socketListeners = {},
	notifyClients = function (eventName, data) {
		Object.keys(socketListeners).forEach(function(key) {
			socketListeners[key].emit(eventName, data);
		});
	},
	disconnectClient = function (clientId) {
		if (socketListeners[clientId]) {
			socketListeners[clientId].disconnect();
			delete socketListeners[clientId];
		}
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
	socket.on("gamecommand", function (data) {
		notifyClients("gamecommand", data);
	});
	socket.on('disconnect', function () {
		delete socketListeners[socket.id];
	});
});

// initialize cache used for index
storageProvider.readFileToIndex();

// REST service to persist game steps into file using a POST request
app.post('/api/gamestep', function(req, res) {
	var gamestep = req.body;

	// notify websockets clients
	notifyClients("gamestep", gamestep);
	
	// save current step into storage and add game to index if necessary
	storageProvider.saveStep(gamestep);

	if(gamestep.type == "game-complete" || gamestep.type == "failure"){
		var gamestepRanked = storageProvider.getSortedGameById(gamestep.id);
		notifyClients("newgameavailable", gamestepRanked);
	}

	res.send(gamestep);
});

app.get('/api/games', function(req, res){
  var games = storageProvider.getAllSortedGames();
  
  res.send(games);
});

app.delete('/api/disconnect/:clientId', function(req, res){
	disconnectClient(req.params.clientId);
 	res.send({});
});
app.delete('/api/games/:gameId', function(req, res){
	storageProvider.deleteGame(req.params.gameId, function () {
	 	res.send({});
	});
});

app.get('/api/games/:gameId', function(req, res) {
	var gamesteps = storageProvider.getAllGamesteps(req.params.gameId);
	
	res.send(gamesteps);
});

app.get('/admin', function(req, res){
  res.render('admin', { 
	  title: 'Admin-Client',
	  clients: socketListeners,
	  games: storageProvider.getAllSortedGames()
  });
});

server.listen(app.get('port'), function() {
	console.log("Express server listening on port " + app.get('port'));
});
