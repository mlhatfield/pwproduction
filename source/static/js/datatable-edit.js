$(document).ready(function() {
  moment().format('YYYY-MM-DD');
  var ponumcookie = $.cookie('ponumcookie');
  if (typeof ponumcookie != 'undefined') {
    $("#ponum").val(ponumcookie);
  };
  $("#podate").val(moment().format('YYYY-MM-DD'));

  $( ".podate" ).change(function() {
    d = $( ".podate" ).val();
    var s = $(this).closest('tr').find('td:eq(1)').val();
    // alert( "Handler for "+s );
  });

  $('#po-add-btn').click(function(){
    console.log("Clicker add");
    $.ajax({
      type: "POST",
      contentType: "application/json; charset=utf-8",
      url: "/create-po-entry",
      data: JSON.stringify({}),
      success: function (data) {
        console.log("Adding");
        window.location.reload();
      },
      dataType: "json"
    });
  });

  $("#addpo").click(function(){
    var ponum = $("#ponum").val();
    $.cookie('ponumcookie', ponum);
    var polabor = $("#polabor option:selected").val();
    var podate = $("#podate").val();
    CreatePO(ponum, polabor, podate);
  });

  $(".delpo").click(function(){
    var rowid = $(this).closest('tr').find('td:eq(0)').text();
    DeletePO(rowid);
  });

  function CreatePO(ponum, polabor, podate){
    $.ajax({
      type: "POST",
      contentType: "application/json; charset=utf-8",
      url: "/create-po-entry",
      data: JSON.stringify({"ponum":ponum,"polabor":polabor,"podate":podate}),
      success: function (data) {
        window.location.reload();
      },
      dataType: "json"
    });
    // window.location.reload();
  }

  function UpdatePO(po){
    $.ajax({
      type: "POST",
      contentType: "application/json; charset=utf-8",
      url: "/update-po-entry",
      data: JSON.stringify({"po":po}),
      success: function (data) {
        window.location.reload();
      },
      dataType: "json"
    });
  }

  function DeletePO(porowid){
    $.ajax({
      type: "POST",
      contentType: "application/json; charset=utf-8",
      url: "/delete-po-entry",
      data: JSON.stringify({"porowid":porowid}),
      success: function (data) {
        window.location.reload();
      },
      dataType: "json"
    });
  }

} );
