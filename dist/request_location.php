<?php
// Start session for rate limiting
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// 1. Same-Origin Check (CORS lockdown)
$origin = $_SERVER['HTTP_ORIGIN'] ?? $_SERVER['HTTP_REFERER'] ?? '';
$host = $_SERVER['HTTP_HOST'];

if ($origin) {
    $parsedUrl = parse_url($origin);
    $originHost = $parsedUrl['host'] ?? '';
    if ($originHost !== $host) {
        http_response_code(403);
        echo json_encode(["status" => "error", "message" => "Cross-origin requests are forbidden."]);
        exit;
    }
}

header("Content-Type: application/json; charset=UTF-8");

// Allow only POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed."]);
    exit;
}

// 2. Rate Limiting Check (30 second cooldown)
$currentTime = time();
if (isset($_SESSION['last_location_submit']) && ($currentTime - $_SESSION['last_location_submit']) < 30) {
    http_response_code(429);
    echo json_encode(["status" => "error", "message" => "You are submitting too fast. Please wait 30 seconds."]);
    exit;
}

// Get POST data
$inputData = json_decode(file_get_contents("php://input"), true);

// 3. Honeypot check
if (!empty($inputData['username'])) { // Hidden honeypot field name
    // Bot detected, silently succeed but do nothing
    echo json_encode(["status" => "success", "message" => "Thank you! We have noted your request."]);
    exit;
}

if (!empty($inputData['location'])) {
    // 4. Sanitize Input
    $location = htmlspecialchars(strip_tags(trim($inputData['location'])));
    if (strlen($location) < 2 || strlen($location) > 100) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Please enter a valid neighborhood name."]);
        exit;
    }

    // Set rate limit timestamp
    $_SESSION['last_location_submit'] = $currentTime;

    // Email Configuration
    $to = "arrowlogicx@gmail.com";
    $subject = "Zafabit Location Request: New submission!";
    $body = "A user has requested Zafabit service in a new area.\n\nRequested Location: " . $location . "\nSubmitted at: " . date("Y-m-d H:i:s") . "\nUser IP: " . ($_SERVER['REMOTE_ADDR'] ?? 'Unknown') . "\n";
    
    // Safe headers
    $headers = "From: Zafabit System <noreply@arrowlogicx.com>\r\n";
    $headers .= "Reply-To: noreply@arrowlogicx.com\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    // Send email
    if (mail($to, $subject, $body, $headers)) {
        echo json_encode(["status" => "success", "message" => "Thank you! We have noted your request."]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Failed to send request. Please try again."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Location name is required."]);
}
