<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$action = $_GET['action'] ?? '';

try {
    switch ($action) {
        case 'getAllPizza':
            $pizzas = getAllPizza(); 
            echo json_encode($pizzas);
            break;
            case 'getAllTopings':
                $pizzas = getAllTopings();
                echo json_encode($pizzas);
                break;
        default:
            http_response_code(400);
            echo json_encode(['error' => 'Invalid action specified']);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}

function getAllPizza()
{
    $sql = "SELECT * FROM pizza";

    try {
        $pdo = createPDO();
        $statement = $pdo->query($sql);

        if ($statement) {
            return $statement->fetchAll(PDO::FETCH_ASSOC);
        } else {
            return [];
        }

    } catch (PDOException $e) {
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
};

function getAllTopings()
{
    $sql = "SELECT * FROM toppings";

    try {
        $pdo = createPDO();
        $statement = $pdo->query($sql);

        if ($statement) {
            return $statement->fetchAll(PDO::FETCH_ASSOC);
        } else {
            return [];
        }

    } catch (PDOException $e) {
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
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