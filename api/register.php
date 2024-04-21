<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $inputData = json_decode(file_get_contents('php://input'), true);

    $firstName = $inputData['firstName'] ?? '';
    $lastName = $inputData['lastName'] ?? '';
    $username = $inputData['username'] ?? '';
    $password = $inputData['password'] ?? '';
    $email = $inputData['email'] ?? '';
    $street = $inputData['street'] ?? '';
    $postalCode = $inputData['postalCode'] ?? '';
    $role = $inputData['role'] ?? 'customer';

    if (!$firstName || !$lastName || !$username || !$password || !$email || !$street || !$postalCode) {
        http_response_code(400); 
        echo json_encode(['error' => 'All fields are required.']);
        exit;
    }

    try {
        $pdo = createPDO();
        $stmt = $pdo->prepare("SELECT * FROM villages WHERE postal_code = ?");
        $stmt->execute([$postalCode]);
        if ($stmt->rowCount() == 0) {
            throw new Exception("Invalid postal code.");
        }

        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        $stmt = $pdo->prepare("INSERT INTO user (firstName, lastName, username, password, email, street, postal_code, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$firstName, $lastName, $username, $hashedPassword, $email, $street, $postalCode, $role]);

        http_response_code(201);
        echo json_encode(['message' => 'User registered successfully']);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'HTTP method not supported.']);
}

function createPDO(){
    $host = "127.0.0.1";
    $dbname = "pizza_shop";
    $username = "root";
    $password = "";

    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    return $pdo;
}
?>
