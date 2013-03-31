var path;
var color;

var bulleStyle = {
    fillColor: new RgbColor(255, 255, 255),
    strokeColor: "black",
    strokeWidth: 1.5
};

function onMouseDown(event) {
	color = getSelectValue('color');
    path = new Path();
    path.strokeColor = color;
    path.add(event.point);
}
	
function onMouseDrag(event) {
    path.add(event.point);
}

function onMouseUp(event) {
	if (path.length < 5) {
    	var myCircle = new Path.Circle(event.point, 0.2);
    	myCircle.strokeColor = color;
	}
	//Si C'est une bulle :
	if (Math.abs(path.firstSegment.point.x - path.lastSegment.point.x) < 30 && Math.abs(path.firstSegment.point.y - path.lastSegment.point.y) < 30) {
		path.style = bulleStyle;
		path.closed = true;
		path.simplify(20);
	}
//	alert(path[path.length() - 1)]);
}

function getSelectValue(selectId)
{
	var elmt = document.getElementById(selectId);
	if(elmt.multiple == false)
	{
		return elmt.options[elmt.selectedIndex].value;
	}
	var values = new Array();
	for(var i=0; i< elmt.options.length; i++)
	{
		if(elmt.options[i].selected == true)
		{
			values[values.length] = elmt.options[i].value; 
		}
	}	
	return values;	
}