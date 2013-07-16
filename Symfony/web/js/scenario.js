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

	var socket = io.connect('http://localhost:3000');

	var pseudo = pseudoScenario;
		
	if (pseudo == undefined || pseudo == null || pseudo == "") {
		pseudo = "oenix" + Math.floor(Math.random() * 201);
	}



	/* Editor events' initialization */	
	
	tinyMCE.init({
		mode : "textareas", 
		theme : "advanced", 
		editor_selector :"mceEditor",
		plugins : "advhr,insertdatetime,preview,save", 
		save_onsavecallback: function() {saveEditorText(tinyMCE.get("tinyEditor").getContent());},
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
	
	var scenarioId = idScenario;
	
	if (scenarioId == undefined) {
		scenarioId = "1";
	}
	
	/* Tell the server the new user's connection */

	socket.emit('newUserConnection', {scenarioId: scenarioId, pseudo: pseudo});

	/* Add an user to the users' list */

	function addNewUser(newUser) {
		$('#connectedUsersList').append("<li><a href='#' target='_blank'>" + newUser.pseudo + "</a></li>");
	}
	
	/* Update the content of the text editor */
  
	function updateEditorText(text) {
		tinyMCE.activeEditor.setContent(text);
	};
	
	/* Send the content of the scenario framework to the server */
  
	function sendScenarioFramework() {
	
		summary = $("#scenarioStoryMain p").html();
		
		places = [];
		characters = [];

		$("#scenarioPlacesMain dt").each(function (index)
		{
			places.push({name: $(this).html(), description: ""});
		});
		
		$("#scenarioPlacesMain dd").each(function (index)
		{
			places[index].description = $(this).html();
		});
		
		$("#scenarioCaractersMain dt").each(function (index)
		{
			characters.push({name: $(this).html(), description: ""});
		});
		
		$("#scenarioCaractersMain dd").each(function (index)
		{
			characters[index].description = $(this).html();
		});
	
		scenarioFramework = {summary: summary, places: places, characters: characters};
		
		socket.emit('sendScenarioFramework', scenarioId, scenarioFramework);
	};
	
	function updateScenarioFramework(framework)
	{
		$("#scenarioStoryMain p").html(framework.summary);
	
		$("#scenarioPlacesMain dl").html("");
		
		for (var i = 0; i < framework.places.length; i++)
		{
			$("#scenarioPlacesMain dl").append("<dt class=\"editable\">" + framework.places[i].name + "</dt>");
			$("#scenarioPlacesMain dl").append("<dd class=\"editable\">" + framework.places[i].description + "</dd>");
		}
		
		$("#scenarioCaractersMain dl").html("");

		for (var i = 0; i < framework.characters.length; i++)
		{
			$("#scenarioCaractersMain dl").append("<dt class=\"editable\">" + framework.characters[i].name + "</dt>");
			$("#scenarioCaractersMain dl").append("<dd class=\"editable\">" + framework.characters[i].description + "</dd>");
		}
		
		 $('.editable').editable(editableCallback, { 
			 type     : 'textarea',
			 width : 400,
			 height : 60,
			 tooltip   : "Cliquez pour éditer !",
			 onblur : "submit",
			 callback : function (v, s) {
				sendScenarioFramework();
			}
		});
	}
	
	/* Send the new text to the server for broadcasting */
	
	function sendEditorText(text) {
		socket.emit('newTextVersion', {scenarioId: scenarioId, newText: text}); 
	};
	
	/* Send the text to the server in order to be saved */
	
	function saveEditorText(text){
            
            $.ajax({
                url: urlScenario,
                type: "POST",
                data: {content:"kiki"}
            });
	
            //socket.emit('saveEditorInDatabase', {scenarioId: scenarioId, newText: text});
	};

	/* Fill the page with the current text version and the users list */
	
	socket.on('initPage', function (init) {
	
		for (var i = 0; i < init.users.length; i++) {
			addNewUser(init.users[i]);
		}
	
		updateEditorText(init.text);
		updateScenarioFramework(init.framework);
	});
	
	/* Update users' list when someone connects */

	socket.on('userConnection', function (newUser) {
		addNewUser(newUser);
		
		updateChatWithEvent(newUser.pseudo + " s'est connecté.");
	});
	
	socket.on("updateScenarioFramework", function (framework) {
		updateScenarioFramework(framework);
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
			socket.emit('sendChatMessageToServer', pseudo, messageContent, true, scenarioId);
		
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

	/* Fancybox gestion */
	
	$('#scenarioStructure').fancybox();
	
	$('#scenarioStoryMain').show();
	
	$("#helperTrame").bind("click", function () {
		$('#scenarioStoryMain').show();
		$('#scenarioCaractersMain').hide();
		$('#scenarioPlacesMain').hide();
	});
	
	$("#helperPerso").bind("click", function () {
		$('#scenarioStoryMain').hide();
		$('#scenarioCaractersMain').show();
		$('#scenarioPlacesMain').hide();
	});
	
	$("#helperLieux").bind("click", function () {
		$('#scenarioStoryMain').hide();
		$('#scenarioCaractersMain').hide();
		$('#scenarioPlacesMain').show();
	});
	
	/* jsEditable management */
	
	function editableCallback (v, s)
	{
		return v;
	}

	 $('.editable').editable(editableCallback, { 
     type     : 'textarea',
	 width : 400,
	 height : 60,
	 tooltip   : "Cliquez pour éditer !",
	 onblur : "submit",
	 callback : function (v, s) {
		sendScenarioFramework();
	}
 });
});