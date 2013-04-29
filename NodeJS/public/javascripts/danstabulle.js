$(function(){
	var my_array = ['Tintin', 'Asterix', "Boule et Bill", "Lucky Luke", "Les stroumphs"];
	$(".pop").popover({placement:'right', trigger:'hover'});
	$('.recherche').typeahead({source:my_array, items:1});
});

function cacher(id)
{
	document.getElementById(id).style.display="none";
	document.getElementById(id + "_complete").style.display="";
}

function afficher(id)
{
	document.getElementById(id).style.display="block";
	document.getElementById(id + "_complete").style.display="none";
}
