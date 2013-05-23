var tool1, tool2, tool3;
var path;
var color;
var size;
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
var drawForMe = [];


var rectangleForMe;

var layer = [];
var selectedLayer = [];
var activeLayer = 0;	


function printLayers()
{
	var htmlLayer = "";
	for (var i = 0; i < layer.length; i++) {
		var checked = "";
		if (selectedLayer[i])
			checked = "checked='checked'";
		if (i == activeLayer)
		{
			htmlLayer = htmlLayer + "<li draggable='true'>  <input type='checkbox' onclick='showLayer("+ i +")' " + checked + " id='visible" + i + "'> <a class='selectedLayer' href='javascript:activateLayer("+ i + ");'>Calque "+ i + "</a></li>";
		}
		else
		{
		 	htmlLayer = htmlLayer + "<li draggable='true'>  <input type='checkbox' onclick='showLayer("+ i +")' " + checked + "  id='visible" + i + "'> <a href='javascript:activateLayer("+ i + ");'>Calque "+ i + "</a> </li>";
		}
	}
	document.getElementById("calques").innerHTML= htmlLayer;	

}

function activateLayer(nbLayer)
{
	layer[nbLayer].activate();
	activeLayer = nbLayer;
	printLayers();
}

function showLayer(nbLayer)
{
	
	if (checked("visible" + nbLayer))
	{
		selectedLayer[nbLayer] = true;
		layer[nbLayer].visible = true;
	}
	else
	{
		selectedLayer[nbLayer] = false;
		layer[nbLayer].visible = false;
	}
}

function newLayer()
{
	layer.push(new Layer());
	selectedLayer.push(true);
	activeLayer = selectedLayer.length - 1;
	printLayers();
}

function checked(id)
{
	checkbox = document.getElementById(id);
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

	function autocomplete()
	{
		var i = 0;
		for (i = pathList.length - 1 ; i >= 0; i--)
		{


			for(var j = 0; j < 15; j++)
			{
				//	pathList[i].simplify();
				var clone = pathList[i].clone();
				//clone.smooth();
				//clone.simplify();
				clone.position = clone.position.add(new Point(clone.position.x + (60 * j+1),0));
				//clone.simplify();
			}
		}
		view.draw();
	}

	function activateTool(tool)
	{
		if (tool == "tool1")
			tool1.activate();
		else if (tool == "tool2")
			tool2.activate();
		else
			tool3.activate();
	}


	paper.install(window);



	window.onload = function() {
		paper.setup('myCanvas');
		layer[activeLayer] = project.activeLayer;
		selectedLayer[activeLayer] = true;
		tool1 = new Tool(); // Pinceau
		tool2 = new Tool(); // Select
	    tool3 = new Tool(); // Draw for me
		
		function text(position, question)
		{

			var text = new PointText(position, question);
			text.content = prompt(question,"");
			if (text.content == "null")
			{
				text.content = "";
				return null;
			}
			text.fillColor = 'black';
			text.font = "Script";
			text.fontSize = 15;

			text.point.x = text.point.x - text.point.length / 12;
			text.point.y = text.point.y - text.point.length /50;
		//	currentElement++;
			return text;
		}

		var movePath = false;
		
		var bulleStyle = {
			fillColor: new RgbColor(255, 255, 255),
			strokeColor: "black",
			strokeWidth: 1.5
		};
		
		tool3.onMouseDown = function(event) {
			
			layer[activeLayer].visible = !layer[activeLayer].visible;
				path = new paper.Path();
				path.strokeColor = "red";
				path.strokeWidth = 1;
			 	path.strokeCap =  'round';
				path.add(event.point);
				view.draw();
				path_to_send = {
					start : event.point,
					path : [],
					texte : ""
				};
		}
			
		tool3.onMouseDrag = function(event) {
				path.add(event.point);
				view.draw();
				path_to_send.path.push({
					point : event.point
				});
				if ( !timer_is_active )
				{
					send_paths_timer = setInterval( function() {
							socket.emit('drawForMe:progress', uid, JSON.stringify(path_to_send));
							path_to_send.path = new Array();

							}, rafraichissement);

						}

						timer_is_active = true;;
		}
		
			tool3.onMouseUp = function(event) {
				if (path.length > 100)
				{
					path.closed = true;
					path.fillColor = "white";
					path.smooth();
					path_to_send.end = event.point;
					var textDrawForMe = text(new Point(path.position.x, path.position.y), "Que souhaitez vous faire dessiner ?");
					view.draw();
					drawForMe.push(path);
					drawForMe.push(textDrawForMe);
					path_to_send.texte = textDrawForMe.content;
					socket.emit('drawForMe:end', uid, JSON.stringify(path_to_send));
				}
				else
				{
					path.remove();
				}
			}
		
			view.onFrame = function(event){
				for (var i = 0; i < drawForMe.length; i+=2)
				{
					drawForMe[i].strokeColor.hue += 0.1;
				}
			}
		

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

					if (hitResult) 
					{
						path = hitResult.item;
						if (hitResult.type == 'segment') 
						{
							segment = hitResult.segment;
						} 
					}
						movePath = hitResult.type == 'fill';
						if (movePath)
						project.activeLayer.addChild(hitResult.item);
					}

				tool2.onMouseDrag = function(event) {
				if (segment) {
					segment.point = event.point;
					path.smooth();
					}
					else
					path.position = path.position.add(event.delta);
				}

				tool2.onMouseMove = function(event) {
				/*	project.activeLayer.selected = false;
					if (event.item)
						event.item.selected = true;*/
				}

				tool2.onMouseUp = function(event) {
					path_to_send.update = get_indice(selected);
					path_to_send.updatePath = new Point(pathList[get_indice(selected)].position.x, pathList[get_indice(selected)].position.y);
					socket.emit('draw:end', uid, JSON.stringify(path_to_send));
						selected = null;
						segment = null;
						hitResult = null;
					saveCanvas();
				}
				
				tool1.onMouseDown = function(event) {
					color = getSelectValue('color');
					size = getSelectValue('size');
					opacity = getSelectValue('opacity')
					printLayers();
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
						smooth : false,
						texte : null,
						update : -1,
						updatePath : null,
						drawForMe : -1
					};
						
					var hitResult = paper.project.hitTest(event.point);
					if (hitResult)
					{
						var itemSelected = hitResult.item;
						for (var i = 0; i < drawForMe.length; i++)
						{
							if (itemSelected == drawForMe[i])
							{
								drawForMe[i].remove();
								drawForMe[i + 1].remove();
								path_to_send.drawForMe = i;
							}
						}
						
					}
					path = new paper.Path();
					path.strokeColor = color;
					path.strokeWidth = size;
				 	path.strokeCap =  'round';
				
					path.opacity = opacity / 100;
					path.add(event.point);

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

							socket.emit('draw:progress', uid, JSON.stringify(path_to_send2));
							path_to_send2.path = new Array();

							}, rafraichissement);

						}

						timer_is_active = true;;

					}



					tool1.onMouseUp = function (event) {	
						var myCircle;
						var texteBulle;
						if (path.length < 5) {
							myCircle = new Path.Circle(event.point, 1);
							myCircle.strokeColor = color;
							// myCircle.radius = 1;
							myCircle.fillColor = color;
							myCircle.strokeColor = 'white';
						}
						//Si C'est une bulle :
						if (Math.abs(path.firstSegment.point.x - path.lastSegment.point.x) < 30 && Math.abs(path.firstSegment.point.y - path.lastSegment.point.y) < 30 && path.length > 200) {
							texteBulle = text(new Point(path.position.x, path.position.y), "Texte de la bulle");
							if (texteBulle != null)
							{
								path.style = bulleStyle;
								path.closed = true;
								path.simplify(20);
								path.opacity = 1;
								texte = texteBulle.content;
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

						path_to_send.end = event.point;
						pathList.push(path);
						
						if (texteBulle != null)
						{
							path_to_send.texte = texteBulle.content;
							pathList.push(texteBulle);
						 	currentElement++;
						}
						currentElement++;
						if (currentElement != pathList.length -1)
							currentElement = pathList.length - 1;

						socket.emit('draw:end', uid, JSON.stringify(path_to_send) );
						clearInterval(send_paths_timer);
						path_to_send.path = new Array();
						path_to_send.hasRaster = false;
						path_to_send.drawForMe = -1;
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
					
					socket.on('drawForMe:progress', function( artist, data ) {
								if ( artist !== uid && data ) {
									draw_for_me_real_time( JSON.parse( data ), artist );

								}

							});
					socket.on('drawForMe:end', function( artist, data ) {

							if ( artist !== uid && data ) {
								draw_for_me_end( JSON.parse( data ), artist );

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



					function get_indice(path)
					{
						for (var i  = 0; i < pathList.length; i++)
						{
							if (path == pathList[i])
								return i
						}
						return -1;
					}

					// ---------
					// SOCKET.IO


					function update_user_count( count ) {

						$user_count_wrapper.css('opacity', 1);
						$user_count.text( (count === 1) ? " just you, why not invite some friends?" : " " + count );

					}


					var external_paths = {};
					
					//Applique les effets d'un path extérieur
					var draw_for_me_real_time = function (points, artist ) {
						
						var path = external_paths[artist];

						if ( !path ) {

							external_paths[artist] = new Path();
							path = external_paths[artist];
							var start_point = new Point(points.start.x, points.start.y);
							path.strokeColor = "red";
							path.add(start_point);
						}

						var paths = points.path;
						var length = paths.length;

						for (var i = 0; i < length; i++ ) {
							path.add(paths[i].point);
						}
						
						view.draw();
					}
					

					var draw_for_me_end= function (points, artist ) {
							var path = external_paths[artist];
							
							if (path) 
							{

							//path.add(points.end);
							path.closed = true;
							path.fillColor = "white";
							path.end = points.end;
							
							var texts = new PointText(path.position);
							texts.content = points.texte
							texts.fillColor = 'black';
							texts.font = "Script";
							texts.fontSize = 15;
							texts.point.x = texts.point.x - texts.point.length / 12;
							texts.point.y = texts.point.y - texts.point.length /50;
							view.draw();
							
							external_paths[artist] = false;
							drawForMe.push(path);
							drawForMe.push(texts);
						}
						}
					//Applique les effets d'un path extérieur
					var end_external_path = function( points, artist ) {

						var path = external_paths[artist];

						if (points.hasRaster)
						{
							var img = new Image();
							img.src = points.image
							raster = new Raster(img);
							raster.position = view.center;
						//	raster.scale(0.5);
							pathListExtern.push(raster);
							view.draw();
						}
						if (path) 
						{
							var text;
							if (Math.abs(path.firstSegment.point.x - path.lastSegment.point.x) < 30 && Math.abs(path.firstSegment.point.y - path.lastSegment.point.y) < 30) 
							{
								if (points.texte != null)
								{
									path.style = bulleStyle;
									path.closed = true;
									path.simplify(20);
									path.opacity = 1;
									text = new PointText(path.position);
									text.content = points.texte
									text.fillColor = 'black';
									text.font = "Script";
									text.fontSize = 15;

									text.point.x = text.point.x - text.point.length / 12;
									text.point.y = text.point.y - text.point.length /50;
									view.draw();
							}
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
							if (text != null)
							{
								pathListExtern.push(text);
							}
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
						if (points.drawForMe != -1)
						{
							drawForMe[points.drawForMe].remove();
							drawForMe[points.drawForMe + 1].remove();
						}
						if (points.update != null)
						{
							pathListExtern[points.update].position = points.updatePath;
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
								var raster1 = new Raster(image);

							//	alert(image.src);
								raster1.position = view.center;
								//raster.scale(0.5);

							//	hasRaster = true;
								pathList.push(raster1);
								currentElement++;
								path_to_send.image = image.src;
								path_to_send.hasRaster = true;
								path_to_send.hasRaster = false;
								view.draw();
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
				
			