<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $inputData = json_decode(file_get_contents('php://input'), true);

    $userId = $inputData['user_id'] ?? null;
    $firstName = $inputData['firstName'] ?? '';
    $lastName = $inputData['lastName'] ?? '';
    $email = $inputData['email'] ?? '';
    $street = $inputData['street'] ?? '';
    $postalCode = $inputData['postalCode'] ?? '';
    $villageName = $inputData['villageName'] ?? '';

    if (!$userId) {
        http_response_code(400);
        echo json_encode(['error' => 'User ID is required.']);
        exit;
    }

    try {
        $pdo = createPDO();
        $sql = "UPDATE user SET firstName = :firstName, lastName = :lastName, street = :street WHERE user_id = :userId";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':firstName' => $firstName,
            ':lastName' => $lastName,
            ':userId' => $userId,
            ':street' => $street
        ]);

        if ($stmt->rowCount()) {
            echo json_encode(['message' => 'User updated successfully']);
        } else {
            echo json_encode(['message' => 'No update was made to the user data.']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'HTTP method not supported.']);
}

function createPDO() {
    $host = "127.0.0.1";
    $dbname = "pizza_shop";
    $username = "root";
    $password = "";

    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    return $pdo;
}
?>
