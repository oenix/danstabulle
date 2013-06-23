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
	document.getElementById("color").style.backgroundColor = selectedColor;
	document.getElementById("colorHexa").style.backgroundColor = selectedColor;
	selectedColor = selectedColor.substring(1);
	document.getElementById("colorHexa").value = selectedColor.toUpperCase();
}