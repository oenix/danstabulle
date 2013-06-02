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

	var pseudo = GetURLParameter("pseudo");
		
	if (pseudo == undefined || pseudo == null) {
		pseudo = "oenix" + Math.floor(Math.random() * 201);
	}

	/* Editor events' initialization */	
	
	tinyMCE.init({
		mode : "textareas", 
		theme : "advanced", 
		editor_selector :"mceEditor",
		plugins : "advhr,insertdatetime,preview,save", 
		save_onsavecallback: function() {console.log("Save");},
		width : 670,
		height : 496,
		theme_advanced_buttons1 : "bold,italic,underline,|,justifyleft,justifycenter,justifyright,|,fontselect,formatselect",
		theme_advanced_buttons2 : "save,|,sub,sup,|,undo,redo,|,bullist,numlist,|,outdent,indent,|,link,unlink,image,|,forecolor",
		theme_advanced_toolbar_location : "top",
		theme_advanced_toolbar_align : "left",
		theme_advanced_statusbar_location : "none",
		theme_advanced_resizing : false,
			
		setup : function(ed) {
			ed.onKeyUp.add(function(ed, e) {
				sendEditorText(ed.getContent());
			});
			
			ed.onChange.add(function(ed, e) {
				sendEditorText(ed.getContent());
			});

			ed.onUndo.add(function(ed, e) {
				sendEditorText(ed.getContent());
			});
			
			ed.onRedo.add(function(ed, e) {
				sendEditorText(ed.getContent());
			});
			
			ed.onInit.add(function(ed, evt) {
				tinymce.dom.Event.add(ed.getDoc(), 'blur', function(e) {
					saveEditorText(ed.getContent());
				});
			});
		}
	});
	
	/* Get the scenario Id from the GET parameter */
	
	var scenarioId = GetURLParameter("id");
	
	if (scenarioId == undefined) {
		scenarioId = "1";
	}
	
	/* Tell the server the new user's connection */

	socket.emit('newUserConnection', {scenarioId: scenarioId, pseudo: pseudo});

	/* Add an user to the users' list */

	function addNewUser(newUser) {
		$('#connectedUsersList').append("<li clientId='" + newUser.id + "'><a href='#' target='_blank'>" + newUser.pseudo + "</a></li>");
	}
	
	/* Update the content of the text editor */
  
	function updateEditorText(text) {
		tinyMCE.activeEditor.setContent(text);
	};
	
	/* Send the new text to the server for broadcasting */
	
	function sendEditorText(text) {
		socket.emit('newTextVersion', {scenarioId: scenarioId, newText: text}); 
	};
	
	/* Send the text to the server in order to be saved */
	
	function saveEditorText(text){
		socket.emit('saveEditorText', {scenarioId: scenarioId, text: text});
	};

	/* Fill the page with the current text version and the users list */
	
	socket.on('initPage', function (init) {
	
		for (var i = 0; i < init.clients.length; i++) {
			addNewUser(init.clients[i]);
		}
	
		updateEditorText(init.text);
	});
	
	/* Update users' list when someone connects */

	socket.on('userConnection', function (newUser) {
		addNewUser(newUser);
		
		updateChatWithEvent(newUser.pseudo + " s'est connecté.");
	});
	
	/* When an user disconnects, its nickname is deleted */
	
	socket.on('userDisconnection', function (user) {
		$("#connectedUsersList li").each(function () {
			if ($(this).attr("clientId") == user.id) {
				$(this).remove();
			}
		});
		
		updateChatWithEvent(user.pseudo + " s'est déconnecté.");
	});
	
/* START OF Scenario chat management */

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
			socket.emit('sendChatMessageToServer', pseudo, messageContent, scenarioId);
		
			updateChatWithMessage({user: pseudo, content: messageContent});
		
			$("#chatSendMessageArea").val("");
		}		
	};
	
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
	  
	socket.on('updateEditorText', function (text) {
			updateEditorText(text);
	});
	
/* END OF Scenario chat management */

});