<?php
class Database {
    private $host = 'localhost';
    private $port = '3308'; // <-- add this line
    private $db   = 'habitnest';
    private $user = 'root';
    private $pass = '';
    private $charset = 'utf8mb4';
    public $pdo;
    public function __construct() {
        $dsn = "mysql:host={$this->host};port={$this->port};dbname={$this->db};charset={$this->charset}";
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        try {
            $this->pdo = new PDO($dsn, $this->user, $this->pass, $options);
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Database connection failed"]);
            exit;
        }
    }
} 