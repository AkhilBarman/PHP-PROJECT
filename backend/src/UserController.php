<?php
require_once __DIR__ . '/Database.php';
class UserController {
    public function register() {
        $data = json_decode(file_get_contents('php://input'), true);
        if (!isset($data['username'], $data['email'], $data['password'])) {
            http_response_code(400);
            echo json_encode(["error" => "Missing fields"]);
            return;
        }
        $db = new Database();
        $stmt = $db->pdo->prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)');
        try {
            $stmt->execute([$data['username'], $data['email'], password_hash($data['password'], PASSWORD_DEFAULT)]);
            echo json_encode(["success" => true]);
        } catch (PDOException $e) {
            if (strpos($e->getMessage(), 'email') !== false) {
                http_response_code(409);
                echo json_encode(["error" => "Email already exists"]);
            } else {
                http_response_code(409);
                echo json_encode(["error" => "Username already exists"]);
            }
        }
    }
    public function login() {
        $data = json_decode(file_get_contents('php://input'), true);
        if (!isset($data['username'], $data['password'])) {
            http_response_code(400);
            echo json_encode(["error" => "Missing fields"]);
            return;
        }
        $db = new Database();
        $stmt = $db->pdo->prepare('SELECT * FROM users WHERE username = ?');
        $stmt->execute([$data['username']]);
        $user = $stmt->fetch();
        if ($user && password_verify($data['password'], $user['password'])) {
            echo json_encode(["success" => true, "user_id" => $user['id']]);
        } else {
            http_response_code(401);
            echo json_encode(["error" => "Invalid credentials"]);
        }
    }
} 