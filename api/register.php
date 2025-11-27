<?php
require_once "db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["error" => "Método no permitido"]);
    exit;
}

$usuario = $_POST["usuario"] ?? "";
$pass = $_POST["pass"] ?? "";

if ($usuario === "" || $pass === "") {
    echo json_encode(["error" => "Faltan datos"]);
    exit;
}

// Verificar si ya existe
$stmt = $pdo->prepare("SELECT id FROM usuarios WHERE usuario = ?");
$stmt->execute([$usuario]);

if ($stmt->rowCount() > 0) {
    echo json_encode(["error" => "Usuario o correo ya registrados"]);
    exit;
}

// Insertar
$stmt = $pdo->prepare("INSERT INTO usuarios (usuario, pass) VALUES (?, ?)");
$ok = $stmt->execute([$usuario,$pass]);

if ($ok) {
    echo json_encode(["success" => true, "msg" => "Usuario creado"]);
} else {
    echo json_encode(["error" => "Error al registrar"]);
}
