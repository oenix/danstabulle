paper.install(window);


window.onload = function () {
    paper.setup('myCanvas');
    layer[activeLayer] = project.activeLayer;
    layerOpacity.push(100);
    positionLayer.push(layer.position);
    selectedLayer[activeLayer] = true;
    printLayers();
    tool1 = new Tool(); // Pinceau
    tool2 = new Tool(); // Select
    tool3 = new Tool(); // Draw for me
    tool4 = new Tool(); // Formes
    tool5 = new Tool(); // Move/Resize Layers

    var raster;
    var count = 0;
    
    path_to_send = {
        activeLayer: 0,
        newLayer: false,
        deleteLayer: -1,
        doShape: null,
        shapePosition: 0,
        shapeEvent: 0,
	    positionLayer : [],
		raster : null,
		boundsLayer : null,
		down : null,
		up : null,
		thisLayer : null
    };


    function text(position, question) {

        var text = new PointText(position, question);
        text.content = prompt(question, "");
        if (text.content == "null") {
            text.content = "";
			text.remove();
            return null;
        }
        text.fillColor = 'black';
        text.font = "myfont";
        text.fontSize = 30;

        text.point.x = text.point.x - text.point.length / 8;
        text.point.y = text.point.y - text.point.length / 40;
        //      currentElement++;
        return text;
    }

    var movePath = false;

    var bulleStyle = {
		fillColor: "white",
        strokeColor: "black",
        strokeWidth: 1.5
    };
	
	
    function handleImage(image) {
       count = 0;
       newLayer();
       raster = new Raster(image);
       raster.position = view.center;
	   path_to_send.raster = image.src;
	   addToPathList(raster);
	   socket.emit('draw:end', uid, JSON.stringify(path_to_send));
	   path_to_send.raster = null;
      // Transform the raster, so it fills the view:
	//  if (raster.bounds > view.bounds)
	 //   raster.fitBounds(view.bounds, true);
    }

    function onDocumentDrag(event) {
	   event.preventDefault();
    }
 	
    function addToPathList(item) {
		pathList.push(item);
		currentElement++;
	}

    function onDocumentDrop(event) {
	
       event.preventDefault();
       var file = event.dataTransfer.files[0];
       var reader = new FileReader();
       reader.onload = function ( event ) {
		var psdImg;
		
		if (file.name.split('.').pop() == "psd")
		{
				var input = new Uint8Array(event.target.result);
				var parser = new PSD.Parser(input);
				parser.parse();
				psdImg = parser.imageData.createCanvas(parser.header).toDataURL();
		}
		
       var image = document.createElement('img');
       image.onload = function () {
            handleImage(image);
            view.draw();
        };
		if (file.name.split('.').pop() == "psd")
			image.src = psdImg;
		else
			image.src = event.target.result;
		
		//raster = new paper.Raster(image);
    };
    if (file != null) {
		if (file.name.split('.').pop() == "psd")
				reader.readAsArrayBuffer(file);
		else
				reader.readAsDataURL(file);
    }
    return false;
}

    DomEvent.add(document, {
       drop: onDocumentDrop,
       dragover: onDocumentDrag,
       dragleave: onDocumentDrag
   });
    
    
    
    tool5.onMouseDown = function(event) {
		layer[activeLayer].selected = true;
		createLayerBorder(activeLayer);
    }
    
	var shifted = false;
    tool5.onMouseDrag = function(event) {
    	if (event.modifiers.shift) {
		   layer[activeLayer].bounds.width += event.delta.x;
		    layer[activeLayer].bounds.height += event.delta.y;
		   //add(new paper.Point(event.delta.x, event.delta.y));
		   shifted = true;
        }
		else {
		   layer[activeLayer].position = layer[activeLayer].position.add(event.delta);
		   shifted = false;
		}
    }
    
     tool5.onMouseUp = function(event) {
		layer[activeLayer].selected = false;
		positionLayer[activeLayer] = new paper.Point(layer[activeLayer].position.x, layer[activeLayer].position.y);
		if (shifted) {
				path_to_send.boundsLayer = new paper.Rectangle(size ,size,														  layer[activeLayer].bounds.width,layer[activeLayer].bounds.height);
		}
		else {
				path_to_send.boundsLayer = null;
		}
		shifted = false;
		path_to_send.thisLayer = activeLayer;
		path_to_send.positionLayer = positionLayer;
		socket.emit('draw:end', uid, JSON.stringify(path_to_send));
		selectLayerBounds.remove();
		hasDoubleClickedLayer = false;
		thisLayer = null;
    }
    
    var start;
    tool4.onMouseDown = function (event) {
        start = event.point
    }


    tool4.onMouseUp = function (event)  {
 
        var col = document.getElementsByClassName('active-color');
		var color = col[0].id.slice(5);
		color = "#" + color;
		var type = type1;
		console.log(type);
        opacity = getSelectValue('opacity');
        var shape;

        if (type == "circle") {
            shape = new paper.Path.Circle(event.middlePoint, event.delta.length / 2);
            shape.fillColor = color;

            path_to_send.doShape = "circle";
            path_to_send.shapePosition = event.middlePoint;
            path_to_send.shapeEvent = event.delta.length / 2;
        }
        if (type == "square") {
            shape = new paper.Path.Rectangle(start, event.point);
            //shape.strokeColor = 'black';
            shape.fillColor = color;
            path_to_send.doShape = "square";
            path_to_send.shapePosition = start;
            path_to_send.shapeEvent = event.point;
        }
        if (type == "arc") {
            shape = new paper.Path.Arc(start, event.point);
            //shape.strokeColor = 'black';
            shape.strokeColor = color;
            path_to_send.doShape = "arc";
            path_to_send.shapePosition = start;
            path_to_send.shapeEvent = event.point;
        }
        if (type == "triangle") {
            var sides = 3;
            var radius = 40;
            shape = new Path.RegularPolygon(event.point, sides, event.delta.length);
            //      shape = new paper.Path.RegularPolygon(start, 3 , event.point);
            //shape.strokeColor = 'black';
            shape.fillColor = color;
            path_to_send.doShape = "triangle";
            path_to_send.shapePosition = event.point;
            path_to_send.shapeEvent = event.delta.length;
        }
        shape.opacity = opacity / 100;
        path_to_send.opacity = opacity;
        pathList.push(shape);
        currentElement += 1;
        path_to_send.rgba = color;
        socket.emit('draw:end', uid, JSON.stringify(path_to_send));
        path_to_send.doShape = null;
    }



    tool3.onMouseDown = function (event) {

        path = new paper.Path();
        path.strokeColor = "red";
        path.strokeWidth = 1;
        path.strokeCap = 'round';
        path.add(event.point);
        view.draw();
        path_to_send = {
            start: event.point,
            path: [],
            texte: ""
        };
    }

    tool3.onMouseDrag = function (event) {
        path.add(event.point);
        view.draw();
        path_to_send.path.push({
            point: event.point
        });
        if (!timer_is_active) {
            send_paths_timer = setInterval(function () {
                socket.emit('drawForMe:progress', uid, JSON.stringify(path_to_send));
                path_to_send.path = new Array();

            }, rafraichissement);

        }
        timer_is_active = true;
    }

    tool3.onMouseUp = function (event) {
        if (path.length > 100) {
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

        } else {
            path.remove();
            socket.emit('drawForMe:end', uid, JSON.stringify(path_to_send));
        }
    }

	var haveToResize;
	var toResize;
	var fromResize;
    view.onFrame = function (event) {
        for (var i = 0; i < drawForMe.length; i += 2) {
            drawForMe[i].strokeColor.hue += 0.1;
        }
		if (layer[fromResize] != null && haveToResize) {
				var aug = 0;
				
				if (Math.abs(toResize.x - layer[fromResize].bounds.width)  < 10) {
						layer[fromResize].bounds.height = toResize.y;
						layer[fromResize].bounds.width = toResize.x;
						haveToResize = false;
				}
				if (Math.abs(toResize.x - layer[fromResize].bounds.width)  > 200)
						aug = 20;
				if (Math.abs(toResize.x - layer[fromResize].bounds.width)  > 100)
						aug = 10;
				else
						aug = 5;
				if (layer[fromResize].bounds.width < toResize.x) {
						layer[fromResize].bounds.width += aug;
				}
				if (layer[fromResize].bounds.height < toResize.y) {
						layer[fromResize].bounds.height += aug;
				}
					if (layer[fromResize].bounds.width > toResize.x) {
						layer[fromResize].bounds.width -= aug;
				}
				if (layer[fromResize].bounds.height > toResize.y) {
						layer[fromResize].bounds.height -= aug;
				}
		}
		
    }
    tool2.onMouseDown = function (event) {
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
            }
        }
        movePath = hitResult.type == 'fill';
        if (movePath) {
            project.activeLayer.addChild(hitResult.item);
        }
    }

    tool2.onMouseDrag = function (event) {
        if (segment) {
            segment.point = event.point;
            path.smooth();
        } else
            path.position = path.position.add(event.delta);
    }

    tool2.onMouseMove = function (event) {
        /*      project.activeLayer.selected = false;
if (event.item)
event.item.selected = true;*/
    }

    tool2.onMouseUp = function (event) {
        /* Pouvoir modifier uniquement nos traits       
for (var i = 0; i < pathList.length; i++)
{
if (selected == pathList[i])
	
}*/
        path_to_send.update = get_indice(selected);
        path_to_send.updatePath = new Point(pathList[get_indice(selected)].position.x, pathList[get_indice(selected)].position.y);
        socket.emit('draw:end', uid, JSON.stringify(path_to_send));
        selected = null;
        segment = null;
        hitResult = null;
        saveCanvas();
    }

    tool1.onMouseDown = function (event) {
		
		var col = document.getElementsByClassName('active-color');
		color = col[0].id.slice(5);
		color = "#" + color;
        size = getSelectValue('size');
        opacity = getSelectValue('opacity');
	
        path_to_send = {
            rgba: color,
            start: event.point,
            path: [],
            image: 0,
            size: size,
            opacity: opacity,
            remove: -1,
            add: -2,
            smooth: false,
            texte: null,
            update: -1,
            updatePath: null,
            drawForMe: -1,
            activeLayer: activeLayer,
	    	layerOpacity : layerOpacity
        };
        var hitResult = paper.project.hitTest(event.point);
        if (hitResult) {
            var itemSelected = hitResult.item;
            for (var i = 0; i < drawForMe.length; i++) {
                if (itemSelected == drawForMe[i]) {
                    drawForMe[i].remove();
                    drawForMe[i + 1].remove();
                    path_to_send.drawForMe = i;
                }
            }

        }
        path = new paper.Path();
        path.strokeColor = color;
        path.strokeWidth = size;
        path.strokeCap = 'round';

        path.opacity = opacity / 100;
        path.add(event.point);

        path_to_send2 = {
            start: event.point,
            rgba: color,
            path: [],
            size: size,
            opacity: opacity,
            activeLayer: activeLayer
        };
    }

    tool1.onMouseDrag = function (event) {
        path.add(event.point);

        // On ajoute les data au path
        path_to_send2.path.push({
            point: event.point
        });

        //On push le path
        if (!timer_is_active) {

            send_paths_timer = setInterval(function () {

                socket.emit('draw:progress', uid, JSON.stringify(path_to_send2));
                path_to_send2.path = new Array();

            }, rafraichissement);

        }

        timer_is_active = true;;

    }



    tool1.onMouseUp = function (event) {
		
        var myCircle;
        var texteBulle;
	saveState("Trait " + color + " D'opacité " +  opacity +" Ajouté par " + uid);
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
            if (texteBulle != null) {
                path.style = bulleStyle;
                path.closed = true;
                path.simplify(20);
                path.opacity = 1;
				if (confirm("Activer le style silencieux ?")) {
					path.dashArray = [10, 4];
				}
                texte = texteBulle.content;
				
				console.log(texteBulle.position);
            }
			else {
				  if (checked("smooth")) {
				      path.simplify();
				     path_to_send.smooth = true;
				  }
					else
				    path_to_send.smooth = false;
        }
        }
		else {
            if (checked("smooth")) {
                path.simplify();
                path_to_send.smooth = true;
            } else
                path_to_send.smooth = false;
        }

        path_to_send.end = event.point;
        pathList.push(path);

        if (texteBulle != null) {
            path_to_send.texte = texteBulle.content;
            pathList.push(texteBulle);
            currentElement++;
        }
        currentElement++;
        if (currentElement != pathList.length - 1)
            currentElement = pathList.length - 1;

        socket.emit('draw:end', uid, JSON.stringify(path_to_send));
        clearInterval(send_paths_timer);
        path_to_send.path = new Array();
        path_to_send.hasRaster = false;
        path_to_send.drawForMe = -1;
        timer_is_active = false;
        has_raster = false;
        saveCanvas();
    }



    socket.on('draw:progress', function (artist, data) {

        if (artist !== uid && data) {

            progress_external_path(JSON.parse(data), artist);

        }

    });

    socket.on('draw:end', function (artist, data) {

        if (artist !== uid && data) {
            end_external_path(JSON.parse(data), artist);

        }

    });

    socket.on('drawForMe:progress', function (artist, data) {
        if (artist !== uid && data) {
            draw_for_me_real_time(JSON.parse(data), artist);

        }

    });
    socket.on('drawForMe:end', function (artist, data) {

        if (artist !== uid && data) {
            draw_for_me_end(JSON.parse(data), artist);

        }

    });
    socket.on('harmonisation:end', function (artist, data) {

        if (artist !== uid && data) {
            syncHarmonisation(JSON.parse(data), artist);
        }
    });


    var $user_count = $('#userCount');
    var $user_count_wrapper = $('#userCountWrapper');


    socket.on('user:connect', function (user_count) {
        update_user_count(user_count);
    });

    socket.on('user:disconnect', function (user_count) {
        update_user_count(user_count);
    });



    function get_indice(path) {
        for (var i = 0; i < pathList.length; i++) {
            if (path == pathList[i])
                return i
        }
        return -1;
    }

    // ---------
    // SOCKET.IO


    function update_user_count(count) {

        $user_count_wrapper.css('opacity', 1);
        $user_count.text((count === 1) ? " just you, why not invite some friends?" : " " + count);

    }


    var external_paths = {};

    //Applique les effets d'un path extérieur
    var draw_for_me_real_time = function (points, artist) {

        var path = external_paths[artist];

        if (!path) {
            external_paths[artist] = new Path();
            path = external_paths[artist];
            var start_point = new Point(points.start.x, points.start.y);
            path.strokeColor = "red";
            path.add(start_point);
        }

        var paths = points.path;
        var length = paths.length;

        for (var i = 0; i < length; i++) {
            path.add(paths[i].point);
        }

        view.draw();
    }


    var draw_for_me_end = function (points, artist) {
        var path = external_paths[artist];

        if (path) {
            if (path.length > 100) {
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
                texts.point.y = texts.point.y - texts.point.length / 50;
                view.draw();

                external_paths[artist] = false;
                drawForMe.push(path);
                drawForMe.push(texts);
            } else {
                path.remove();
            }
        }
    }
    //Applique les effets d'un path extérieur
    var end_external_path = function (points, artist) {

        var path = external_paths[artist];

        if (points.hasRaster) {
            var img = new Image();
            img.src = points.image
            raster = new Raster(img);
            raster.position = view.center;
            //      raster.scale(0.5);
            pathListExtern.push(raster);
            view.draw();
        }
        if (path) {
            var text;
            if (Math.abs(path.firstSegment.point.x - path.lastSegment.point.x) < 30 && Math.abs(path.firstSegment.point.y - path.lastSegment.point.y) < 30) {
                if (points.texte != null) {
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
                    text.point.y = text.point.y - text.point.length / 50;
                    view.draw();
                }
            } else {
                if (points.smooth) {
                    path.simplify();
                }
            }
            path.add(points.end);

            pathListExtern.push(path);
            if (text != null) {
                pathListExtern.push(text);
            }
            external_paths[artist] = false;

        }
	if (points.layerOpacity != null) {
		for (var i = 0; i < layer.length; i++) {
			layer[i].opacity = points.layerOpacity[i] / 100;
			layerOpacity[i] = points.layerOpacity[i];
		}
	}
        if (points.remove >= 0) {
            pathListExtern[points.remove].remove();
        }
        if (points.add >= -1) {
            project.activeLayer.addChild(pathListExtern[points.add + 1]);
        }
        if (points.drawForMe != -1 && points.drawForMe != null) {
            drawForMe[points.drawForMe].remove();
            drawForMe[points.drawForMe + 1].remove();
        }
        if (points.update != -1 && points.update != null) {
            pathListExtern[points.update].position = points.updatePath;
        }
        if (points.newLayer) {
            var llayer = activeLayer;
            newLayer();
            activeLayer = llayer;
        }
        if (points.deleteLayer != -1 && points.deleteLayer != null) {
            layer[points.deleteLayer].remove();
            layer.unset(layer[points.deleteLayer]);
        }
		printLayers();
        if (points.doShape != null) {

            if (points.doShape == "square") {
                shape = new paper.Path.Rectangle(points.shapePosition, points.shapeEvent);
                shape.fillColor = points.rgba
                pathListExtern.push(shape);
            } else if (points.doShape == "circle") {
                shape = new paper.Path.Circle(points.shapePosition, points.shapeEvent);
                shape.fillColor = points.rgba;
                pathListExtern.push(shape);
            } else if (points.doShape == "arc") {
                shape = new paper.Path.Arc(points.shapePosition, points.shapeEvent);
                shape.strokeColor = points.rgba
                pathListExtern.push(shape);
            } else if (points.doShape == "triangle") {
                shape = new paper.Path.RegularPolygon(points.shapePosition, 3, points.shapeEvent);
                shape.fillColor = points.rgba
                pathListExtern.push(shape);
            }

            shape.opacity = points.opacity / 100;
        }
		if (points.raster != null) {
		    var llayer = activeLayer;
            newLayer();
			var image = new Image();
			image.src = points.raster;
			raster = new Raster(image);
			raster.position = view.center;
			pathListExtern.push(raster);
			currentElementExtern ++;
            activeLayer = llayer;
			printLayers();
		}
		if (points.up != null) {
				layer[points.up].insertBelow(layer[points.up - 1]);
				var l = layer[points.up];
				layer[points.up] = layer[points.up - 1];
				layer[points.up - 1] = l;
		}
		else if (points.down != null) {
				layer[points.down].insertAbove(layer[points.down + 1]);
				var l = layer[points.down];
				layer[points.down] = layer[points.down + 1];
				layer[points.down + 1] = l;
		}
		if (points.positionLayer != null && points.thisLayer != null) {
				if (points.positionLayer[points.thisLayer] != null) {
					if (points.boundsLayer != 0 && points.boundsLayer != null) {
							haveToResize = true;
							if (points.boundsLayer.x != null)
								toResize = new paper.Point(points.boundsLayer.width - points.boundsLayer.x, points.boundsLayer.height - points.boundsLayer.y);
							else
									toResize = new paper.Point(points.boundsLayer.width, points.boundsLayer.height);
							fromResize = points.thisLayer;
					}
					else {

							layer[points.thisLayer].position = new paper.Point(points.positionLayer[points.thisLayer].x, points.positionLayer[points.thisLayer].y);
							positionLayer[points.thisLayer] = new paper.Point(points.positionLayer[points.thisLayer].x, points.positionLayer[points.thisLayer].y);

					}
			}
		}
        view.draw();
    };

    //Continue à dessiner en temps reel
    progress_external_path = function (points, artist) {


        var path = external_paths[artist];

        if (!path) {
            layer[points.activeLayer].activate();
            external_paths[artist] = new Path();
            path = external_paths[artist];
			path.strokeCap = 'round';
            var start_point = new Point(points.start.x, points.start.y);
            path.opacity = points.opacity / 100;
            path.strokeColor = points.rgba;
            path.strokeWidth = points.size;
            path.add(start_point);
            layer[activeLayer].activate();
        }

        var paths = points.path;
        var length = paths.length;

        for (var i = 0; i < length; i++) {
            path.add(paths[i].point);
        }
        view.draw();
    };



    function saveCanvas() {
        var canvas = document.getElementById('myCanvas');
        var dataURL = canvas.toDataURL();
        document.getElementById('save').href = dataURL;
    }


}