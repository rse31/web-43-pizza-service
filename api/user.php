<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$username = $_GET['userID'] ?? ''; 

try {
    if (isset($_GET['orders']) && $_GET['orders'] == 'true') {
        $orders = getOrdersByUser($username);
        echo json_encode($orders);
    } else {
        $user = getUser($username);
        echo json_encode($user);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

function getUser($userID)
{
    $sql =
    'SELECT user.*, villages.village_name 
    FROM user 
    JOIN villages ON user.postal_code = villages.postal_code 
    WHERE user.username = :username 
    LIMIT 1';

    try {
        $pdo = createPDO();
        $statement = $pdo->prepare($sql);
        $statement->bindParam(':username', $userID, PDO::PARAM_STR);
        $statement->execute();

        $user = $statement->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            unset($user['password']);
            return $user;
        } else {
            return null;
        }
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
        return null;
    }
}

function getOrdersByUser($userID) {
    $sql = 'SELECT o.order_id, o.order_date, o.status, o.total_price, o.special_requests
            FROM orders o
            JOIN user u ON o.user_id = u.user_id
            WHERE u.username = :username';

    try {
        $pdo = createPDO();
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':username', $userID, PDO::PARAM_STR);
        $stmt->execute();
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($orders as $key => $order) {
            $orders[$key]['details'] = getOrderDetails($order['order_id']);
        }
        
        return $orders;
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
        return [];
    }
}


function getOrderDetails($orderId) {
    $sql = 'SELECT od.quantity, p.name AS pizza_name, p.description, p.price AS pizza_price, od.order_detail_id
            FROM order_details od
            JOIN pizza p ON od.pizza_id = p.pizza_id
            WHERE od.order_id = :orderId';
    
    try {
        $pdo = createPDO();
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':orderId', $orderId, PDO::PARAM_INT);
        $stmt->execute();
        $details = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        foreach ($details as $key => $detail) {
            $details[$key]['toppings'] = getPizzaToppings($detail['order_detail_id']);
        }

        return $details;
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
        return [];
    }
}

function getPizzaToppings($orderDetailId) {
    $sql = 'SELECT t.name, t.price
            FROM order_detail_toppings odt
            JOIN toppings t ON odt.topping_id = t.topping_id
            WHERE odt.order_detail_id = :orderDetailId';
    
    try {
        $pdo = createPDO();
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':orderDetailId', $orderDetailId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
        return [];
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