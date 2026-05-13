<?php
header('Content-Type: application/json; charset=utf-8');

$user = 'pianoman0';
$token = getenv('SLACK_BOT_TOKEN');
if (!$token) {
    echo json_encode(['ok' => false, 'error' => 'no_token']);
    exit;
}

function slack_api_call($url, $token) {
    if (function_exists('curl_version')) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer ' . $token]);
        curl_setopt($ch, CURLOPT_TIMEOUT, 5);
        $res = curl_exec($ch);
        curl_close($ch);
        if ($res === false) return null;
        return json_decode($res, true);
    }

    $opts = [
        'http' => [
            'method' => 'GET',
            'header' => "Authorization: Bearer " . $token . "\r\n",
            'timeout' => 5,
        ]
    ];
    $context = stream_context_create($opts);
    $res = @file_get_contents($url, false, $context);
    if ($res === false) return null;
    return json_decode($res, true);
}

$userId = null;

$email = 'joel@pressbin.com';
$lookup = slack_api_call('https://slack.com/api/users.lookupByEmail?email=' . urlencode($email), $token);
if ($lookup && isset($lookup['ok']) && $lookup['ok'] && isset($lookup['user']['id'])) {
    $userId = $lookup['user']['id'];
}


if (!$userId) {
    echo json_encode(['ok' => false, 'error' => 'user_not_found']);
    exit;
}

$presenceResp = slack_api_call('https://slack.com/api/users.getPresence?user=' . urlencode($userId), $token);
if ($presenceResp && isset($presenceResp['ok']) && $presenceResp['ok'] && isset($presenceResp['presence'])) {
    echo json_encode(['ok' => true, 'presence' => $presenceResp['presence']]);
    exit;
}

echo json_encode(['ok' => false, 'error' => 'presence_failed']);
