$(function(){
	$(".pop").popover({placement:'right', trigger:'hover'});
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
