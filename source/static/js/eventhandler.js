$(document).ready(function(){

  console.log( "ready go!" );

  $('#login-btn').bind('click', function () {
      var user = $("#uname").val();
      var pass = $("#password").val();
      $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "/login",
        data: JSON.stringify({"username": user, "password": pass}),
        success: function (data) {
          // if(!data.error) location.reload(true);
          // console.log(data);
        },
        dataType: "json"
      });
  });

  $('#logout-btn').bind('click', function () {
      $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "/logout",
        data: JSON.stringify({"username": "user"}),
        success: function (data) {
          // if(!data.error) location.reload(true);
          // console.log(data);
        },
        dataType: "json"
      });
  });

});
