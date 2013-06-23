var harmo = {
	color : null,
	delColor : null
};

function addColor() {
	harmo.color = null;
	var colors;
	if(isHex(document.getElementById("colorHexa").value))
	{
		harmo.color = document.getElementById("colorHexa").value.toUpperCase();
		colors = "<option id='Color"+ harmo.color +"'' value='#"+  harmo.color  +"' style='background-color:#" + harmo.color + ";' onClick='selectColor()'></option>";
		document.getElementById("color").innerHTML += colors;
		document.getElementById("colorHexa").value = '';
		socket.emit('harmonisation:end', uid, JSON.stringify(harmo));
	    harmo.color = null;
	}
	else
		alert("Couleur non valide");
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
		console.log(option);
		if(document.getElementById("Color" + option) != null)
		{
			document.getElementById("color").removeChild(document.getElementById("Color" + option));
			selectColor();
			harmo.delColor = option;
			socket.emit('harmonisation:end', uid, JSON.stringify(harmo));
		}
		else
			alert("Couleur non valide");
		harmo.delColor = null;
}

function selectColor() {
	var selectedColor = getSelectValue('color');
	var R = hexToR(selectedColor);
	var G = hexToG(selectedColor);
	var B = hexToB(selectedColor)
	
	document.getElementById("color").style.backgroundColor = "rgba(" + R + "," + G + "," + B + "," + getSelectValue('opacity') / 100 + ")";
	document.getElementById("colorHexa").style.backgroundColor = selectedColor;
	selectedColor = selectedColor.substring(1);
	document.getElementById("colorHexa").value = selectedColor;
}

//EXTERN


var syncHarmonisation = function (points, artist){
	if (points.color != null) {
		addExternColor(points.color);
	}
	else if (points.delColor != null) {
		deleteExternColor(points.delColor);
	}
}

function addExternColor(color) {
		var colors = "<option id='Color"+ color +"'' value='#"+ color +" 'style='background-color:#" + color + ";' onClick='selectColor()'></option>";
		document.getElementById("color").innerHTML += colors;
}

function deleteExternColor(color) {
		document.getElementById("color").removeChild(document.getElementById("Color" + color));
		selectColor();
}