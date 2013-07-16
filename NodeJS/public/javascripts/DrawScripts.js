var tool1, tool2, tool3, tool4;
var path;
var color;
var size;
var image;
var opacity;
var pathList = [];
var currentElement = -1;
var pathListExtern = [];
var currentElementExtern = -1;
var remove = -1;
var selected, segment;
//Rafraichissement en milliseconde;
var rafraichissement = 1;
// Initialise Socket.io
var socket = io.connect('http://localhost:3000');

var send_paths_timer;
var timer_is_active = false;
var path_to_send = {};
var path_to_send2 = {};
var drawForMe = [];


var rectangleForMe;

var layer = [];
var layerOpacity = [];
var selectedLayer = [];
var activeLayer = 0;
var positionLayer = [];
var fusionLayer = [];

var selectLayerBounds;
var hasDoubleClickedLayer = false;


socket.emit('loadPalette:end', uid);
socket.emit('loadRessources:end', uid);

Array.prototype.unset = function(val){
	var index = this.indexOf(val)
	if(index > -1){
		this.splice(index,1)
	}
}

function getSelectValue(selectId) {
        var elmt = document.getElementById(selectId);
        if (elmt.multiple == false) {
            return elmt.options[elmt.selectedIndex].value;
        }
        var values = new Array();
        for (var i = 0; i < elmt.options.length; i++) {
            if (elmt.options[i].selected == true) {
                values[values.length] = elmt.options[i].value;
            }
        }
        return values;
    }

function changeLayerOpacity(numOpacity, numLayer)
{
	layerOpacity[numLayer] = numOpacity;
	layer[numLayer].opacity = numOpacity / 100;
	path_to_send.layerOpacity = layerOpacity;
	socket.emit('draw:end', uid, JSON.stringify(path_to_send));
}

function printLayers() {
    var htmlLayer = "";
    for (var i = 0; i < layer.length; i++)  {
        var checked = "";
        if (selectedLayer[i])
            checked = "checked='checked'";
        if (i == activeLayer) {
            htmlLayer = htmlLayer + "<li onDblclick='selectLayer(" + i + ") '  draggable='true'> \
			<input type='checkbox' onclick='showLayer(" + i + ")'" + checked + " id='visible" + i + "'> \
			<a class='selectedLayer'  onMouseOut='showUnselected(" + i + ")' onMouseOver='showSelected(" + i + ")' \
			href='javascript:activateLayer(" + i + ");'>Calque " + i + "</a> <a href='javascript:deleteLayer(" + i + ");'>Delete</a> \
			Opacité : " + createSelectOptionForLayer(i) + " Fusion : " + fusionMode(i) + "\
			<a href='javascript:layerUp(" + i + ")'>Monter</a>/<a href='javascript:layerDown(" + i + ") '>Descendre</a> </li>";
        } else {
            htmlLayer = htmlLayer + "<li onDblclick='selectLayer(" + i + " )' draggable='true'> \
						<input type='checkbox' onclick='showLayer(" + i + ")' " + checked + "  id='visible" + i + "'> \
						<a  onMouseOut='showUnselected(" + i + ")' onMouseOver='showSelected(" + i + ")' href='javascript:activateLayer(" + i + ");'>Calque " + i + "</a> \
						<a href='javascript:deleteLayer(" + i + ");'>Delete</a> Opacité : " + createSelectOptionForLayer(i) + " Fusion : " + fusionMode(i) +" \
			<a href='javascript:layerUp(" + i + ")'>Monter</a>/<a href='javascript:layerDown(" + i + ") '>Descendre</a></li>";
        }
    }
    document.getElementById("calques").innerHTML = htmlLayer;
    for (var i = 0; i < layer.length; i ++) {
		document.getElementById("layer" + i).selectedIndex = 100 - layerOpacity[i];
    }

}

function changeLayerFusion(mode, nbLayer) {
		layer[nbLayer].blendMode = mode;
}

function fusionMode(layer) {
		var fusionMode = "<select>";
		fusionMode += "<option onclick='changeLayerFusion(\"normal\", " + layer + " )' value='0'>Normal</option>" 
		+ 			   "<option onclick='changeLayerFusion(\"screen\", " + layer + ")' >Ecran</option>"
	    +				"<option onclick='changeLayerFusion(\"multiply\", " + layer + ")' >Multiplier</option>"
		+ 				"<option onclick='changeLayerFusion(\"overlay\", " + layer + ")' >Par dessus</option>"
		+ "</select>";
		return fusionMode;
}


function layerUp(nbLayer) {
		if (nbLayer > 0) {
				layer[nbLayer].insertBelow(layer[nbLayer - 1]);
				var l = layer[nbLayer];
				layer[nbLayer] = layer[nbLayer - 1];
				layer[nbLayer - 1] = l;
				path_to_send.up = nbLayer;
				path_to_send.positionLayer = null;
				socket.emit('draw:end', uid, JSON.stringify(path_to_send));
				path_to_send.up = null;
		}
}

function layerDown(nbLayer) {
		if (nbLayer < layer.length - 1) {
				layer[nbLayer].insertAbove(layer[nbLayer + 1]);
				var l = layer[nbLayer];
				layer[nbLayer] = layer[nbLayer + 1];
				layer[nbLayer + 1] = l;
				path_to_send.down = nbLayer;
				path_to_send.positionLayer = null;
				socket.emit('draw:end', uid, JSON.stringify(path_to_send));
				path_to_send.down = null;
		}
}

function showSelected(nbLayer) {
    if (!hasDoubleClickedLayer) {
		createLayerBorder(nbLayer);
		 layer[nbLayer].selected = true;
	}
}

function showUnselected(nbLayer) {
		if (!hasDoubleClickedLayer) {
				if (selectLayerBounds != null) {
						selectLayerBounds.remove();
				}
				  layer[nbLayer].selected = false;	
		}
}


function activateLayer(nbLayer) {
    layer[nbLayer].activate();
    activeLayer = nbLayer;
    printLayers();
}

function showLayer(nbLayer) {

    if (checked("visible" + nbLayer)) {
        selectedLayer[nbLayer] = true;
        layer[nbLayer].visible = true;
    } else {
        selectedLayer[nbLayer] = false;
        layer[nbLayer].visible = false;
    }
}

function selectLayer(nbLayer) {
   for (var i = 0; i < layer.length; i++) {
				layer[i].selected = false;
   }
    hasDoubleClickedLayer = true;
	layer[nbLayer].selected = true;
	layer[nbLayer].bounds.selected = true;
	createLayerBorder(nbLayer);
	tool5.activate();
}

function createLayerBorder(nbLayer) {
	if (selectLayerBounds != null) {
		selectLayerBounds.remove();
	}
    selectLayerBounds = new Path.Rectangle(layer[nbLayer].strokeBounds);
    selectLayerBounds.strokeWidth = 0.25;
	selectLayerBounds.strokeColor = 'black';
	selectLayerBounds.fillColor = null;
}

function newLayer() {
    layer.push(new Layer());
    selectedLayer.push(true);
    layerOpacity.push(100);
    activeLayer = selectedLayer.length - 1;
    printLayers();
    positionLayer.push(new paper.Point(layer[activeLayer].position.x, layer[activeLayer].position.y));

}

function sendNewLayer() {
    path_to_send.newLayer = true;
    path_to_send.positionLayer = positionLayer;
    socket.emit('draw:end', uid, JSON.stringify(path_to_send));
    path_to_send.newLayer = false;
}

function deleteLayer(id) {
    layer[id].remove();
    layerOpacity.unset(layerOpacity[id]);
    positionLayer.unset(positionLayer[id]);
    layer.unset(layer[id]);
	selectedLayer.unset(selectedLayer[id])
	activeLayer = selectedLayer.length - 1;
	selectedLayer[selectedLayer.length - 1] = true;
	if (activeLayer > 0) {
		layer[activeLayer].activate();
	}
    printLayers();
    path_to_send.deleteLayer = id;
    socket.emit('draw:end', uid, JSON.stringify(path_to_send));
    path_to_send.deleteLayer = -1;
}

function checked(id) {
    checkbox = document.getElementById(id);
    if (checkbox.checked) {
        return true;
    }
    return false;
}


//Associer un Uid unique à chaque utilisateur
var uid = (function () {
    var S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}());


function undo() {
    if (currentElement >= 0) {
        pathList[currentElement].remove();
        view.draw();
        remove = currentElement;
        currentElement--;
        path_to_send = {
            remove: remove
        };
        socket.emit('draw:end', uid, JSON.stringify(path_to_send));
        remove = -1;
    }
}

function redo() {
    if (currentElement < pathList.length - 1) {
        project.activeLayer.addChild(pathList[currentElement + 1]);
        view.draw();

        add = currentElement;
        currentElement++;
        path_to_send = {
            add: add
        };
        socket.emit('draw:end', uid, JSON.stringify(path_to_send));
        add = -2;

    }
}

function autocomplete() {
    var i = 0;
    for (i = pathList.length - 1; i >= 0; i--) {


        for (var j = 0; j < 15; j++) {
            //      pathList[i].simplify();
            var clone = pathList[i].clone();
            //clone.smooth();
            //clone.simplify();
            clone.position = clone.position.add(new Point(clone.position.x + (60 * j + 1), 0));
            //clone.simplify();
        }
    }
    view.draw();
}

function activateTool(tool) {
    if (tool == "tool1")
        tool1.activate();
    else if (tool == "tool2")
        tool2.activate();
    else if (tool == "tool3")
        tool3.activate();
    else
        tool4.activate();
}

$(function(){
    var $select = $(".1-100");
    for (i=100;i>=0;i--){
        $select.append($('<option></option>').val(i).html(i))
    }
});

function createSelectOptionForLayer(layer) {    
    var select_option = "<select id =layer" + layer + ">";
    for(i = 100; i >= 0; i--) { 
       select_option += "<option onclick='changeLayerOpacity("+ i + ", " + layer + ")'  value=" + i + ">" + i + "</option>";
    }
    select_option += '</select>';
    return select_option;
}

$(function() {

  function createDataTransfers()
  {
	$.event.props.push('dataTransfer');
	dragLayers();
  }

  var dragLayers = function() {
	 var i, $this, $log = $('#log');

	    $('#calques li').on({
	        // on commence le drag
	        dragstart: function(e) {
	            $this = $(this);
	            i = $(this).index();
	            $(this).css('opacity', '1');

	            // on garde le texte en mémoire (A, B, C ou D)
	            e.dataTransfer.setData('text/html', $(this).html());
	        },
	        // on passe sur un élément draggable
	        dragenter: function(e) {
	            // on augmente la taille pour montrer le draggable

	            e.preventDefault();
	        },
	        // on quitte un élément draggable
	        dragleave: function() {
	            // on remet la taille par défaut
	       
	        },
	        // déclenché tant qu on a pas lâché l élément
	        dragover: function(e) {
	            e.preventDefault();
	
	        },
	        // on lâche l élément
	        drop: function(e) {
	            // si l élément sur lequel on drop n'est pas l'élément de départ
	            if (i !== $(this).index()) {
	                // on récupère le texte initial
	                var data = e.dataTransfer.getData('text/html');

	 

	                // on met le nouveau texte à la place de l ancien et inversement
	              	$this.html($(this).html());
					$(this).html(data);
	            }

	        },
	        // fin du drag (même sans drop)
	        dragend: function() {
	        },

	    });
  }


  $("#newLayer").hover(createDataTransfers);

});