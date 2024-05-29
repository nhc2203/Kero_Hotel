let feature_s_form = document.getElementById("feature_s_form");
let facility_s_form = document.getElementById("facility_s_form");
feature_s_form.addEventListener("submit", function (event) {
  event.preventDefault();
  add_feature();
});

facility_s_form.addEventListener("submit", function (event) {
  event.preventDefault();
  add_facility();
});

//Feature
function add_feature() {
  let data = new FormData();
  data.append("name", feature_s_form.elements["feature_name"].value);
  data.append("add_feature", "");

  let xhr = new XMLHttpRequest();
  xhr.open("POST", "ajax/features_facilities_crud.php", true);
  xhr.onload = function () {
    console.log(this.responseText);
    var myModal = document.getElementById("feature-s");
    var modal = bootstrap.Modal.getInstance(myModal);
    modal.hide();

    if (this.responseText == 1) {
      alert_settings("success", "New Feature Saved!");
      feature_s_form.elements["feature_name"].value = "";
      get_feature();
    } else {
      alert_settings("error", "Server Down");
    }
  };

  xhr.send(data);
}

function get_feature() {
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "ajax/features_facilities_crud.php", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    document.getElementById("features-data").innerHTML = this.responseText;
  };
  xhr.send("get_feature");
}

function rem_feature(val) {
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "ajax/features_facilities_crud.php", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    if (this.responseText == 1) {
      alert_settings("success", "Feature removed!");
      get_feature();
    } else if (this.responseText == "room_added") {
      alert_settings("error", "Feature is added in room!");
    } else {
      alert_settings("error", "Server Down");
    }
  };

  xhr.send("rem_feature=" + val);
}

//Facility

function add_facility() {
  let data = new FormData();
  data.append("name", facility_s_form.elements["facility_name"].value);
  data.append("icon", facility_s_form.elements["facility_icon"].files[0]);
  data.append("desc", facility_s_form.elements["facility_desc"].value);

  data.append("add_facility", "");

  let xhr = new XMLHttpRequest();
  xhr.open("POST", "ajax/features_facilities_crud.php", true);
  xhr.onload = function () {
    console.log(this.responseText);
    var myModal = document.getElementById("facility-s");
    var modal = bootstrap.Modal.getInstance(myModal);
    modal.hide();

    if (this.responseText == "inv_img") {
      alert_settings("error", "Only SVG images are allowed!");
    } else if (this.responseText == "inv_size") {
      alert_settings("error", "Image should be less than 2MB");
    } else if (this.responseText == "upd_failed") {
      alert_settings("error", "Image upload failed. Server Down");
    } else {
      alert_settings("success", "New Member Saved!");
      facility_s_form.reset();
      get_facilities();
    }
  };

  xhr.send(data);
}

function get_facilities() {
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "ajax/features_facilities_crud.php", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    document.getElementById("facilities-data").innerHTML = this.responseText;
  };
  xhr.send("get_facilities");
}

function rem_facility(val) {
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "ajax/features_facilities_crud.php", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    if (this.responseText == 1) {
      alert_settings("success", "Facility removed!");
      get_facilities();
    } else if (this.responseText == "room_added") {
      alert_settings("error", "Facility is added in room!");
    } else {
      alert_settings("error", "Server Down");
    }
  };

  xhr.send("rem_facility=" + val);
}

window.onload = function () {
  get_feature();
  get_facilities();
};
