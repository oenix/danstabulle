/* Array Remove - By John Resig (MIT Licensed) */

Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , io = require('socket.io')
  , pg = require('pg');

  
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

/* Routing configuration */

app.get('/', routes.index);
app.get('/users', user.list);

app.get('/draw', function(req, res){
  res.render('draw', {
    title: 'Draw'
  });
});

app.get('/scenario', function(req, res){
  res.render('scenario', {
    title: 'Scenario'
  });
});

/* SQL configuration */

var connectionString = "postgres://postgres:admin@localhost:5432/DansTaBulleTest";

var sqlClient = new pg.Client(connectionString);

function executeQuery(query) {
	sqlClient.connect();

	var query = sqlClient.query(query);

	query.on('row', function(row) {
		console.log(row);
	});

	query.on('end', function() { 
		sqlClient.end();
	});
}

function saveScenarioDatabase(text) {
	newQuery = 'INSERT INTO "ScenarioVersion" (content) VALUES (\'' + text + "');"; 
	
	console.log(newQuery);
	executeQuery(newQuery);
}

/**/

var currentText = "";
var textIsEditing = false;
var connectedClients = [] ; // [{id: socket.id, pseudo: userPseudo}]
var active_connections = 0;

server = http.createServer(app);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

io = io.listen(server); 

io.sockets.on('connection', function (socket) {

	socketId = socket.id; // The new socket's ID

	/* Scenario management */
	
	socket.on('newUserConnection', function (userPseudo)
	{
		newUser = {id: socketId, pseudo: userPseudo};
	
		connectedClients.push(newUser);
		socket.broadcast.emit('userConnection', newUser);
		
		socket.emit('initPage', {text: currentText, clients: connectedClients});
		
		console.log('New user with pseudo : ' + userPseudo + " and ID : " + socketId);
	});
	
    socket.on('newTextVersion', function (newText) {
        currentText = newText;
		
		console.log('Sending text ' + newText);
		
        socket.broadcast.emit('updateEditorText', newText);
    });
	
	socket.on('sendChatMessageToServer', function (user, messageContent) {
        socket.broadcast.emit('updateChatWithMessage', {user: user, content: messageContent});
    });
	
	socket.on('isEditing', function (isEditing) {
		console.log('IS NOT EDITING');
    });
	
	socket.on('saveEditorText', function (text) {
		console.log("FDSFDSFDSFDS");
		//saveScenarioDatabase(text);
    });
	
	socket.on('disconnect', function() {
		for (var i = 0; i < connectedClients.length; i++) {
			if (socket.id == connectedClients[i].id) {
				socket.broadcast.emit('userDisconnection', connectedClients[i]);
				
				console.log(connectedClients[i].pseudo + " has disconnected");
				
				connectedClients.remove(i);
				
				break;
			}
		}
	});
	
	/* Drawing management */
	
	active_connections++

	io.sockets.emit('user:connect', active_connections);
	
	socket.on('disconnect', function () {
		active_connections--
		io.sockets.emit('user:disconnect', active_connections);
	});
  
	socket.on('draw:progress', function (uid, co_ordinates) {
    
		io.sockets.emit('draw:progress', uid, co_ordinates)

	});
  
	socket.on('draw:end', function (uid, co_ordinates) {
    
		io.sockets.emit('draw:end', uid, co_ordinates);

	});

});