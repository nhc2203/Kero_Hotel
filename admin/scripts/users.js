let add_room_form = document.getElementById("add_room_form");
let edit_room_form = document.getElementById("edit_room_form");
let add_image_form = document.getElementById("add_image_form");

function get_users() {
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "ajax/users_crud.php", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    document.getElementById("users-data").innerHTML = this.responseText;
  };
  xhr.send("get_users");
}

function toggle_status(id, val) {
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "ajax/users_crud.php", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    if (this.responseText == 1) {
      alert_settings("success", "Status Toggle!");
      get_users();
    } else {
      alert_settings("error", "Server Down");
    }
  };
  xhr.send("toggle_status=" + id + "&val=" + val);
}

function remove_user(user_id) {
  if (confirm("Are you sure, you want to remove this user?")) {
    let data = new FormData();
    data.append("user_id", user_id);
    data.append("remove_user", "");
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "ajax/users_crud.php", true);
    xhr.onload = function () {
      if (this.responseText == 1) {
        alert_settings("success", "User Removed!");
        get_users();
      } else {
        alert_settings("error", "User Remove Failed!");
      }
    };
    xhr.send(data);
  }
}

function search_user(username) {
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "ajax/users_crud.php", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    document.getElementById("users-data").innerHTML = this.responseText;
  };
  xhr.send("search_user&name=" + username);
}

window.onload = function () {
  get_users();
};
