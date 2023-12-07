<?php
// pass generator
function generateRandomString($length = 8)
{
  $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  $charactersLength = strlen($characters);
  $randomString = '';
  for ($i = 0; $i < $length; $i++) {
    $randomString .= $characters[rand(0, $charactersLength - 1)];
  }

  return $randomString . '1Ab';
}

// get user ip
function getUserIP()
{
  if (isset($_SERVER["HTTP_CF_CONNECTING_IP"])) {
    $_SERVER['REMOTE_ADDR'] = $_SERVER["HTTP_CF_CONNECTING_IP"];
    $_SERVER['HTTP_CLIENT_IP'] = $_SERVER["HTTP_CF_CONNECTING_IP"];
  }
  $client  = @$_SERVER['HTTP_CLIENT_IP'];
  $forward = @$_SERVER['HTTP_X_FORWARDED_FOR'];
  $remote  = $_SERVER['REMOTE_ADDR'];

  if (filter_var($client, FILTER_VALIDATE_IP)) {
    $ip = $client;
  } elseif (filter_var($forward, FILTER_VALIDATE_IP)) {
    $ip = $forward;
  } else {
    $ip = $remote;
  }

  return $ip;
}

// // Получение языка браузера пользователя в формате из двух символов
// if (isset($_SERVER['HTTP_ACCEPT_LANGUAGE'])) {
//     $user_language = locale_accept_from_http($_SERVER['HTTP_ACCEPT_LANGUAGE']);
//     // Извлекаем первые два символа языка (например, "en" из "en-gb")
//     $user_language = substr($user_language, 0, 2);
// } else {
//     // Если заголовок не установлен, устанавливаем язык по умолчанию
//     $user_language = 'ua';
// }

// declare requires values
$password = generateRandomString();
$ip = getUserIP();
$email = isset($_POST['email']) ? $_POST['email'] : '';
$phone = isset($_POST['phone']) ? $_POST['phone'] : '';
$firstname = isset($_POST['f_name']) ? $_POST['f_name'] : '';
$lastname = isset($_POST['last_name']) ? $_POST['last_name'] : '';
$url = isset($_POST['url']) ? $_POST['url'] : '';

// declare user country code
$ip_response = file_get_contents("http://ip-api.com/json/{$ip}");
if ($ip_response !== false) {
  $data = json_decode($ip_response, true);

  if ($data['status'] == 'success')
    $country = $data['countryCode'];
  else
    $country = "Null";
} else {
  $country = "Invalid respone ip-api";
}

// declare tracking values
$partner = "Hypernet";
$offer = "EnelGreenCoin";
$subid = isset($_GET['subid']) ? $_GET['subid'] : '';
$pixel = isset($_POST['pixel']) ? $_POST['pixel'] : '';
$buyer = isset($_POST['buyer']) ? $_POST['buyer'] : '';
$utm_campaign = isset($_POST['utm_campaign']) ? $_POST['utm_campaign'] : '';
$adset_name = isset($_POST['adset_name']) ? $_POST['adset_name'] : '';

// buyer authorization data
$affc = isset($_POST['affc']) ? $_POST['affc'] : '';
$bxc = isset($_POST['bxc']) ? $_POST['bxc'] : '';
$vc = isset($_POST['vc']) ? $_POST['vc'] : '';
$api_key = isset($_POST['api_key']) ? $_POST['api_key'] : '';

// send request
$api_url = 'https://mextraff.click/api/external/integration/lead';
$headers = array(
  'x-api-key: ' . $api_key,
  'Content-Type: application/json'
);
$data = array(
  'affc' => $affc,
  'bxc' => $bxc,
  'vtc' => $vc,
  'profile' => array(
    'firstName' => $firstname,
    'lastName' => $lastname,
    'email' => $email,
    'password' => str_replace('+', '', $password),
    'phone' => $phone
  ),
  'ip' => $ip,
  'funnel' => $offer,
  'landingURL' => $url,
  'geo' => $country,
  'lang' => $user_language,
  'landingLang' => 'PL',
  'subId' => $subid,
  'utmId' => $pixel,
  'subId_a' => $buyer,
  'subId_b' => $utm_campaign,
  'subId_c' => $adset_name,
);

// Инициализация cURL-сессии
$ch = curl_init();

// Установка параметров запроса
curl_setopt($ch, CURLOPT_URL, $api_url);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

// Выполнение запроса и получение результата
$crm_response = curl_exec($ch);
curl_close($ch);

// autologin
$decoded_respone = json_decode($crm_response, true);

if (($decoded_respone['success'] === true) && isset($decoded_respone['redirectUrl'])) {
  header('Refresh: 3; URL=' . $decoded_respone['redirectUrl']);
}

// Lead postback
$pb_curl = curl_init();
$data = [
  'subid' => $subid,
  'status' => 'lead'
];

$pbData = http_build_query($data);

curl_setopt_array($pb_curl, [
  CURLOPT_URL => "https://mextraff.pro/cacec1a/postback",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => $pbData,
]);

$pb_response = curl_exec($pb_curl);
$pb_err = curl_error($pb_curl);
curl_close($pb_curl);

// Txt log
date_default_timezone_set('Europe/Kiev');
$conversion_time = date('Y-m-d H:i:s');

$logArray = [
  'affc' => $affc,
  'bxc' => $bxc,
  'vtc' => $vc,
  'x-api-key' => $api_key,
  'profile' => array(
    'firstName' => $firstname,
    'lastName' => $lastname,
    'email' => $email,
    'password' => $password,
    'phone' => $phone
  ),
  'ip' => $ip,
  "partner" => $partner,
  'funnel' => $offer,
  'landingURL' => $url,
  'geo' => $country,
  'lang' => $user_language,
  'landingLang' => 'PL',
  'subId' => $subid,
  'utmId' => $pixel,
  'subId_a' => $buyer,
  'subId_b' => $utm_campaign,
  'subId_c' => $adset_name,
  'trackingValues' => array(
    "pixel" => $pixel,
    "buyer" => $buyer,
    "utm_campaign" => $utm_campaign,
    "adset_name" => $adset_name,
  ),
  "crm_response" => $crm_response,
  "pb_response" => $pb_response,
  "conversion_time" => $conversion_time,
];

$logJson = json_encode($logArray, JSON_PRETTY_PRINT);
$currentContents = file_get_contents('log.txt');
$newContents = $logJson . PHP_EOL . $currentContents;
file_put_contents('log.txt', $newContents);

// Telegram log
include "telegram.php";

?>

<!DOCTYPE html>
<html>

<head>
  <title>DZIĘKUJĘ!</title>
  <meta charset="utf-8">
  <meta name="robots" content="none">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <meta name="description" content="">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    @import url(https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap);

    *,
    ul {
      margin: 0
    }

    * {
      padding: 0;
      box-sizing: border-box
    }

    body {
      background: #f4f9fd;
      font-family: Montserrat, sans-serif;
      font-size: 14px;
      font-weight: 400;
      color: #2e2e2e;
      line-height: 1.5
    }

    ul {
      list-style: none
    }

    .container {
      max-width: 794px;
      margin: 75px auto 230px;
      background: #fff;
      box-shadow: 0 4px 20px rgba(0, 0, 0, .1)
    }

    .success-page__header {
      padding: 45px 10px 65px;
      text-align: center;
      color: #fff;
      background-color: #1c1c1c;
      background-image: url('https://pascalmachineai.com/pl/images/bg-components/firstScreen_blur_bg.png')
    }

    .success-page__header-wrapper {
      max-width: 528px;
      margin: auto
    }

    .success-page__header-check {
      background: #3cd654;
      width: 70px;
      height: 70px;
      border-radius: 50%;
      position: relative;
      margin: auto auto 25px
    }

    .success-page__header-check::after,
    .success-page__header-check::before {
      content: "";
      background: #fff;
      position: absolute
    }

    .success-page__header-check::before {
      width: 14px;
      height: 4px;
      left: 19px;
      top: 37px;
      transform: rotate(45deg)
    }

    .success-page__header-check::after {
      width: 28px;
      height: 4px;
      left: 26px;
      top: 34px;
      transform: rotate(135deg)
    }

    .success-page__title {
      font-weight: 700;
      font-size: 30px;
      margin-bottom: 15px
    }

    .success-page__title span {
      text-transform: uppercase
    }

    .success-page__message_success {
      font-weight: 500;
      line-height: 1.57
    }

    .success-page__body {
      padding: 85px 10px 65px
    }

    .success-page__body-wrapper {
      max-width: 385px;
      margin: auto
    }

    .list-info {
      background: #f4f9fd;
      padding: 20px;
      margin-bottom: 15px
    }

    .list-info__text {
      color: #000;
      font-weight: 600;
      margin-right: 10px
    }

    .success-page__message_fail__link {
      color: #147fdf;
      margin-bottom: 40px;
      display: inline-block
    }

    .success-page__message_fail__link:hover {
      text-decoration: none
    }

    .success-page__text {
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 30px
    }

    @media(max-width:795px) {
      .container {
        margin-top: 0;
        margin-bottom: 0
      }

      .success-page__header {
        padding-top: 55px
      }

      .success-page__title {
        font-size: 24px
      }

      .success-page__body {
        padding: 30px 10px 130px
      }

      .success-page__text {
        font-size: 14px;
        margin-bottom: 20px
      }
    }
  </style>

  <!-- Facebook Pixel Code -->
  <img height="1" width="1" src="https://www.facebook.com/tr?id=<?= $pixel; ?>&ev=Lead&noscript=1" />
  <!-- End Facebook Pixel Code -->
</head>

<body>        
	<div class="mod success-page">
		<div class="container">
			<div class="success-page__header">
				<div class="success-page__header-wrapper">
					<div class="success-page__header-check"></div>
					<h2 class="success-page__title">
						<span><?= $firstname; ?></span>, dziękuję za złożenie pytania.
					</h2>
					<p class="success-page__message_success">
          Nasz przedstawiciel skontaktuje się z Państwem wkrótce.
        </p>
				</div>
			</div>
			<div class="success-page__body">
				<div class="success-page__body-wrapper">
					<h3 class="success-page__text">Proszę sprawdzić dane kontaktowe:</h3>
					<div class="list-info">
						<ul class="list-info__list">
							<li class="list-info__item">
								<span class="list-info__text">Telefon: </span>
								<?= $phone; ?>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
</body>

</html>