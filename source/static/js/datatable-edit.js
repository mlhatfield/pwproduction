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

  $("#addlabor").click(function(){
    var labortype = $("#labortype").val();
    var laboruom = $("#laboruom option:selected").val();
    var laborpay = $("#laborpay").val();
    var laborbill = $("#laborbill").val();
    CreateLabor(labortype, laboruom, laborpay, laborbill);
  });

  $(".dellabor").click(function(){
    var laborrowid = $(this).closest('tr').find('td:eq(0)').text();
    DeleteLabor(laborrowid);
  });

  $(".editlabor").click(function(){
    $("#editlaborrow").val($(this).closest('tr').find('td:eq(0)').text());
    $("#editlabortype").val($(this).closest('tr').find('td:eq(1)').text());
    $("#editlaborpay").val($(this).closest('tr').find('td:eq(2)').text());
    $("#editlaborbill").val($(this).closest('tr').find('td:eq(3)').text());
    $("#editlaborunit").val($(this).closest('tr').find('td:eq(4)').text());
    $("#laboreditmodal").modal('toggle');
  });

  $("#editlabor_modal_save").click(function(){
    var laborrowid = $("#editlaborrow").val();
    var labortype = $("#editlabortype").val();
    var laborpay = $("#editlaborpay").val();
    var laborbill = $("#editlaborbill").val();
    var laboruom = $("#editlaborunit").val();
    UpdateLabor(laborrowid, labortype, laboruom, laborpay, laborbill);
  });

  $("#addemployee").click(function(){
    var employeeid = $("#employeeid").val();
    var employeename = $("#employeename").val();
    CreateEmployee(employeename, employeeid);
  });

  $(".delemployee").click(function(){
    var employeerowid = $(this).closest('tr').find('td:eq(0)').text();
    DeleteEmployee(employeerowid);
  });

  $(".editemployee").click(function(){
    $("#editemployeerow").val($(this).closest('tr').find('td:eq(0)').text());
    $("#editemployeename").val($(this).closest('tr').find('td:eq(1)').text());
    $("#editemployeeid").val($(this).closest('tr').find('td:eq(2)').text());
    $("#employeeeditmodal").modal('toggle');
  });

  $("#editemployee_modal_save").click(function(){
    var employeerowid = $("#editemployeerow").val();
    var employeename = $("#editemployeename").val();
    var employeeid = $("#editemployeeid").val();
    UpdateEmployee(employeerowid, employeename, employeeid);
  });

  $("#addsite").click(function(){
    var sitename = $("#sitename").val();
    var siteid = $("#siteid").val();
    CreateSite(sitename, siteid);
  });

  $(".delsite").click(function(){
    var siterowid = $(this).closest('tr').find('td:eq(0)').text();
    DeleteSite(siterowid);
  });

  $(".editsite").click(function(){
    $("#editsiterow").val($(this).closest('tr').find('td:eq(0)').text());
    $("#editsitename").val($(this).closest('tr').find('td:eq(1)').text());
    $("#editsiteid").val($(this).closest('tr').find('td:eq(2)').text());
    $("#siteeditmodal").modal('toggle');
  });

  $("#editsite_modal_save").click(function(){
    var siterowid = $("#editsiterow").val();
    var sitename = $("#editsitename").val();
    var siteid = $("#editsiteid").val();
    UpdateSite(siterowid, sitename, siteid);
  });


  $("#addcost").click(function(){
    var costtype = $("#costtype").val();
    var costamount = $("#costamount").val();
    var costuom = $("#costuom option:selected").val();
    CreateCost(costtype, costamount, costuom);
  });

  $(".delcost").click(function(){
    var costrowid = $(this).closest('tr').find('td:eq(0)').text();
    DeleteCost(costrowid);
  });

  $(".editcost").click(function(){
    $("#editcostrow").val($(this).closest('tr').find('td:eq(0)').text());
    $("#editcosttype").val($(this).closest('tr').find('td:eq(1)').text());
    $("#editcostamount").val($(this).closest('tr').find('td:eq(2)').text());
    $("#editcostuom").val($(this).closest('tr').find('td:eq(3)').text());
    $("#costeditmodal").modal('toggle');
  });

  $("#editcost_modal_save").click(function(){
    var costrowid = $("#editcostrow").val();
    var costtype = $("#editcosttype").val();
    var costamount = $("#editcostamount").val();
    var costuom = $("#editcostuom option:selected").val();
    UpdateCost(costrowid, costtype, costamount, costuom);
  });

  function CreateLabor(labortype, laboruom, laborpay, laborbill){
    $.ajax({
      type: "POST",
      contentType: "application/json; charset=utf-8",
      url: "/create-labor-entry",
      data: JSON.stringify({"labortype":labortype,"laboruom":laboruom,"laborpay":laborpay,"laborbill":laborbill}),
      success: function (data) {
        window.location.reload();
      },
      dataType: "json"
    });
  }

  function UpdateLabor(laborrowid, labortype, laboruom, laborpay, laborbill){
    $.ajax({
      type: "POST",
      contentType: "application/json; charset=utf-8",
      url: "/update-labor-entry",
      data: JSON.stringify({"laborrowid":laborrowid,"labortype":labortype,"laboruom":laboruom,"laborpay":laborpay,"laborbill":laborbill}),
      success: function (data) {
        window.location.reload();
      },
      dataType: "json"
    });
  }

  function DeleteLabor(laborrowid){
    $.ajax({
      type: "POST",
      contentType: "application/json; charset=utf-8",
      url: "/delete-labor-entry",
      data: JSON.stringify({"laborrowid":laborrowid}),
      success: function (data) {
        window.location.reload();
      },
      dataType: "json"
    });
  }

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

  function CreateEmployee(employeename, employeeid){
    $.ajax({
      type: "POST",
      contentType: "application/json; charset=utf-8",
      url: "/create-employee-entry",
      data: JSON.stringify({"employeeid":employeeid,"employeename":employeename}),
      success: function (data) {
        window.location.reload();
      },
      dataType: "json"
    });
  }

  function UpdateEmployee(employeerowid, employeename, employeeid){
    $.ajax({
      type: "POST",
      contentType: "application/json; charset=utf-8",
      url: "/update-employee-entry",
      data: JSON.stringify({"employeerowid":employeerowid,"employeename":employeename,"employeeid":employeeid}),
      success: function (data) {
        window.location.reload();
      },
      dataType: "json"
    });
  }

  function DeleteEmployee(employeerowid){
    $.ajax({
      type: "POST",
      contentType: "application/json; charset=utf-8",
      url: "/delete-employee-entry",
      data: JSON.stringify({"employeerowid":employeerowid}),
      success: function (data) {
        window.location.reload();
      },
      dataType: "json"
    });
  }

  function CreateSite(sitename, siteid){
    $.ajax({
      type: "POST",
      contentType: "application/json; charset=utf-8",
      url: "/create-site-entry",
      data: JSON.stringify({"sitename":sitename,"siteid":siteid}),
      success: function (data) {
        window.location.reload();
      },
      dataType: "json"
    });
  }

  function UpdateSite(siterowid, sitename, siteid){
    $.ajax({
      type: "POST",
      contentType: "application/json; charset=utf-8",
      url: "/update-site-entry",
      data: JSON.stringify({"siterowid":siterowid,"sitename":sitename,"siteid":siteid}),
      success: function (data) {
        window.location.reload();
      },
      dataType: "json"
    });
  }

  function DeleteSite(siterowid){
    $.ajax({
      type: "POST",
      contentType: "application/json; charset=utf-8",
      url: "/delete-site-entry",
      data: JSON.stringify({"siterowid":siterowid}),
      success: function (data) {
        window.location.reload();
      },
      dataType: "json"
    });
  }

  function CreateCost(costtype, costamount, costuom){
    $.ajax({
      type: "POST",
      contentType: "application/json; charset=utf-8",
      url: "/create-cost-entry",
      data: JSON.stringify({"costtype":costtype,"costamount":costamount,"costuom":costuom}),
      success: function (data) {
        window.location.reload();
      },
      dataType: "json"
    });
  }

  function UpdateCost(costrowid, costtype, costamount, costuom){
    $.ajax({
      type: "POST",
      contentType: "application/json; charset=utf-8",
      url: "/update-cost-entry",
      data: JSON.stringify({"costrowid":costrowid,"costtype":costtype,"costamount":costamount,"costuom":costuom}),
      success: function (data) {
        window.location.reload();
      },
      dataType: "json"
    });
  }

  function DeleteCost(costrowid){
    $.ajax({
      type: "POST",
      contentType: "application/json; charset=utf-8",
      url: "/delete-cost-entry",
      data: JSON.stringify({"costrowid":costrowid}),
      success: function (data) {
        window.location.reload();
      },
      dataType: "json"
    });
  }

} );
