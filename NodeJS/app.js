/* Generic and useful functions */
var paletteFile ="public/javascripts/colors.dtb";
var ressourceFile ="public/javascripts/ressources.dtb";
var defaultPalette = ["#000000", "#FFFFFF","#72CC51","#2762A6","#D5D80D", "#EF5426","#34373C", "#D22632", "#F3D155", "#00A7CC", "#D65277","endBuffer"];


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

var connectionString = "postgres://postgres:root@localhost:5432/symfony";

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

var editingScenarios = []; // La liste des scÃ©narios en cours d'Ã©dition

//Scenario {id, connectedClients, active_connections, currentText}

editingDrawings = []; // Drawing = {id, connectedClients, active_connections, currentDrawing}

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
		
		/* On reÃ§oit la room correspondant au scÃ©nario */
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
				currentText: "",
				currentFramework: {
									summary: "RÃ©sumÃ© de l'histoire", 
									places: [
											{name: "Premier lieu", description:"Description"},
											{name: "Second lieu", description:"Description"}
									],
									characters: [
											{name: "Premier personnage", description:"Description"},
											{name: "Second personnage", description:"Description"}
									]
				}});
				
			scenarioIndex = editingScenarios.length - 1;
		} else { // If some people were already on this scenario

			/* On ajoute l'utilisateur Ã  la liste de ceux qui Ã©ditent ce scÃ©nario */
			editingScenarios[scenarioIndex].connectedClients.push(newUser);
			
			editingScenarios[scenarioIndex].active_connections++; 
			
			/* Cherche Ã  savoir si l'utilisateur est dÃ©jÃ  connectÃ© sur ce scÃ©nario */
			indexPseudo = getPseudoIndex(scenarioIndex, infos.pseudo);
			
			if (indexPseudo == -1) // Ca n'est pas le cas
			{
				editingScenarios[scenarioIndex].connectedUsers.push({pseudo: infos.pseudo, cpt: 1});
				
				/* On broadcast l'Ã©vÃ¨nement Ã ous les utilisateurs dans cette room / scÃ©nario */
				socket.broadcast.to("s" + infos.scenarioId).emit('userConnection', newUser);
			} 
			else
			{
				editingScenarios[scenarioIndex].connectedUsers[indexPseudo].cpt++;
				
				console.log("Pseudo " + infos.pseudo + " is present " + editingScenarios[scenarioIndex].connectedUsers[indexPseudo].cpt);
			}
		}
		
		/* On donne au nouvel utilisateur les informations nÃ©cessaires pour initialiser la page */
		socket.emit('initPage', {text: editingScenarios[scenarioIndex].currentText, framework: editingScenarios[scenarioIndex].currentFramework, users: editingScenarios[scenarioIndex].connectedUsers});
		
		console.log('New user with pseudo : ' + infos.pseudo + "in room " + + "and ID : " + socketId);
	});
	
    socket.on('newTextVersion', function (infos) {

		/* Get the scenario index in the editing ones' list */
		scenarioIndex = getEditingScenarioIndex(infos.scenarioId);

		editingScenarios[scenarioIndex].currentText = infos.newText;
		
		/* On broadcast le nouveau texte Ã  tous les utilisateurs dans cette room / scÃ©nario */
		socket.broadcast.to("s" + infos.scenarioId).emit('updateEditorText', infos.newText);
		
				//saveScenarioDatabase(infos.newText);
    });
	
	socket.on('saveEditorInDatabase', function (infos) {
		console.log("Ok gros");
		saveScenarioDatabase(infos.Newtext);
    });
	
	socket.on('sendScenarioFramework', function (scenarioId, framework)
	{
		/* Get the scenario index in the editing ones' list */
		scenarioIndex = getEditingScenarioIndex(scenarioId);

		editingScenarios[scenarioIndex].currentFramework = framework;
	
		socket.broadcast.to("s" + scenarioId).emit('updateScenarioFramework', framework);
	});
	
	socket.on('disconnect', function() {
	
		infos = getInfosFromSocket(socket.id);
		
		/* Is scenario disconnection */
		if (infos.scenarioIndex != -1)
		{			
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
		} else { // Drawing disconnection VERSION PROVISOIRE
		
			for (var i = 0; i < editingDrawings.length; i++) 
			{
				for (var j = 0; j < editingDrawings[i].connectedUsers.length; j++) 
				{
					if (editingDrawings[i].connectedUsers[j].id == socketId) {
							
						scenarioIndex = i; 
						socketIndex = j;
					
						pseudo = editingDrawings[i].connectedUsers[j].pseudo; 

						socket.broadcast.to("d" + editingDrawings[scenarioIndex].id).emit('userDisconnection', pseudo);

						editingDrawings[i].connectedUsers.remove(j);
					
						return;
					}
				}
			}
		}
	});
	



	/* Chat management */
	
	/* Get new message from the client and broadcast it to all clients in the same room */
	socket.on('sendChatMessageToServer', function (user, messageContent, isScenario, id) {
	
		if (isScenario)
			socket.broadcast.to("s" + id).emit('updateChatWithMessage', {user: user, content: htmlEscape(messageContent)});
		else // Is drawing
			socket.broadcast.to("d" + id).emit('updateChatWithMessage', {user: user, content: htmlEscape(messageContent)});
    });



	
	/* Drawing management */

	socket.on('newDrawingUser', function (infos)
	{
		newUser = {id: socketId, pseudo: infos.pseudo};
		
		console.log("LALALALALKLFKDSLFKDSLFLDSKFKLKFLSKFLDSKFS");
		
		/* On reÃ§oit la room correspondant au scÃ©nario */
		socket.join("d" + infos.id);
		
		/* Provisoire */
		
		socket.broadcast.to("d" + infos.id).emit('userConnection', newUser);
			
		drawingIndex = -1;
			
		for (var i = 0; i < editingDrawings.length; i++) 
		{
			if (editingDrawings[i].id == infos.id)
				drawingIndex = i;
		}
		
		if (drawingIndex == -1)
		{
			editingDrawings.push({id: infos.id, connectedUsers: []});
		
			drawingIndex = editingDrawings.length - 1;
		}
		
		editingDrawings[drawingIndex].connectedUsers.push(newUser);
		
		socket.emit('initPage', {users: editingDrawings[drawingIndex].connectedUsers});

		/* ---------- */
		
		/* Get the scenario index in the editing ones' list */
		//scenarioIndex = getEditingScenarioIndex(infos.scenarioId);
		
		/* If the scenario was not in the editing ones' list */
		/*if (scenarioIndex == -1) {
			editingScenarios.push({
				id: infos.scenarioId,
				connectedClients: [newUser],
				connectedUsers : [{pseudo: infos.pseudo, cpt: 1}],
				active_connections: 1, 
				currentText: ""});
				
			scenarioIndex = editingScenarios.length - 1;
		} else {*/ // If some people were already on this scenario

			/* On ajout l'utilisateur à la liste de ceux qui éditent ce scénario */
			//editingScenarios[scenarioIndex].connectedClients.push(newUser);
			
			//editingScenarios[scenarioIndex].active_connections++; 
			
			/* Cherche à savoir si l'utilisateur est déjà connecté sur ce scénario */
			//indexPseudo = getPseudoIndex(scenarioIndex, infos.pseudo);
			
			// console.log("INDEX PSEUDO = " + indexPseudo);
			
			// if (indexPseudo == -1) // ça n'est pas le cas
			// {
				// editingScenarios[scenarioIndex].connectedUsers.push({pseudo: infos.pseudo, cpt: 1});
				
				/* On broadcast l'évènement à tous les utilisateurs dans cette room / scénario */
				//socket.broadcast.to("s" + infos.scenarioId).emit('userConnection', newUser);
			// } 
			// else
			// {
				// editingScenarios[scenarioIndex].connectedUsers[indexPseudo].cpt++;
				
				// console.log("Pseudo " + infos.pseudo + " is present " + editingScenarios[scenarioIndex].connectedUsers[indexPseudo].cpt);
			// }
		// }
		
		/* On donne au nouvel utilisateur les informations nécessaires pour initialiser la page */
		//socket.emit('initPage', {text: editingScenarios[scenarioIndex].currentText, users: editingScenarios[scenarioIndex].connectedUsers});
		//socket.emit('initPage', {users: editingScenarios[scenarioIndex].connectedUsers});

		
		console.log('New drawing user with pseudo : ' + infos.pseudo + " and ID : " + socketId);
	});
	
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
	
	socket.on('harmonisation:end', function (uid, co_ordinates) {
    
		io.sockets.emit('harmonisation:end', uid, co_ordinates);

	});
	
	socket.on('loadPalette:end', function (uid){
		
		var fs = require('fs');
		var colors = [];
		
		if (fs.existsSync(paletteFile)) {
		    data = fs.readFileSync(paletteFile);
			data.toString().split('\n').forEach(function(line) {
			colors.push(line);
		});
		}
		else {
			colors = defaultPalette;
		}
		io.sockets.emit('loadColors:end', uid, JSON.stringify(colors));
	});
	
		
	socket.on('loadRessources:end', function (uid){
		
		var fs = require('fs');
		var ressources = [];
		
		if (fs.existsSync(ressourceFile)) {
		    data = fs.readFileSync(ressourceFile);
			data.toString().split('\n').forEach(function(line) {
			ressources.push(line);
		});
		}
		else {
			ressources = [];
		}
		io.sockets.emit('loadRessources:end', uid, JSON.stringify(ressources));
	});
	
	socket.on('savePalette:end', function (uid, colors) {
		
		var fs = require('fs');

		fs.writeFile(paletteFile, colors, function(err) {
		if(err) {
			fs.createWriteStream(paletteFile);
			fs.writeFile(paletteFile, colors, function(err) {
			  if(err) 
				Console.log("Write Error");
			});
		} else {
			console.log("The file was saved!");
		}
		});
	
	});
	
	socket.on('saveRessources:end', function (uid, ressources) {
		
	    var fs = require('fs');

	    fs.writeFile(ressourceFile, ressources, function(err) {
	    if(err) {
	    	fs.createWriteStream(ressourceFile);
	        fs.writeFile(ressourceFile, ressources, function(err) {
		  if(err) 
			Console.log("Write Error");
			});
		} else {
			console.log("The file was saved!");
		}
		});
	
	});

});