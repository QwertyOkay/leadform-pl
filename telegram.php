<?php

$botToken = '6436111130:AAHrFlvn155SCtPqCJ7v1eXMVNZ8ZrCoq2M';
$groupChatId = '-4014500723';

$apiUrl = "https://api.telegram.org/bot$botToken/sendMessage";

$messageData = array(
    'chat_id' => $groupChatId,
    'text' => $logJson,
);

$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $messageData);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$error = curl_error($ch);

curl_close($ch);