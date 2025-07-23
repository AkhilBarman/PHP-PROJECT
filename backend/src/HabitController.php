<?php
require_once __DIR__ . '/Database.php';
class HabitController {
    public function handle($method) {
        switch ($method) {
            case 'GET': $this->getHabits(); break;
            case 'POST': $this->addHabit(); break;
            case 'DELETE': $this->deleteHabit(); break;
            default:
                http_response_code(405);
                echo json_encode(["error" => "Method not allowed"]);
        }
    }
    public function handleCompletions($method) {
        switch ($method) {
            case 'GET': $this->getCompletions(); break;
            case 'POST': $this->addCompletion(); break;
            case 'DELETE': $this->deleteCompletion(); break;
            default:
                http_response_code(405);
                echo json_encode(["error" => "Method not allowed"]);
        }
    }
    private function getHabits() {
        $user_id = $_GET['user_id'] ?? null;
        if (!$user_id) { http_response_code(400); echo json_encode(["error" => "Missing user_id"]); return; }
        $db = new Database();
        $stmt = $db->pdo->prepare('SELECT * FROM habits WHERE user_id = ?');
        $stmt->execute([$user_id]);
        echo json_encode($stmt->fetchAll());
    }
    private function addHabit() {
        $data = json_decode(file_get_contents('php://input'), true);
        if (!isset($data['user_id'], $data['name'])) {
            http_response_code(400); echo json_encode(["error" => "Missing fields"]); return;
        }
        $db = new Database();
        $stmt = $db->pdo->prepare('INSERT INTO habits (user_id, name, category, description, frequency, color) VALUES (?, ?, ?, ?, ?, ?)');
        $stmt->execute([
            $data['user_id'], $data['name'], $data['category'] ?? '', $data['description'] ?? '', $data['frequency'] ?? '', $data['color'] ?? '#22c55e'
        ]);
        echo json_encode(["success" => true]);
    }
    private function deleteHabit() {
        $data = json_decode(file_get_contents('php://input'), true);
        if (!isset($data['user_id'], $data['habit_id'])) {
            http_response_code(400); echo json_encode(["error" => "Missing fields"]); return;
        }
        $db = new Database();
        $stmt = $db->pdo->prepare('DELETE FROM habits WHERE id = ? AND user_id = ?');
        $stmt->execute([$data['habit_id'], $data['user_id']]);
        echo json_encode(["success" => true]);
    }
    private function getCompletions() {
        $user_id = $_GET['user_id'] ?? null;
        if (!$user_id) { http_response_code(400); echo json_encode(["error" => "Missing user_id"]); return; }
        $db = new Database();
        $stmt = $db->pdo->prepare('SELECT * FROM completions WHERE user_id = ?');
        $stmt->execute([$user_id]);
        echo json_encode($stmt->fetchAll());
    }
    private function addCompletion() {
        $data = json_decode(file_get_contents('php://input'), true);
        if (!isset($data['user_id'], $data['habit_id'], $data['date'])) {
            http_response_code(400); echo json_encode(["error" => "Missing fields"]); return;
        }
        $db = new Database();
        $stmt = $db->pdo->prepare('INSERT INTO completions (user_id, habit_id, date) VALUES (?, ?, ?)');
        $stmt->execute([$data['user_id'], $data['habit_id'], $data['date']]);
        // Update analytics table: increment completions or insert if not exists
        $stmt2 = $db->pdo->prepare('INSERT INTO habit_analytics (user_id, habit_id, date, completions) VALUES (?, ?, ?, 1) ON DUPLICATE KEY UPDATE completions = completions + 1');
        $stmt2->execute([$data['user_id'], $data['habit_id'], $data['date']]);
        echo json_encode(["success" => true]);
    }
    private function deleteCompletion() {
        $data = json_decode(file_get_contents('php://input'), true);
        if (!isset($data['user_id'], $data['completion_id'])) {
            http_response_code(400); echo json_encode(["error" => "Missing fields"]); return;
        }
        $db = new Database();
        $stmt = $db->pdo->prepare('DELETE FROM completions WHERE id = ? AND user_id = ?');
        $stmt->execute([$data['completion_id'], $data['user_id']]);
        echo json_encode(["success" => true]);
    }
} 