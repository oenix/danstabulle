
  $(function(){
    var $select = $(".1-100");
    for (i=100;i>=0;i--){
        $select.append($('<option></option>').val(i).html(i))
    }
});
