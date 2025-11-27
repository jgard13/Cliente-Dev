<?php
header('Content-Type: application/json; charset=utf-8');
require_once "db.php";

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success'=>false,'message'=>'Método no permitido']);
    exit;
}

$username = isset($_POST['username']) ? trim($_POST['username']) : '';
$password = isset($_POST['password']) ? trim($_POST['password']) : '';

$stmt = $conn->prepare("SELECT id_user, username, password FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows === 0) {
    echo json_encode(['success'=>false, 'msg' => 'Usuario no encontrado']);
    exit;
}

$data = $res->fetch_assoc();
$stored = $data['password'];

if ($password === $stored || (function_exists('password_verify') && password_verify($password, $stored))) {
    echo json_encode(['success'=>true, 'msg'=>'Login correcto', 'id_user'=> intval($data['id_user'])]);
} else {
    echo json_encode(['success'=>false, 'msg'=>'Contraseña incorrecta']);
}
?>