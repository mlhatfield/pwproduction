var currentpwuid;
$(document).ready(function() {
  $('a[id^="pwreset-').click(function(){
    var user = "user name: "+$(this).closest('tr').find('td:eq(1)').text();
    currentpwuid = $(this).closest('tr').find('td:eq(0)').text();
    console.log($("#newusername").val());
    $('.pwname').text(user);
  });

  $('.editableuser').click(function(){
    var uid = $(this).closest('tr').find('td:eq(0)').text();
    var user = $(this).closest('tr').find('td:eq(1)').text();

  });

  $('#pwreset_modal_save').click(function(){
    if($("#pwreset_form").find('div.alert').length != 0 || $("#pwreset_new_pass").val() == "" || $("#pwreset_confirm_pass").val() == ""){
      // alert("Please complete the required fields.");
    } else {
      var newpw = $('#pwreset_new_pass').val();
      $('#pwreset_new_pass').prop('disabled', true);
      var confirmpw = $('#pwreset_confirm_pass').val();
      $('#pwreset_confirm_pass').prop('disabled', true);
      var uid = currentpwuid;
      $("#pwresetmodal").modal('toggle');
      $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "/pw-reset",
        data: JSON.stringify({"userid": uid, "pw": confirmpw}),
        success: function (data) {
          window.location.reload();
        },
        dataType: "json"
      });
    }

  });

  $('#createuser_modal_save').click(function(){
      if($('#create_user_form').find('div.alert').length != 0 || $("#newusername").val() == "" ){
        // alert("Please complete the required fields.");
      } else {
        $("#createusermodal").modal('toggle');
        var username = $("#newusername").val();
        var pw = $("#newuserpw").val();
        var email = $("#newuseremail").val();
        var role = $("#newuserole").val();
        $('#newusername').prop('disabled', true);
        $('#newuserpw').prop('disabled', true);
        $('#password').prop('disabled', true);
        $('#newuseremail').prop('disabled', true);
        $('#newuserole').prop('disabled', true);
        $.ajax({
          type: "POST",
          contentType: "application/json; charset=utf-8",
          url: "/create-user",
          data: JSON.stringify({"username": username, "pw": pw, "email": email, "role": role}),
          success: function (data) {
            window.location.reload();
          },
          dataType: "json"
        });
      }
  });

  $('#userpwreset_modal_save').click(function(){
    if($('#user_pwreset_form').find('div.alert').length != 0 || $("#user_pw_new").val() == "" ||  $("#user_pw_confirm").val() == "" ){
      // alert("Please complete the required fields.");
    } else {
      var newpw = $('#user_pw_new').val();
      $('#user_pw_new').prop('disabled', true);
      var confirmpw = $('#user_pw_confirm').val();
      $('#user_pw_confirm').prop('disabled', true);
      var uid = currentuid;
      $("#user_pwreset_form").modal('toggle');
      $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "/pw-reset",
        data: JSON.stringify({"userid": uid, "pw": confirmpw}),
        success: function (data) {
          window.location.reload();
        },
        dataType: "json"
      });
    }
  });

  $('.editableuser').click(function(){
    var uid = $(this).closest('tr').find('td:eq(0)').text();
    var user = $(this).closest('tr').find('td:eq(1)').text();
    var email = $(this).closest('tr').find('td:eq(2)').text();
    var site = $(this).closest('tr').find('td:eq(3)').text();
    $("#editusername").val(user);
    $("#edituseremail").val(email);
    $("#edituserole").val(site);
    $('#edituser_modal_save').click(function(){
      if($('#edit_user_form').find('div.alert').length != 0){
        // alert("Please complete the required fields.");
      } else {
        $("#editusermodal").modal('toggle');
        $.ajax({
          type: "POST",
          contentType: "application/json; charset=utf-8",
          url: "/update-user",
          data: JSON.stringify({"userid": uid, "username": $("#editusername").val(), "email": $("#edituseremail").val(), "role": $("#edituserole").val()}),
          success: function (data) {
            window.location.reload();
          },
          dataType: "json"
        });
      }
    });
  });

  $('.deleteuser').click(function(){
    var uid = $(this).closest('tr').find('td:eq(0)').text();
    var user = $(this).closest('tr').find('td:eq(1)').text();
    $("#delete_user_message").text("Are you sure you want to delete "+user+"?");
    $('#delete_user_confirm').click(function(){
      $("#deleteusermodal").modal('toggle');
      $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "/delete-user",
        data: JSON.stringify({"userid": uid}),
        success: function (data) {
          window.location.reload();
        },
        dataType: "json"
      });
    });
  });


});
