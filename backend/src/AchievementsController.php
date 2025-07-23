<?php
require_once __DIR__ . '/Database.php';
class AchievementsController {
    public function handle($method) {
        switch ($method) {
            case 'GET': $this->getAchievements(); break;
            case 'POST': $this->unlockAchievement(); break;
            default:
                http_response_code(405);
                echo json_encode(["error" => "Method not allowed"]);
        }
    }
    private function getAchievements() {
        $user_id = $_GET['user_id'] ?? null;
        if (!$user_id) { http_response_code(400); echo json_encode(["error" => "Missing user_id"]); return; }
        $db = new Database();
        $stmt = $db->pdo->prepare('SELECT achievement_key, unlocked_at FROM achievements WHERE user_id = ?');
        $stmt->execute([$user_id]);
        echo json_encode($stmt->fetchAll());
    }
    private function unlockAchievement() {
        $data = json_decode(file_get_contents('php://input'), true);
        if (!isset($data['user_id'], $data['achievement_key'])) {
            http_response_code(400); echo json_encode(["error" => "Missing fields"]); return;
        }
        $db = new Database();
        // Map achievement keys to descriptions
        $descriptions = [
            'first_habit' => 'Earned for creating your first habit',
            'early_bird' => 'Logged a habit before 7am',
            // Add more as needed
        ];
        $description = $descriptions[$data['achievement_key']] ?? 'Achievement unlocked!';
        // Only insert if not already unlocked
        $stmt = $db->pdo->prepare('INSERT IGNORE INTO achievements (user_id, achievement_key, description) VALUES (?, ?, ?)');
        $stmt->execute([$data['user_id'], $data['achievement_key'], $description]);
        echo json_encode(["success" => true]);
    }
} 