$(document).ready(function() {

	var socket = io.connect();

	var pseudo = prompt("/!\\ DEV MODE /!\\ - Please select a pseudo");
	
	if (pseudo == null || pseudo == "") {
		pseudo = "Default";
	}

	/* Editor events' initialization */
	
	CKEDITOR.on('instanceCreated', function (e) {
		e.editor.on('change', function (ev) {
			socket.emit('newTextVersion', ev.editor.getData()); 
		});
	
		e.editor.on('blur', function (ev) {
			saveEditorText(e.editor.getData());
		});
	});
	
	CKEDITOR.plugins.registered['save'] = {
		init : function (editor) {
			var command = editor.addCommand( 'save',
				{
					modes : { wysiwyg:1, source:1 },
					exec : function( editor ) {
						saveEditorText(editor.getData());
					}
				}
			);
			editor.ui.addButton( 'Save',{label : 'Save',command : 'save'});
		}
	}
	
	/* Tell the server the new user's connection */

	socket.emit('newUserConnection', pseudo); 

	/* Prevent editing from multiple users */
	
	function setReadOnlyEditor(isReadOnly){

		CKEDITOR.instances.editor.setReadOnly(isReadOnly);
	
		if (isReadOnly) {
			$('#isReadOnlySpan').show();
		}
		else {
			$('#isReadOnlySpan').hide();
		}
	}

	/* Add an user to the users' list */

	function addNewUser(newUser){
		$('#connectedUsersList').append("<li clientId='" + newUser.id + "'><a href='#' target='_blank'>" + newUser.pseudo + "</a></li>");
	}
	
	/* Update the content of the text editor */
  
	function updateEditorText(text){
		CKEDITOR.instances.editor.setData(text);
	}
	
	/* Send the text to the server in order to be saved */
	
	function saveEditorText(text){
		socket.emit('saveEditorText', text);
	}

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
		
		updateChatWithEvent(newUser.pseudo + " s'est connecte.");
	});
	
	/* When an user disconnects, its nickname is deleted */
	
	socket.on('userDisconnection', function (user) {
		$("#connectedUsersList li").each(function () {
			if ($(this).attr("clientId") == user.id) {
				$(this).remove();
			}
		});
		
		updateChatWithEvent(user.pseudo + " s'est deconnecte.");
	});
	
	/* Scenario chat management */

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
		messageContent = $("#chatSendMessageArea").val();
	
		if (messageContent != ""){
			socket.emit('sendChatMessageToServer', pseudo, messageContent);
		
			updateChatWithMessage({user: pseudo, content: messageContent});
		
			$("#chatSendMessageArea").val("");
		}		
	};
	
	socket.on('updateChatWithMessage', function (message) {
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
	
	/* */
  
	socket.on('updateEditorText', function (text) {
	
		if (text != "")
		{
			updateEditorText(text);
		}
	
		//setReadOnlyEditor();
	});
});