<?php
class Router {
    public function route() {
        $uri = $_SERVER['REQUEST_URI'];
        $method = $_SERVER['REQUEST_METHOD'];
        header('Content-Type: application/json');
        // Example routing logic
        if (preg_match('#/api/register#', $uri)) {
            require_once __DIR__ . '/UserController.php';
            $controller = new UserController();
            $controller->register();
        } elseif (preg_match('#/api/login#', $uri)) {
            require_once __DIR__ . '/UserController.php';
            $controller = new UserController();
            $controller->login();
        } elseif (preg_match('#/api/habits#', $uri)) {
            require_once __DIR__ . '/HabitController.php';
            $controller = new HabitController();
            $controller->handle($method);
        } elseif (preg_match('#/api/completions#', $uri)) {
            require_once __DIR__ . '/HabitController.php';
            $controller = new HabitController();
            $controller->handleCompletions($method);
        } elseif (preg_match('#/api/achievements#', $uri)) {
            require_once __DIR__ . '/AchievementsController.php';
            $controller = new AchievementsController();
            $controller->handle($method);
        } else {
            http_response_code(404);
            echo json_encode(["error" => "Not found"]);
        }
    }
} 