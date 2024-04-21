<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    echo "test";
    echo json_encode(getAllPizza());
    exit;
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
        echo "Error: " . $e->getMessage();
    }
}

?>