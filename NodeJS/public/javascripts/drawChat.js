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

function GetURLParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return sParameterName[1];
        }
    }
}

/* */

$(document).ready(function() {

	var socket = io.connect();
	
	/* Set the user pseudo according to the parameter */ 

	var pseudo = GetURLParameter("pseudo");
		
	if (pseudo == undefined || pseudo == null || pseudo == "") {
		pseudo = "oenix" + Math.floor(Math.random() * 201);
	}
	
	/* Set the drawing id according to the parameter */ 
	
	var drawingId = GetURLParameter("id");
	
	if (drawingId == undefined) {
		drawingId = "1";
	}
	
	/* Tell the server about the new user's connection */

	socket.emit('newDrawingUser', {id: drawingId, pseudo: pseudo});

	/* Useful functions for the chat management */
	
	function addNewUser(newUser) {
		$('#connectedUsersList').append("<li><a href='#' target='_blank'>" + newUser.pseudo + "</a></li>");
	}
	
	function updateChatWithMessage(message) {
		chatMessages = $("#chatMessages");
	
		chatMessages.append("<li><strong>" + message.user + "</strong> : " + message.content + "</li>");
		
		chatMessages.scrollTop(chatMessages.prop("scrollHeight"));
	}
	
	function updateChatWithEvent(event) {
		chatMessages = $("#chatMessages");
	
		chatMessages.append("<li><em>" + event + "</em></li>");
		
		chatMessages.scrollTop(chatMessages.prop("scrollHeight"));
	}
	
	function sendChatMessage() {
		messageContent = htmlEscape($("#chatSendMessageArea").val());
	
		if (messageContent != ""){
			socket.emit('sendChatMessageToServer', pseudo, messageContent, drawingId);
		
			updateChatWithMessage({user: pseudo, content: messageContent});
		
			$("#chatSendMessageArea").val("");
		}		
	};
	
	/* Fill the page with the current text version and the users list */
	
	socket.on('initPage', function (init) {
	
		for (var i = 0; i < init.users.length; i++) {
			addNewUser(init.users[i]);
		}
	
		// TODO : update the drawing
	});
	
	/* Update users' list when someone connects */

	socket.on('userConnection', function (newUser) {
		addNewUser(newUser);
		
		updateChatWithEvent(newUser.pseudo + " s'est connecté.");
	});
	
	socket.on('updateChatWithMessage', function (message) {
		message.content = htmlUnescape(message.content);
	
		updateChatWithMessage(message);
	});
	
	$("#chatSendMessageButton").bind("click", function () {
		sendChatMessage();
	});
	
	/* Permet d'envoyer un message en appuyant sur entrée */
	
	$("#chatSendMessageArea").keypress(function(event) {
		if ( event.which == 13 ) {
			event.preventDefault();
			sendChatMessage();
		}
	});
	
	/* When an user disconnects, its nickname is deleted */
	
	socket.on('userDisconnection', function (pseudo) {
		$("#connectedUsersList li a").each(function () {
			if ($.trim($(this).html()) == pseudo) {
				$(this).parent().remove();
			}
		});
		
		updateChatWithEvent(pseudo + " s'est déconnecté.");
	});
});