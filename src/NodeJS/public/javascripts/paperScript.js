var path;
var color;
var size;

//Rafraichissement en milliseconde;
var rafraichissement = 1;

// Initialise Socket.io
var socket = io.connect('http://localhost:3000');

var send_paths_timer;
var timer_is_active = false;
var path_to_send = {};


//Associer un Uid unique à chaque utilisateur
var uid = (function() {
     var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
} () );


var bulleStyle = {
    fillColor: new RgbColor(255, 255, 255),
    strokeColor: "black",
    strokeWidth: 1.5
};

function onMouseDown(event) {
	color = getSelectValue('color');
    path = new Path();
    path.strokeColor = color;
	path.strokeWidth = 1;
    path.add(event.point);
	
	 path_to_send = {
        rgba : color,
        start : event.point,
        path : []
    };



}
	
function onMouseDrag(event) {
    
    var step = event.delta / 2;
    step.angle += 90;
    
    var top = event.middlePoint + step;
    var bottom = event.middlePoint - step;
    
    path.add(event.point);

    // On ajoute les data au path
    path_to_send.path.push({
        point : event.point
    });

    //On push le path
    if ( !timer_is_active ) {

        send_paths_timer = setInterval( function() {

            socket.emit('draw:progress', uid, JSON.stringify(path_to_send) );
            path_to_send.path = new Array();

        }, rafraichissement);

    }

    timer_is_active = true;;
	
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
	
	path_to_send.end = event.point;
    socket.emit('draw:end', uid, JSON.stringify(path_to_send) );
    clearInterval(send_paths_timer);
    path_to_send.path = new Array();
    timer_is_active = false;
}


socket.on('draw:progress', function( artist, data ) {

    if ( artist !== uid && data ) {

       progress_external_path( JSON.parse( data ), artist );

    }

});

socket.on('draw:end', function( artist, data ) {

    if ( artist !== uid && data ) {
       end_external_path( JSON.parse( data ), artist );
    }

});


var $user_count = $('#userCount');
var $user_count_wrapper = $('#userCountWrapper');


socket.on('user:connect', function(user_count) {
    update_user_count( user_count );
});

socket.on('user:disconnect', function(user_count) {
    update_user_count( user_count );
});






// ---------
// SOCKET.IO 


function update_user_count( count ) {

    $user_count_wrapper.css('opacity', 1);
    $user_count.text( (count === 1) ? " just you, why not invite some friends?" : " " + count );

}


var external_paths = {};

//Applique les effets d'un path extérieur
var end_external_path = function( points, artist ) {

    var path = external_paths[artist];

    if (path) {
        if (Math.abs(path.firstSegment.point.x - path.lastSegment.point.x) < 30 && Math.abs(path.firstSegment.point.y - path.lastSegment.point.y) < 30) {
		path.style = bulleStyle;
		path.closed = true;
		path.simplify(20);
		view.draw();
	}
    path.add(points.end);  
	external_paths[artist] = false;
    }

};

//Continue à dessiner en temps reel
progress_external_path = function( points, artist ) {


    var path = external_paths[artist];

    if ( !path ) {

        external_paths[artist] = new Path();
        path = external_paths[artist];
        var start_point = new Point(points.start.x, points.start.y);
        path.strokeColor  = points.rgba;
		//alert(path.rgba);
        path.add(start_point);

    }

    var paths = points.path;
    var length = paths.length;
  for (var i = 0; i < length; i++ ) {
        path.add(paths[i].point);
    }

view.draw();
    



};


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