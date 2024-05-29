let carousel_s_form = document.getElementById("carousel_s_form");
let carousel_picture_inp = document.getElementById("carousel_picture_inp");

function add_image() {
  let data = new FormData();
  data.append("picture", carousel_picture_inp.files[0]);
  data.append("add_image", "");

  let xhr = new XMLHttpRequest();
  xhr.open("POST", "ajax/carousel_crud.php", true);
  xhr.onload = function () {
    console.log(this.responseText);
    var myModal = document.getElementById("carousel-s");
    var modal = bootstrap.Modal.getInstance(myModal);
    modal.hide();

    if (this.responseText == "inv_img") {
      alert_settings("error", "Only JPG and PNG images are allowed!");
    } else if (this.responseText == "inv_size") {
      alert_settings("error", "Image should be less than 2MB");
    } else if (this.responseText == "upd_failed") {
      alert_settings("error", "Image upload failed. Server Down");
    } else {
      alert_settings("success", "New Image Saved!");
      carousel_picture_inp.value = "";
      get_carousels();
    }
  };

  xhr.send(data);
}

function get_carousels() {
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "ajax/carousel_crud.php", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    document.getElementById("carousel-data").innerHTML = this.responseText;
  };
  xhr.send("get_carousels");
}

function rem_image(val) {
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "ajax/carousel_crud.php", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    if (this.responseText == 1) {
      alert_settings("success", "Image removed!");
      get_carousels();
    } else {
      alert_settings("error", "Server Down");
    }
  };

  xhr.send("rem_image=" + val);
}

carousel_s_form.addEventListener("submit", function (event) {
  event.preventDefault();
  add_image();
});

// contacts_s_form.addEventListener("submit", function (e) {
//   e.preventDefault();
//   upd_contacts();
// });

function upd_contacts() {
  let index = [
    "address",
    "gmap",
    "pn1",
    "pn2",
    "email",
    "fb",
    "insta",
    "tw",
    "iframe",
  ];
  let contacts_inp_id = [
    "address_inp",
    "gmap_inp",
    "pn1_inp",
    "pn2_inp",
    "email_inp",
    "fb_inp",
    "insta_inp",
    "tw_inp",
    "iframe_inp",
  ];

  let data_str = "";

  for (i = 0; i < index.length; i++) {
    data_str +=
      index[i] + "=" + document.getElementById(contacts_inp_id[i]).value + "&";
  }
  data_str += "upd_contacts";

  let xhr = new XMLHttpRequest();
  xhr.open("POST", "ajax/settings_crud.php", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    var myModal = document.getElementById("contacts-s");
    var modal = bootstrap.Modal.getInstance(myModal);
    modal.hide();
    if (this.responseText == 1) {
      alert_settings("success", "Changes saved!");
      get_contacts();
    } else {
      alert_settings("success", "Not changes made");
    }
  };
  xhr.send(data_str);
}

window.onload = function () {
  get_carousels();
};
