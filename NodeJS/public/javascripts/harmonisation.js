function addColor() {
	var colors;
	if(isHex(document.getElementById("colorHexa").value))
	{
		colors = "<option id='Color"+ document.getElementById("colorHexa").value +"'' value='#"+  document.getElementById("colorHexa").value  +"'\
		style='background-color:#" + document.getElementById("colorHexa").value + ";' onClick='selectColor()'></option>";
		document.getElementById("color").innerHTML += colors;
		document.getElementById("colorHexa").value = '';
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
		var option = document.getElementById("colorHexa").value.toLowerCase();
		if(document.getElementById("Color" + option) != null)
		{
			document.getElementById("color").removeChild(document.getElementById("Color" + option));
			selectColor();
		}
		else
			alert("Couleur non valide");
}

function selectColor() {
	var selectedColor = getSelectValue('color');
	var R = hexToR(selectedColor);
	var G = hexToG(selectedColor);
	var B = hexToB(selectedColor)
	
	document.getElementById("color").style.backgroundColor = "rgba(" + R + "," + G + "," + B + "," + getSelectValue('opacity') / 100 + ")";
	//selectedColor;
	document.getElementById("colorHexa").style.backgroundColor = selectedColor;
	selectedColor = selectedColor.substring(1);
	document.getElementById("colorHexa").value = selectedColor.toUpperCase();
}