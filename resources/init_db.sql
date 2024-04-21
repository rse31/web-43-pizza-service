CREATE DATABASE pizza_shop;

USE pizza_shop;

CREATE TABLE IF NOT EXISTS  pizza (
    pizza_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS  toppings (
    topping_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS  pizza_toppings (
    pizza_id INT,
    topping_id INT,
    PRIMARY KEY(pizza_id, topping_id),
    FOREIGN KEY(pizza_id) REFERENCES pizza(pizza_id),
    FOREIGN KEY(topping_id) REFERENCES toppings(topping_id)
);

CREATE TABLE IF NOT EXISTS  villages (
    postal_code VARCHAR(20) PRIMARY KEY,
    village_name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS user (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(255),
    lastName VARCHAR(255),
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    street VARCHAR(255) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    role ENUM('customer', 'admin'), NOT NULL DEFAULT 'customer',
    FOREIGN KEY(postal_code) REFERENCES villages(postal_code)
);

CREATE TABLE IF NOT EXISTS  orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(100),
    total_price DECIMAL(10, 2) NOT NULL,
    special_requests TEXT,
    FOREIGN KEY(user_id) REFERENCES user(user_id)
);

CREATE TABLE IF NOT EXISTS  order_details (
    order_detail_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    pizza_id INT,
    quantity INT NOT NULL,
    FOREIGN KEY(order_id) REFERENCES orders(order_id),
    FOREIGN KEY(pizza_id) REFERENCES pizza(pizza_id)
);

CREATE TABLE IF NOT EXISTS order_detail_toppings (
    order_detail_topping_id INT AUTO_INCREMENT PRIMARY KEY,
    order_detail_id INT,
    topping_id INT,
    FOREIGN KEY(order_detail_id) REFERENCES order_details(order_detail_id),
    FOREIGN KEY(topping_id) REFERENCES toppings(topping_id)
);

INSERT INTO toppings (name, price) VALUES
('Ananas', 1.50),
('Artischocken', 2.00),
('Kaese', 1.75),
('Knoblauch', 1.00),
('Pilze', 1.50),
('Peperoni', 1.50),
('Salami', 2.25),
('Schinken', 2.00),
('Tomaten', 1.25),
('Zwiebeln', 1.00);

INSERT INTO pizza (name, description, price) VALUES
('Pizza Margherita', 'Klassische Pizza mit Tomatensauce, Mozzarella und frischem Basilikum.', 7.50),
('Pizza al Funghi', 'Pizza mit Tomatensauce, Mozzarella und frischen Champignons.', 8.00),
('Pizza Salami', 'Würzige Salami auf Tomatensauce und Mozzarella.', 8.50),
('Pizza Peperoni', 'Scharfe Peperoniwurst, Tomatensauce und Mozzarella.', 8.50),
('Pizza Prosciutto', 'Pizza mit Tomatensauce, Mozzarella und hauchdünnem Schinken.', 9.00),
('Pizza Capriciosa', 'Tomatensauce, Mozzarella, Schinken, Pilze, Artischocken und Oliven.', 9.50),
('Pizza Rimini', 'Tomatensauce, Mozzarella, frische Tomaten und Rucola.', 9.00),
('Pizza Gorgonzola', 'Cremiger Gorgonzola, Mozzarella auf Tomatensauce.', 9.50),
('Pizza Hawaii', 'Tomatensauce, Mozzarella, Schinken und Ananas.', 8.50);

-- Pizza Margherita
INSERT INTO pizza_toppings (pizza_id, topping_id) VALUES
(1, 3),
(1, 9);

-- Pizza al Funghi
INSERT INTO pizza_toppings (pizza_id, topping_id) VALUES
(2, 3), 
(2, 5); 

-- Pizza Salami
INSERT INTO pizza_toppings (pizza_id, topping_id) VALUES
(3, 3), 
(3, 7); 

-- Pizza Peperoni 
INSERT INTO pizza_toppings (pizza_id, topping_id) VALUES
(4, 3), 
(4, 6); 

-- Pizza Prosciutto 
INSERT INTO pizza_toppings (pizza_id, topping_id) VALUES
(5, 3), 
(5, 8); 

-- Pizza Capriciosa 
INSERT INTO pizza_toppings (pizza_id, topping_id) VALUES
(6, 3), 
(6, 8), 
(6, 5), 
(6, 2); 

-- Pizza Rimini 
INSERT INTO pizza_toppings (pizza_id, topping_id) VALUES
(7, 3), 
(7, 9); 

-- Pizza Gorgonzola 
INSERT INTO pizza_toppings (pizza_id, topping_id) VALUES
(8, 3); 

-- Pizza Hawaii 
INSERT INTO pizza_toppings (pizza_id, topping_id) VALUES
(9, 3), 
(9, 8), 
(9, 1); 

INSERT INTO villages (postal_code, village_name) VALUES
('0000', 'Example Village'),
('79639', 'Grenzach-Wyhlen');

INSERT INTO user (firstName, lastName, username, password, email, street, postal_code, role)
VALUES ('Ricky', 'Elfner', 'rse31', 'test123', 'ricky@example.com', 'Rheinfelderstr. 48', '79639', 'customer');

INSERT INTO user (firstName, lastName, username, password, email, street, postal_code, role)
VALUES ('Admin', 'User', 'admin', 'nimda', 'admin@example.com', 'Example Street 1', '0000', 'admin');

INSERT INTO user (firstName, lastName, username, password, email, street, postal_code, role)
VALUES ('Customer', 'Customer', 'customer', SHA2('test123', 256), 'customer@example.com', '1111', '0000', 'customer');