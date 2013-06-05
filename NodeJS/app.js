/* Generic and useful functions */

function htmlEscape(str) {
    return String(str)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
}

function htmlUnescape(value){
    return String(value)
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&');
}

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

var editingScenarios = []; // La liste des scénario en cours d'édition

//Scenario {id, connectedClients, active_connections, currentText}

server = http.createServer(app);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

io = io.listen(server); 

function getEditingScenarioIndex(scenarioId)
{
	for (var i = 0; i < editingScenarios.length; i++) 
	{
		if (editingScenarios[i].id == scenarioId) 
		{
			return i;
		}
	}
	
	return -1;
}

function getPseudoIndex(scenarioIndex, userPseudo)
{
	for (var i = 0; i < editingScenarios[scenarioIndex].connectedUsers.length; i++) 
	{
		if (userPseudo == editingScenarios[scenarioIndex].connectedUsers[i].pseudo)
		{
			return i;
		}
	}	
	
	return -1;
}

/* Return the scenario index and the pseudo associated to the socket */
function getInfosFromSocket(socketId)
{
	for (var i = 0; i < editingScenarios.length; i++) {

		for (var j = 0; j < editingScenarios[i].connectedClients.length; j++) {
		
			if (editingScenarios[i].connectedClients[j].id == socketId) {
			
				return {pseudo: editingScenarios[i].connectedClients[j].pseudo, scenarioIndex: i, socketIndex: j};
			}
		}
	}
	
	return {pseudo: "", scenarioIndex: -1, socketIndex: -1};
}


io.sockets.on('connection', function (socket) {

	socketId = socket.id; // The new socket's ID

	/* Scenario management */
	
	socket.on('newUserConnection', function (infos)
	{
		newUser = {id: socketId, pseudo: infos.pseudo};
		
		/* On reçoit la room correspondant au scénario */
		socket.join("s" + infos.scenarioId);
		
		/* Get the scenario index in the editing ones' list */
		scenarioIndex = getEditingScenarioIndex(infos.scenarioId);
		
		/* If the scenario was not in the editing ones' list */
		if (scenarioIndex == -1) {
			editingScenarios.push({
				id: infos.scenarioId,
				connectedClients: [newUser],
				connectedUsers : [{pseudo: infos.pseudo, cpt: 1}],
				active_connections: 1, 
				currentText: ""});
				
			scenarioIndex = editingScenarios.length - 1;
		} else { // If some people were already on this scenario

			/* On ajout l'utilisateur à la liste de ceux qui éditent ce scénario */
			editingScenarios[scenarioIndex].connectedClients.push(newUser);
			
			editingScenarios[scenarioIndex].active_connections++; 
			
			/* Cherche à savoir si l'utilisateur est déjà connecté sur ce scénario */
			indexPseudo = getPseudoIndex(scenarioIndex, infos.pseudo);
			
			console.log("INDEX PSEUDO = " + indexPseudo);
			
			if (indexPseudo == -1) // ça n'est pas le cas
			{
				editingScenarios[scenarioIndex].connectedUsers.push({pseudo: infos.pseudo, cpt: 1});
				
				/* On broadcast l'évènement à tous les utilisateurs dans cette room / scénario */
				socket.broadcast.to("s" + infos.scenarioId).emit('userConnection', newUser);
			} 
			else
			{
				editingScenarios[scenarioIndex].connectedUsers[indexPseudo].cpt++;
				
				console.log("Pseudo " + infos.pseudo + " is present " + editingScenarios[scenarioIndex].connectedUsers[indexPseudo].cpt);
			}
		}
		
		/* On donne au nouvel utilisateur les informations nécessaires pour initialiser la page */
		socket.emit('initPage', {text: editingScenarios[scenarioIndex].currentText, users: editingScenarios[scenarioIndex].connectedUsers});
		
		console.log('New user with pseudo : ' + infos.pseudo + " and ID : " + socketId);
	});
	
    socket.on('newTextVersion', function (infos) {

		/* Get the scenario index in the editing ones' list */
		scenarioIndex = getEditingScenarioIndex(infos.scenarioId);

		editingScenarios[scenarioIndex].currentText = infos.newText;
		
		console.log('Sending text ' + infos.newText);
		
		/* On broadcast le nouveau texte à tous les utilisateurs dans cette room / scénario */
		socket.broadcast.to("s" + infos.scenarioId).emit('updateEditorText', infos.newText);
    });
	
	/* Get new message from the client and broadcast it to all clients in the same room */
	socket.on('sendChatMessageToServer', function (user, messageContent, scenarioId) {
	
		/* Get the scenario index in the editing ones' list */
		scenarioIndex = getEditingScenarioIndex(scenarioId);
	
		/* On broadcast le message à tous les utilisateurs dans cette room / scénario */
		socket.broadcast.to("s" + scenarioId).emit('updateChatWithMessage', {user: user, content: htmlEscape(messageContent)});
    });
	
	socket.on('saveEditorText', function (infos) {
		//saveScenarioDatabase(infos.text);
    });
	
	socket.on('disconnect', function() {
	
		infos = getInfosFromSocket(socket.id);
		
		/* An error occured */
		if (infos.scenarioIndex == -1)
			return;
			
		pseudoIndex = getPseudoIndex(infos.scenarioIndex, infos.pseudo);
			
		if (pseudoIndex == -1)
			return;
			
		editingScenarios[infos.scenarioIndex].connectedUsers[pseudoIndex].cpt--;

		if (editingScenarios[infos.scenarioIndex].connectedUsers[pseudoIndex].cpt == 0)
		{		
			console.log("UN UTILISATEUR EST MORT");
		
			socket.broadcast.to("s" + editingScenarios[infos.scenarioIndex].id).emit('userDisconnection', infos.pseudo);
			
			editingScenarios[infos.scenarioIndex].active_connections--;
			
			editingScenarios[infos.scenarioIndex].connectedUsers.remove(pseudoIndex);
		}
		
		editingScenarios[infos.scenarioIndex].connectedClients.remove(infos.socketIndex);
					
		//console.log(editingScenarios[i].connectedClients[j].pseudo + " has disconnected");
	});
	
	/* Drawing management */
	
	active_connections = 0;
	
	active_connections++

	io.sockets.emit('user:connect', active_connections);
	
	socket.on('disconnect', function () {
		active_connections--
		io.sockets.emit('user:disconnect', active_connections);
	});
  
	socket.on('draw:progress', function (uid, co_ordinates) {
    
		io.sockets.emit('draw:progress', uid, co_ordinates)

	});
	
	socket.on('modification:end', function (uid, co_ordinates) {
    
		io.sockets.emit('modification:end', uid, co_ordinates)

	});
  
	socket.on('draw:end', function (uid, co_ordinates) {
    
		io.sockets.emit('draw:end', uid, co_ordinates);

	});
	
	socket.on('drawForMe:progress', function (uid, co_ordinates) {
    
		io.sockets.emit('drawForMe:progress', uid, co_ordinates);

	});
	
	socket.on('drawForMe:end', function (uid, co_ordinates) {
    
		io.sockets.emit('drawForMe:end', uid, co_ordinates);

	});

});