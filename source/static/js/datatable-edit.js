$(document).ready(function() {
  moment().format('YYYY-MM-DD');
  var ponumcookie = $.cookie('ponumcookie');
  if (typeof ponumcookie != 'undefined') {
    $("#ponum").val(ponumcookie);
  };
  $("#podate").val(moment().format('YYYY-MM-DD'));

  $("#addpo").click(function(){
    var ponum = $("#ponum").val();
    $.cookie('ponumcookie', ponum);
    var polabor = $("#polabor option:selected").val();
    var podate = $("#podate").val();
    var pounit = $("#pounit").val();
    var poworker = $("#poworker").val();
    CreatePO(ponum, polabor, podate, pounit, poworker);
  });

  $(".editpo").click(function(){
    $("#editporow").val($(this).closest('tr').find('td:eq(0)').text());
    $("#editpodate").val($(this).closest('tr').find('td:eq(1)').text());
    $("#editponum").val($(this).closest('tr').find('td:eq(2)').text());
    $("#editpoworker").val($(this).closest('tr').find('td:eq(3)').text());
    $("#editpolabor").val($(this).closest('tr').find('td:eq(4)').text());
    $("#editpounit").val($(this).closest('tr').find('td:eq(5)').text());
    $("#poeditmodal").modal('toggle');
  });

  $(".delpo").click(function(){
    var rowid = $(this).closest('tr').find('td:eq(0)').text();
    DeletePO(rowid);
  });

  $("#editpo_modal_save").click(function(){
    var rowid = $("#editporow").val();
    var podate = $("#editpodate").val();
    var ponum = $("#editponum").val();
    var poworker = $("#editpoworker").val();
    var polabor = $("#editpolabor").val();
    var pounit = $("#editpounit").val();
    UpdatePO(rowid, ponum, polabor, podate, pounit, poworker);
  });

  $("#submit_pos_btn").click(function(){
    SubmitPOs();
  });

  function SubmitPOs(){
    $.ajax({
      type: "POST",
      contentType: "application/json; charset=utf-8",
      url: "/submit-site-pos",
      data: JSON.stringify({}),
      success: function (data) {
        window.location.reload();
      },
      dataType: "json"
    });
  }

  function CreatePO(ponum, polabor, podate, pounit, poworker){
    $.ajax({
      type: "POST",
      contentType: "application/json; charset=utf-8",
      url: "/create-po-entry",
      data: JSON.stringify({"ponum":ponum,"polabor":polabor,"podate":podate,"pounit":pounit,"poworker":poworker}),
      success: function (data) {
        window.location.reload();
      },
      dataType: "json"
    });
  }

  function UpdatePO(porowid, ponum, polabor, podate, pounit, poworker){
    $.ajax({
      type: "POST",
      contentType: "application/json; charset=utf-8",
      url: "/update-po-entry",
      data: JSON.stringify({"porowid":porowid,"ponum":ponum,"polabor":polabor,"podate":podate,"pounit":pounit,"poworker":poworker}),
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
