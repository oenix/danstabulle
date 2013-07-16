var harmo = {
	color : null,
	delColor : null
};

var nbRessources = 0;
var ressourceURL = [];
var nbCouleurs = 0;
var palette = [];

function addColor() {
	harmo.color = null;
	var colors;
	if(isHex(document.getElementById("colorHexa").value))
	{
		harmo.color = document.getElementById("colorHexa").value.toUpperCase();
		colors = "<a id='Color" + harmo.color + "'class='btn-color animated bounceIn' style='background-color:#" + harmo.color + "' onclick='chooseColor(\"Color" + harmo.color +"\")'></a>";
		//colors = "<option id='Color"+ harmo.color +"'' value='#"+  harmo.color  +"' style='background-color:#" + harmo.color + ";' onClick='selectColor()'></option>";
		document.getElementById("color").innerHTML += colors;
		document.getElementById("colorHexa").value = '';
		socket.emit('harmonisation:end', uid, JSON.stringify(harmo));
		palette.push("#" + harmo.color);
	    harmo.color = null;
		saveColor();
		nbCouleurs += 1;
	}
	else
		alert("Couleur non valide");
}

var loadColors = function (colors, artist) {
	var addColor = "";
	for (var i = 0; i < colors.length - 1; i++) {
		colors[i] = colors[i].slice(1);
		if (i == 0) {
			addColor += "<a id='Color" + colors[i] + "' class='btn-color active-color' style='background-color:#" + colors[i] + "' onclick='chooseColor(\"Color" + colors[i]  +"\")'></a>";
		}
		else {
			addColor += "<a id='Color" + colors[i]  + "' class='btn-color' style='background-color:#" + colors[i] + "' onclick='chooseColor(\"Color" + colors[i] +"\")'></a>";
		}
		nbCouleurs += 1;
		palette.push("#" + colors[i]);
	}
	document.getElementById("color").innerHTML = addColor;
}

function saveColor() {
	var colToSave = "";
	for (var i = 0; i < palette.length; i++) {
		
		colToSave += palette[i] + '\n';
	}
	socket.emit('savePalette:end', uid, colToSave);
}

function isHex(val){
    if (isNaN(parseInt("0X" + val))) {
        return false
    }
    else{
        return true;
    }
}
function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}

function delColor() {
	var option = document.getElementById("colorHexa").value;
	if(document.getElementById("Color" + option) != null)
	{
		
		var ca = document.getElementById("Color" + option)
		ca.className += "animated bounceOut";
		console.log(ca);
		setTimeout(function(){
		document.getElementById("color").removeChild(document.getElementById("Color" + option));
		var col = document.getElementsByClassName('btn-color');
		col[0].className = "btn-color active-color";
		selectColor();
		harmo.delColor = option;
		socket.emit('harmonisation:end', uid, JSON.stringify(harmo));
		var toDel = 0;
		for (var i =0; i < palette.length; i++){
			if (palette[i] == "#" + option) {
				toDel = i;
			}
		}
		palette.unset(palette[toDel]);
		saveColor();
		}, 1000);
	}
	else
		alert("Couleur non valide");
	harmo.delColor = null;
}

function selectColor() {
	var col = document.getElementsByClassName('active-color');
	var colores = col[0].id.slice(5);
	colores = ("#" + colores).toUpperCase();;
	var selectedColor = colores;
	var R = hexToR(selectedColor);
	var G = hexToG(selectedColor);
	var B = hexToB(selectedColor)
	
	document.getElementsByClassName('active-color')[0].style.backgroundColor = "rgba(" + R + "," + G + "," + B + "," + getSelectValue('opacity') / 100 + ")";
	document.getElementById("colorHexa").style.backgroundColor = selectedColor;
	selectedColor = selectedColor.substring(1);
	document.getElementById("colorHexa").value = selectedColor;
}

function createRessource(save) {
	if (save == 0) {
		for (var i = 0; i < layer.length; i++) {
				layer[i].visible = true;
		}
		setTimeout(saveRessources, 100);
		setTimeout(function() {
			for (var i = 0; i < layer.length; i++) {
			if (selectedLayer[i])
				layer[i].visible = true;
			else
				layer[i].visible = false;
		}},100);
	}
	else if (save == 2) {
		saveRessources();
	}
	var can = document.getElementById("myCanvas");
	can.className = can.className + "animated bounceOutDown";
	setTimeout(function() {
		var can = document.getElementById("myCanvas");
		can.className = "";
	}, 1000);
}


function saveRessources() {
	var canvasToSave = document.getElementById("myCanvas");
	var dataURL = canvasToSave.toDataURL();
	ressourceURL.push(dataURL);
	/*var createdCanvas = "<div class='span4' id='ressource" + nbRessources + "'>\
					<div id='r"+ nbRessources +"'>\
					<div id='holder'>\
					<img id='imageRessource" + nbRessources + "' width='306' height='212' src='" + dataURL +"'/>\
					</div>\
					<button class='btn btn-small btn-success' onClick='loadRessource(\"imageRessource"+ nbRessources +"\")'>Charger</button>\
					<button class='btn btn-small btn-danger' onClick='deleteRessource(\"ressource"+ nbRessources +"\")'>Supprimer</button>\
			</div>";
	*/
		var createdCanvas = "<div class='span4' id='ressource" + nbRessources + "'>\
						<div id='r"+ nbRessources +"'>\
						<img  style='border: 2px solid #CCC; ' id='imageRessource" + nbRessources + "' width='306' height='212' src='" + dataURL +"'/>\
						<button class='btn btn-small btn-success' onClick='loadRessource(\"imageRessource"+ nbRessources +"\")'>Charger</button>\
						<button class='btn btn-small btn-danger' onClick='deleteRessource(\"ressource"+ nbRessources +"\")'>Supprimer</button>\
				</div>";
	

	document.getElementById("ressources").innerHTML += createdCanvas;
	nbRessources += 1;
	var ressourceToSave = "";
	for (var i = 0; i < ressourceURL.length; i++) {
		ressourceToSave += ressourceURL[i] + "\n";
	}
	
	socket.emit('saveRessources:end', uid, ressourceToSave);

}

function deleteRessource(id) {
	var element = document.getElementById(id)
	var el2 = document.getElementById("r" + id[id.length -1]);
	console.log("r" + id[id.length -1]);
	if (confirm("Etes vous sur de vouloir supprimmer cette ressource ?")) {
		el2.className = "animated hinge"
			setTimeout(function() {
		element.parentNode.removeChild(element);
		ressourceURL.unset(ressourceURL[parseInt(id[id.length - 1])]);
		var ressourceToSave = "";
		for (var i = 0; i < ressourceURL.length; i++) {
			ressourceToSave += ressourceURL[i] + "\n";
		}
		console.log(ressourceToSave);
		socket.emit('saveRessources:end', uid, ressourceToSave);
	}, 2000);
	}
}

function loadRessource(id) {
	var src = document.getElementById(id).src;
	var llayer = activeLayer;
	newLayer();
	var image = new Image();
	image.src = src;
	raster = new Raster(image);
	raster.position = view.center;
	pathList.push(raster);
	currentElement ++;
	activeLayer = llayer;
	printLayers();
}


function restoreRessources(data, artist) {
	nbRessources = 0;
	for (var i = 0; i < data.length - 1; i++) {
		var dataURL = data[i];
		ressourceURL.push(dataURL);
		var createdCanvas = "<div class='span4' id='ressource" + nbRessources + "'>\
						<div id='r"+ nbRessources +"'>\
						<img  style='border: 2px solid #CCC; ' id='imageRessource" + nbRessources + "' width='306' height='212' src='" + dataURL +"'/>\
						<button class='btn btn-small btn-success' onClick='loadRessource(\"imageRessource"+ nbRessources +"\")'>Charger</button>\
						<button class='btn btn-small btn-danger' onClick='deleteRessource(\"ressource"+ nbRessources +"\")'>Supprimer</button>\
				</div>";
	
		document.getElementById("ressources").innerHTML += createdCanvas;
		nbRessources += 1;
	}
}

//EXTERN


socket.on('loadColors:end', function (artist, data) {

        if (artist !== uid && data) {
            loadColors(JSON.parse(data), artist);
        }
    });

socket.on('loadRessources:end', function (artist, data) {
	
        if (artist !== uid && data) {
            restoreRessources(JSON.parse(data), artist);
	    console.log("coucou");
        }
    });

var syncHarmonisation = function (points, artist){
	if (points.color != null) {
		addExternColor(points.color);
	}
	else if (points.delColor != null) {
		deleteExternColor(points.delColor);
	}
}

function addExternColor(color) {
		var colors = "<a id='Color" + color  + "' class='btn-color' style='background-color:#" + color + "' onclick='chooseColor(\"Color" + color +"\")'></a>";
		document.getElementById("color").innerHTML += colors;
}

function deleteExternColor(color) {
		document.getElementById("color").removeChild(document.getElementById("Color" + color));
		selectColor();
}