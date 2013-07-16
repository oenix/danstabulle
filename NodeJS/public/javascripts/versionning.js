var version = [];
var imagePreview = [];
var versionningHTML = "";
 
function copyTab(tableau) {
   var tab2 = [];

   for (var i = 0; i < tableau.length; i++){
     tab2[i] = tableau[i];
   }
   return tab2

}
Array.prototype.clone = function() { return this.slice(0); }

function getPreview() {
   var canvasToSave = document.getElementById("myCanvas");
   var data = canvasToSave.toDataURL();
   imagePreview.push(data);
}

function loadPreview(nbPreview) {
   console.log(nbPreview);
   var htmlImage = "<div id='holder'>\
		     <img id='imagePreview" + nbPreview + "' width='306' height='212' src='" + imagePreview[nbPreview] +"'/>\
		    </div>";
   document.getElementById("imageVersion").innerHTML = htmlImage;
   document.getElementById("restoreLink").href = "javascript:restoreState(" + nbPreview + ")";
   }

function saveState(stateName) {
   getPreview();
   var saveLayers = layer.slice(0);
   var state = {
        layer : saveLayers,
        pathList : copyTab(pathList),
        path_to_send : copyTab(pathListExtern),
        name : stateName
    };
    version.push(state);
    //UNCOMMENT FOR VERSIONNING
    
    /*for (var i = 0; i < layer.length; i++) {
	 layer[i].remove();
         layer.unset(layer[i]);
    }
    for (var i = 0; i < state.layer.length; i++) {
      layer.push(new Layer(state.layer[i]));
    }*/
    
    versionningHTML += "<option onClick='loadPreview(" + (version.length - 1) + ")' value='" + stateName +"'> " + stateName + " </option>";
    document.getElementById("version").innerHTML = versionningHTML;
}

function restoreState(stateNumber) {
    for (var i = 0; i < layer.length; i++) {
	    layer[i].remove();
            layer.unset(layer[i]);
            selectedLayer.unset(selectedLayer[i]);
            layerOpacity.unset(layerOpacity[i]);
    }
    layer = [];
    var canvas = document.getElementById('myCanvas');
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < version[stateNumber].layer.length; i++) {
       // newLayer();
   // console.log(version[stateNumber].layer[i]);
        layer.push(new Layer(version[stateNumber].layer[i]));
    //    layer[i] = version[stateNumber].layer;
        //layer[i].position = view.center;
   //     var image = new Image()
    //    image.src = version[stateNumber].image;
    //    var raster = new Raster(image);
    }
  //  activeLayer = version[stateNumber].activeLayer;
    //layer = version[stateNumber].layer;
    //pathList = version[stateNumber].pathList;
    //pathListExtern = version[stateNumber].pathListExtern;
    //view.draw();
    printLayers();
    
   var imagePreview = [];
   versionningHTML = "";
   document.getElementById("version").innerHTML = versionningHTML;
   document.getElementById("restoreLink").href = "javascript:restoreState(0)";
   document.getElementById("imageVersion").innerHTML = "";
}