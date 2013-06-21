function addColor() {
	var colors;
	if(isHex(document.getElementById("colorHexa").value))
	{
		colors = "<option id='Color"+ document.getElementById("colorName").value +"'' value='#"+  document.getElementById("colorHexa").value  +"'> " + 	           document.getElementById("colorName").value  + "</option>";
	document.getElementById("color").innerHTML += colors;
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
		var option1 = document.getElementById("colorName").value;
		if(document.getElementById("Color" + option1) != null)
			document.getElementById("color").removeChild(document.getElementById("Color" + option1));
		else
			alert("Couleur non valide");
}
