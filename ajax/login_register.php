<?php
require('../admin/inc/db_config.php');
require('../admin/inc/essentials.php');



// require './phpmailer/vendor/autoload.php';
require  'C:/xampp/htdocs/Hotel_Booking/PHPMailer/src/PHPMailer.php';
require  'C:/xampp/htdocs/Hotel_Booking/PHPMailer/src/Exception.php';
require  'C:/xampp/htdocs/Hotel_Booking/PHPMailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

date_default_timezone_set("Asia/Ho_Chi_Minh");

function sendMail($email, $name, $token, $type)
{
    if ($type == "email_confirmation") {
        $page = 'email_confirm.php';
        $subject = "Email Vertification from NHC2203";
        $content = "confirm your Email";
    } else {
        $page = 'index.php';
        $subject = "Email Change Password from NHC2203";
        $content = "reset your account";
    }

    $mail = new PHPMailer(true);

    try {
        //Server settings
        $mail->SMTPDebug = SMTP::DEBUG_SERVER;
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'nguyenhungcuong22032001@gmail.com';
        $mail->Password   = 'ejzehbakhnuuqlix';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port       = 465;

        //Recipients
        $mail->setFrom('nguyenhungcuong22032001@gmail.com', 'NHC2203');
        $mail->addAddress($email, $name);     //Add a recipient

        //Content
        $mail->isHTML(true);                                  //Set email format to HTML
        $mail->Subject = $subject;
        $mail->Body    = "Click the link to $content: <br/>
                          <a href='" . SITE_URL . "$page?$type&email=$email&token=$token" . "'>Click Here</a>";
        $mail->send();
        return 1;
    } catch (Exception $e) {
        return 0;
    }
}


if (isset($_POST['register'])) {
    $data = filteration($_POST);

    // Match password and confirm password field
    if ($data['pass'] != $data['cpass']) {
        echo 'pass_mismatch';
        exit;
    }

    // Check user exists or not

    $u_exist = select("SELECT * FROM `user_cred` WHERE `email` = ? OR `phonenum` = ? ", [$data['email'], $data['phonenum']], 'ss');

    if (mysqli_num_rows($u_exist) != 0) {
        $u_exist_fetch = mysqli_fetch_assoc($u_exist);
        echo ($u_exist_fetch['email'] == $data['email']) ? 'email_already' : 'phone_already';
        exit;
    }

    //Upload user image to server

    $img =  uploadUserImage($_FILES['profile']);

    if ($img == 'inv_img') {
        echo 'inv_img';
        exit;
    } else if ($img == 'upd_failed') {
        echo 'upd_failed';
        exit;
    }

    // Send Confirmation link to user's email
    $token = bin2hex(random_bytes(16));

    if (!sendMail($data['email'], $data['name'], $token, "email_confirmation")) {
        echo 'email_send_failed';
        exit;
    }

    $enc_pass = password_hash($data['pass'], PASSWORD_BCRYPT);

    $query = "INSERT INTO `user_cred`(`name`, `email`, `address`, `phonenum`, `pincode`, `dob`, `profile`, `password`, `token`) VALUES (?,?,?,?,?,?,?,?,?)";
    $values = [$data['name'], $data['email'], $data['address'], $data['phonenum'], $data['pincode'], $data['dob'], /*'test1'*/ $img, $enc_pass, $token];
    if (insert($query, $values, 'sssssssss')) {
        echo 1;
    } else {
        echo 'ins_failed';
    }
}

if (isset($_POST['login'])) {
    $data = filteration($_POST);

    // Check user exists or not

    $u_exist = select("SELECT * FROM `user_cred` WHERE `email` = ? OR `phonenum` = ? LIMIT 1 ", [$data['email_mob'], $data['email_mob']], 'ss');

    if (mysqli_num_rows($u_exist) == 0) {
        echo 'inv_email_mob';
        exit;
    } else {
        $u_fetch = mysqli_fetch_assoc($u_exist);
        if ($u_fetch['is_verified'] == 0) {
            echo 'not_verified';
        } else if ($u_fetch['status'] == 0) {
            echo 'inactive';
        } else {
            if (!password_verify($data['pass'], $u_fetch['password'])) {
                echo 'invalid_pass';
            } else {
                session_start();
                $_SESSION['login'] = true;
                $_SESSION['uId'] = $u_fetch['id'];
                $_SESSION['uName'] = $u_fetch['name'];
                $_SESSION['uPic'] = $u_fetch['profile'];
                $_SESSION['uPhone'] = $u_fetch['phonenum'];
                echo 1;
            }
        }
    }
}

if (isset($_POST['forgot_pass'])) {
    $data = filteration($_POST);

    $u_exist = select("SELECT * FROM `user_cred` WHERE `email` = ? LIMIT 1 ", [$data['email']], 's');

    if (mysqli_num_rows($u_exist) == 0) {
        echo 'inv_email';
    } else {
        $u_fetch = mysqli_fetch_assoc($u_exist);
        if ($u_fetch['is_verified'] == 0) {
            echo 'not_verified';
        } else if ($u_fetch['status'] == 0) {
            echo 'inactive';
        } else {
            // Send reset link to email
            $token = bin2hex(random_bytes(16));
            if (!sendMail($data['email'], 'Admin', $token, "account_recovery")) {
                echo 'mail_failed';
            } else {
                $date = date("Y-m-d");

                $query = mysqli_query($con, "UPDATE `user_cred` SET `token` = '$token', `t_expire` = '$date' WHERE `id` = '$u_fetch[id]'");

                if ($query) {
                    echo 1;
                } else {
                    echo 'upd_failed';
                }
            }
        }
    }
}

if (isset($_POST['recover_user'])) {
    $data = filteration($_POST);

    $enc_pass = password_hash($data['pass'], PASSWORD_BCRYPT);

    $query = "UPDATE `user_cred` SET `password` = ?, `token` = ?, `t_expire` = ? WHERE `email` = ? AND `token` = ?";
    $values = [$enc_pass, null, null, $data['email'], $data['token']];

    if (update($query, $values, 'sssss')) {
        echo 1;
    } else {
        echo 'failed';
    }
}
