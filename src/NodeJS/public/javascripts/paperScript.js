var path;
var color;

function onMouseDown(event) {
	color = getSelectValue('color');
    path = new Path();
    path.strokeColor = color;
    path.add(event.point);
}
	
function onMouseDrag(event) {
    if(Key.isDown('a')) {
        // If the 'a' key is down, change the point of
        // the last segment to the position of the mouse:
        path.lastSegment.point = event.point;
    } else {
        // If the a key is not down, add a segment
        // to the path at the position of the mouse:
        path.add(event.point);
    }
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