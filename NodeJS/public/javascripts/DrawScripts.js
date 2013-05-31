Array.prototype.unset = function(val){
	var index = this.indexOf(val)
	if(index > -1){
		this.splice(index,1)
	}
}


$(function(){
    var $select = $(".1-100");
    for (i=100;i>=0;i--){
        $select.append($('<option></option>').val(i).html(i))
    }
});

$(function() {

  function createDataTransfers()
  {
	$.event.props.push('dataTransfer');
	dragLayers();
  }

  var dragLayers = function() {
	 var i, $this, $log = $('#log');

	    $('#calques li').on({
	        // on commence le drag
	        dragstart: function(e) {
	            $this = $(this);
	            i = $(this).index();
	            $(this).css('opacity', '1');

	            // on garde le texte en mémoire (A, B, C ou D)
	            e.dataTransfer.setData('text/html', $(this).html());
	        },
	        // on passe sur un élément draggable
	        dragenter: function(e) {
	            // on augmente la taille pour montrer le draggable

	            e.preventDefault();
	        },
	        // on quitte un élément draggable
	        dragleave: function() {
	            // on remet la taille par défaut
	       
	        },
	        // déclenché tant qu on a pas lâché l élément
	        dragover: function(e) {
	            e.preventDefault();
	
	        },
	        // on lâche l élément
	        drop: function(e) {
	            // si l élément sur lequel on drop n'est pas l'élément de départ
	            if (i !== $(this).index()) {
	                // on récupère le texte initial
	                var data = e.dataTransfer.getData('text/html');

	 

	                // on met le nouveau texte à la place de l ancien et inversement
	              	$this.html($(this).html());
					$(this).html(data);
	            }

	        },
	        // fin du drag (même sans drop)
	        dragend: function() {
	        },

	    });
  }


  $("#newLayer").hover(createDataTransfers);

});