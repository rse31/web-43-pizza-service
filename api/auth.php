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
    $email = $inputData['email'] ?? '';
    $password = $inputData['password'] ?? '';

    try {
        if (!empty($email) && !empty($password)) {
            $user = login($email, $password);
            if ($user) {
                echo json_encode($user);
            } else {
                http_response_code(401);
                echo json_encode(['error' => 'Invalid email or password.']);
            }
        } else {
            http_response_code(400); 
            echo json_encode(['error' => 'Email and password are required.']);
        }
    } catch (Exception $e) {
        http_response_code(500); 
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

function login($email, $password)
{
    $sql = 'SELECT * FROM user WHERE email = :email LIMIT 1';

    try {
        $pdo = createPDO();
        $statement = $pdo->prepare($sql);
        $statement->bindParam(':email', $email, PDO::PARAM_STR);
        $statement->execute();

        $user = $statement->fetch(PDO::FETCH_ASSOC);
        
        if ($user && password_verify($password, $user['password'])) {
            unset($user['password']);
            return $user;
        } else {
            return null;
        }

    } catch (PDOException $e) {
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
        return null;
    }
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
