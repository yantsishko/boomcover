<?php 

define("__TO__", "info@boomcover.com");

define('__SUCCESS_MESSAGE__', "Ваше сообщение было отправлени. Мы ответим вам в ближайшее время. Спасибо!");

define('__ERROR_MESSAGE__', "Ваше сообщение не было отправлено. Пожалуйста, попробуйте снова.");

define('__MESSAGE_EMPTY_FIELDS__', "Пожалуйста, заполните все поля.");

function check_email($email){
    if(!@preg_match("^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$", $email)){
        return false;
    } else {
        return true;
    }
}

function send_mail($to,$subject,$message,$headers){
    if(@mail($to,$subject,$message,$headers)){
        echo json_encode(array('info' => 'success', 'msg' => __SUCCESS_MESSAGE__));
    } else {
        echo json_encode(array('info' => 'error', 'msg' => __ERROR_MESSAGE__));
    }
}

if(isset($_POST['name']) and isset($_POST['emaild']) and isset($_POST['message'])){
    $name = $_POST['name'];
    $mail = $_POST['emaild'];
    $subject = $_POST['subject'];
    $message = $_POST['message'];

    if($name == '') {
        echo json_encode(array('info' => 'error', 'msg' => "Пожалуйста, введите ваше имя."));
        exit();
    } else if($mail == '' or check_email($mail) == false){
        echo json_encode(array('info' => 'error', 'msg' => "Пожалуйста, введите корректный e-mail."));
        exit();
    } else if($message == ''){
        echo json_encode(array('info' => 'error', 'msg' => "Пожалуйста, введите ваше сообщение."));
        exit();
    } else {
        $to = __TO__;
        $subject = $subject . ' ' . $name;
        $message = '
        <html>
        <head>
          <title>Mail from '. $name .'</title>
        </head>
        <body>
          <table style="width: 500px; font-family: arial; font-size: 14px;" border="1">
            <tr style="height: 32px;">
              <th align="right" style="width:150px; padding-right:5px;">Имя:</th>
              <td align="left" style="padding-left:5px; line-height: 20px;">'. $name .'</td>
            </tr>
            <tr style="height: 32px;">
              <th align="right" style="width:150px; padding-right:5px;">E-mail:</th>
              <td align="left" style="padding-left:5px; line-height: 20px;">'. $mail .'</td>
            </tr>
            <tr style="height: 32px;">
              <th align="right" style="width:150px; padding-right:5px;">Тема:</th>
              <td align="left" style="padding-left:5px; line-height: 20px;">'. $subject .'</td>
            </tr>
            <tr style="height: 32px;">
              <th align="right" style="width:150px; padding-right:5px;">Сообщение:</th>
              <td align="left" style="padding-left:5px; line-height: 20px;">'. $message  .'</td>
            </tr>
          </table>
        </body>
        </html>
        ';

        $headers  = 'MIME-Version: 1.0' . "\r\n";
        $headers .= 'Content-type: text/html; charset=utf-8' . "\r\n";
        $headers .= 'From: ' . $mail . "\r\n";

        send_mail($to,$subject,$message,$headers);
    }
} else {
    echo json_encode(array('info' => 'error', 'msg' => __MESSAGE_EMPTY_FIELDS__));
}
 ?>