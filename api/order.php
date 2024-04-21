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
    $username = $inputData['user_id'] ?? '';
    $total_price = $inputData['total_price'] ?? '';
    $pizzas = $inputData['pizzas'] ?? '';
    $specialRequests = $inputData['specialRequests'] ?? '';

    try {
        if (true) {
            $order = createOrder($username, "status", $total_price,$pizzas, $specialRequests);
            if (true) {
                echo json_encode($order);
            } else {
                http_response_code(401); 
                echo json_encode(['error' => 'Invalid email or password.']);
            }
        } else {
            http_response_code(400); 
            echo json_encode(['error' => 'Email and password are required.']);
        }
    } catch (Exception $e) {
        http_response_code(501);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'HTTP method not supported.']);
}


function createOrder($username, $status, $total_price, $pizzas, $specialRequests){
    $pdo = createPDO();
    try {
        $pdo->beginTransaction();
        $stmt = $pdo->prepare("SELECT user_id FROM user WHERE username = ?");
        $stmt->execute([$username]);
        $userRow = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$userRow) {
            throw new Exception("User not found.");
        }

        $user_id = $userRow['user_id'];

        $stmt = $pdo->prepare("INSERT INTO orders (user_id, status, total_price, special_requests) VALUES (?, ?, ?, ?)");
        $stmt->execute([$user_id, $status, $total_price, $specialRequests]);
        $order_id = $pdo->lastInsertId();

        foreach ($pizzas as $pizza) {
            $stmt = $pdo->prepare("INSERT INTO order_details (order_id, pizza_id, quantity) VALUES (?, ?, ?)");
            $stmt->execute([$order_id, $pizza['pizza_id'], $pizza['quantity']]);
            $order_detail_id = $pdo->lastInsertId();

            if (isset($pizza['toppings']) && is_array($pizza['toppings'])) {
                foreach ($pizza['toppings'] as $toppingId) {
                    $stmt = $pdo->prepare("INSERT INTO order_detail_toppings (order_detail_id, topping_id) VALUES (?, ?)");
                    $stmt->execute([$order_detail_id, $toppingId]);
                }
            }
        }

        $pdo->commit();
        return ['order_id' => $order_id]; 
    } catch (Exception $e) {
        $pdo->rollback();
        throw $e;
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
