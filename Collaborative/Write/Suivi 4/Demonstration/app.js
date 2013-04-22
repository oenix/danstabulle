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
  , io = require('socket.io'); ;

  
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

/* */
/*if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}*/

app.get('/', routes.index);
app.get('/users', user.list);

/**/

var currentText = "";
var textIsEditing = false;
var connectedClients = [] ; // {socket.id, nickname}

server = http.createServer(app);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

io = io.listen(server); 

io.sockets.on('connection', function (socket) {

	socketId = socket.id; // The new socket's ID

	socket.on('newUserConnection', function (userPseudo)
	{
		newUser = {id: socketId, pseudo: userPseudo};
	
		connectedClients.push(newUser);
		socket.broadcast.emit('updateUsersList', newUser);
		
		socket.emit('initPage', {text: currentText, clients: connectedClients});
		
		console.log('New user with pseudo : ' + userPseudo + " and ID : " + socketId);
	});
	
    
    socket.on('newTextVersion', function (newText) {
        currentText = newText;
		
		console.log('Sending text ' + newText);
		
        socket.broadcast.emit('updateEditorText', newText);
    });
	
	socket.on('isEditing', function (isEditing) {
		console.log('IS NOT EDITING');
    });
	
	socket.on('saveEditorText', function (text) {
		console.log('TEXT MUST BE SAVED HERE');
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
});

//var clients = io.sockets.clients();