var tool1, tool2;
var path;
var color;
var size;
var raster;
var hasRaster = false;
var image;
var opacity;
var pathList = [];
var currentElement = -1;
var pathListExtern = [];
var currentElementExtern = -1;
var remove = -1;
var selected, segment;
//Rafraichissement en milliseconde;
var rafraichissement = 1;
// Initialise Socket.io
var socket = io.connect('http://localhost:3000');

var send_paths_timer;
var timer_is_active = false;
var path_to_send = {};
var path_to_send2 = {};

function checked(id)
{
	checkbox = document.getElementById("smooth");
	checkbox = document.getElementById("smooth");
	if (checkbox.checked)
	{
		return true;
	}
		return false;
}


	//Associer un Uid unique à chaque utilisateur
var uid = (function() {
	 var S4 = function() {
	   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
	};
	return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
} () );


function undo()
{
	if(currentElement >= 0)
	{
		pathList[currentElement].remove();
		view.draw();
		remove = currentElement;
		currentElement--;
		path_to_send = {
		remove : remove
		};
		socket.emit('draw:end', uid, JSON.stringify(path_to_send) );
		remove = -1;
	}
}
function redo()
{
	if(currentElement < pathList.length - 1)
	{
		project.activeLayer.addChild(pathList[currentElement + 1]);
		view.draw();
		
		add = currentElement;
		currentElement ++;
		path_to_send = {
		add : add
		};
		socket.emit('draw:end', uid, JSON.stringify(path_to_send) );
		add = -2;
		
	}
}


function activateTool(tool)
{
	if (tool == "tool1")
		tool1.activate();
	else
		tool2.activate();
		
}


	paper.install(window);
	
	

	window.onload = function() {
	paper.setup('myCanvas');
	tool1 = new Tool();
	tool2 = new Tool();
	function text(position, texte)
{

	var text = new PointText(position);
	text.content = prompt("Texte de la bulle","");
	if (text.content == "null")
	{
		text.content = "";
		return false;
	}
	text.fillColor = 'black';
	text.font = "Script";
	text.fontSize = 15;
	
	text.point.x = text.point.x - text.point.length / 12;
	text.point.y = text.point.y - text.point.length /50;
	pathList.push(text);
	return true;
}
	
	var movePath = false;
	var bulleStyle = {
	fillColor: new RgbColor(255, 255, 255),
	strokeColor: "black",
	strokeWidth: 1.5
};

tool2.onMouseDown = function(event) {
	var hitResult = paper.project.hitTest(event.point);
    if (!hitResult)
        return;
	selected = hitResult.item;
	
	
  if (event.modifiers.shift) {
        if (hitResult.type == 'segment') {
            hitResult.segment.remove();
        }
        return;
    }
	
	if (hitResult) {
        path = hitResult.item;
        if (hitResult.type == 'segment') {
            segment = hitResult.segment;
        } //else if (hitResult.type == 'stroke') {
            //var location = hitResult.location;
      //      segment = path.insert(location.index + 1, event.point);
        //    path.smooth();
      //  }
    }
    movePath = hitResult.type == 'fill';
    if (movePath)
        project.activeLayer.addChild(hitResult.item);
}

tool2.onMouseDrag = function(event) {
   if (segment) {
        segment.point = event.point;
        path.smooth();
    }else
        path.position = path.position.add(event.delta);
}

tool2.onMouseMove = function(event) {
    project.activeLayer.selected = false;
    if (event.item)
       event.item.selected = true;
}

tool2.onMouseUp = function(event) {
	selected = null;
	segment = null;
	hitResult = null;
}

tool1.onMouseDown = function(event) {
	color = getSelectValue('color');
	size = getSelectValue('size');
	opacity = getSelectValue('opacity')
	path = new paper.Path();
	path.strokeColor = color;
	path.strokeWidth = size;
	path.opacity = opacity / 100;
	path.add(event.point);

	path_to_send = {
		rgba : color,
		start : event.point,
		path : [],
		image : 0,
		size : size,
		hasRaster : false,
		opacity : opacity,
		remove : -1,
		add : -2,
		smooth : false
	};
	path_to_send2 = {
		start : event.point,
		rgba : color,
		path : [],
		size : size,
		opacity : opacity
		};
		
		
}

tool1.onMouseDrag = function(event) {
	path.add(event.point);

	// On ajoute les data au path
	path_to_send2.path.push({
		point : event.point
	});

	//On push le path
	if ( !timer_is_active ) {

		send_paths_timer = setInterval( function() {

			socket.emit('draw:progress', uid, JSON.stringify(path_to_send2) );
			path_to_send2.path = new Array();

		}, rafraichissement);

	}

	timer_is_active = true;;

}



tool1.onMouseUp = function (event) {	
 var myCircle;
if (path.length < 5) {
	 myCircle = new Path.Circle(event.point, 1);
	 myCircle.strokeColor = color;
	// myCircle.radius = 1;
	 myCircle.fillColor = color;
	 myCircle.strokeColor = 'white';
}
//Si C'est une bulle :
if (Math.abs(path.firstSegment.point.x - path.lastSegment.point.x) < 30 && Math.abs(path.firstSegment.point.y - path.lastSegment.point.y) < 30 && path.length > 20) {

	if (text(new Point(path.position.x, path.position.y)))
	{
		path.style = bulleStyle;
		path.closed = true;
		path.simplify(20);
		path.opacity = 1;
	}
}
else
{
	if(checked("smooth"))
	{
		path.simplify();
		path_to_send.smooth = true;
	}
	else
		path_to_send.smooth = false;
	

}
if (hasRaster){
	path_to_send.hasRaster = true;
	path_to_send.image = image.src;
	hasRaster = false;
}

	path_to_send.end = event.point;
	
	
	pathList.push(path);
	currentElement++;
	if (currentElement != pathList.length -1)
		currentElement = pathList.length - 1;
		
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
			path.opacity = 1;
			view.draw();
		}
		else
		{	
			if (points.smooth)
			{
				path.simplify();
			}
		}
		path.add(points.end);
		pathListExtern.push(path);
		external_paths[artist] = false;
	}
	if (points.remove >= 0)
	{
		pathListExtern[points.remove].remove();
	}
	if (points.add >= -1)
	{
		project.activeLayer.addChild(pathListExtern[points.add + 1]);
	}
		view.draw();
};

//Continue à dessiner en temps reel
progress_external_path = function( points, artist ) {


	var path = external_paths[artist];

	if ( !path ) {

		external_paths[artist] = new Path();
		path = external_paths[artist];
		var start_point = new Point(points.start.x, points.start.y);
		path.opacity = points.opacity / 100;
		path.strokeColor = points.rgba;
		path.strokeWidth = points.size;
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
  } else {
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

}
//IMAGE DROP
