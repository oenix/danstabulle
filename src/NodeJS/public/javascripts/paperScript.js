var path;
var color;

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
    var myCircle = new Path.Circle(event.point, 0.2);
    myCircle.strokeColor = color;
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