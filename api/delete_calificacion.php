<?php
header('Content-Type: application/json; charset=utf-8');
require_once "db.php";

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success'=>false,'message'=>'Método no permitido']);
    exit;
}

$user = isset($_POST['id_user']) ? intval($_POST['id_user']) : 0;
$materia = isset($_POST['materia']) ? intval($_POST['materia']) : 0;

$stmt = $conn->prepare("DELETE FROM calificacionalumnos WHERE Usuario=? AND Materia=?");
$stmt->bind_param("ii", $user, $materia);

if ($stmt->execute()) {
    echo json_encode(['success'=>true,'message'=>'Registro eliminado']);
} else {
    echo json_encode(['success'=>false,'message'=>$stmt->error]);
}
?>