var path;
var color;
var size;
var raster;
var hasRaster = false;
var image;
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
	path.strokeWidth = 20;
    path.add(event.point);
	
	 path_to_send = {
        rgba : color,
        start : event.point,
        path : [], 
		image : 0,
		hasRaster : false
    };



}
	
function onMouseDrag(event) {
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
	if (hasRaster){
		path_to_send.hasRaster = true;
		path_to_send.image = image.src;
		hasRaster = false;
	}
		
	path_to_send.end = event.point;

    socket.emit('draw:end', uid, JSON.stringify(path_to_send) );
    clearInterval(send_paths_timer);
    path_to_send.path = new Array();
	path_to_send.hasRaster = false;
    timer_is_active = false;
	has_raster = false;
	saveCanvas();
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
	
	if (points.hasRaster)
	{
	    var img = new Image();
	    img.src = points.image
		raster = new Raster(img);
		raster.position = view.center;
		raster.scale(0.5);
		view.draw();
	}
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
        path.add(start_point);

    }

    var paths = points.path;
    var length = paths.length;
  for (var i = 0; i < length; i++ ) {
        path.add(paths[i].point);
    }
view.draw();
};

function saveCanvas()
{
	var canvas = document.getElementById('myCanvas');
	var dataURL = canvas.toDataURL();
	document.getElementById('save').href = dataURL;
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


// DRAG AND DROP

var holder = document.getElementById('holder'),
    tests = {
      filereader: typeof FileReader != 'undefined',
      dnd: 'draggable' in document.createElement('span'),
      formdata: !!window.FormData,
    }, 
    support = {
      filereader: document.getElementById('filereader'),
      formdata: document.getElementById('formdata'),
    },
    acceptedTypes = {
      'image/png': true,
      'image/jpeg': true,
      'image/gif': true
    },
    fileupload = document.getElementById('upload');
	
"filereader formdata".split(' ').forEach(function (api) {
  if (tests[api] === false) {
    support[api].className = 'fail';
  } else {
  }
});

function readfiles(files) {
    debugger;
    var formData = tests.formdata ? new FormData() : null;
    for (var i = 0; i < files.length; i++) {
      if (tests.formdata) formData.append('file', files[i]);
      previewfile(files[i]);
    }
    if (tests.formdata) {
      var xhr = new XMLHttpRequest();
      xhr.open('POST', '/devnull.php');
      xhr.onload = function() {
      };

      if (tests.progress) {
        xhr.upload.onprogress = function (event) {
          if (event.lengthComputable) {
            var complete = (event.loaded / event.total * 100 | 0);
          }
        }
      }

      xhr.send(formData);
    }
}


function previewfile(file) {
  if (tests.filereader === true && acceptedTypes[file.type] === true) {
    var reader = new FileReader();
    reader.onload = function (event) {
      image = new Image();
      image.src = event.target.result;
	  raster = new Raster(image);
	  
	  
	  raster.position = view.center;
	  
	  
	  raster.scale(0.5);
	  view.draw();
	  hasRaster = true;
    };

    reader.readAsDataURL(file);
  }  else {
    holder.innerHTML += '<p>Uploaded ' + file.name + ' ' + (file.size ? (file.size/1024|0) + 'K' : '');
    console.log(file);
  }
}

if (tests.dnd) { 
  holder.ondragover = function () { this.className = 'hover'; return false; };
  holder.ondragend = function () { this.className = ''; return false; };
  holder.ondrop = function (e) {
    this.className = '';
    e.preventDefault();
    readfiles(e.dataTransfer.files);
  }
} else {
  fileupload.className = 'hidden';
  fileupload.querySelector('input').onchange = function () {
    readfiles(this.files);
  };
}


//IMAGE DROP