<?php
header('Content-Type: application/json; charset=utf-8');
require_once "db.php";

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success'=>false,'message'=>'Método no permitido']);
    exit;
}

$user = isset($_POST['id_user']) ? intval($_POST['id_user']) : 0;
$materia = isset($_POST['id_materia']) ? intval($_POST['id_materia']) : 0;
$p1 = isset($_POST['p1']) ? floatval($_POST['p1']) : 0;
$p2 = isset($_POST['p2']) ? floatval($_POST['p2']) : 0;
$p3 = isset($_POST['p3']) ? floatval($_POST['p3']) : 0;

$stmt = $conn->prepare("UPDATE calificacionalumnos SET Cal_PrimerParcial = ?, Cal_SegundoParcial = ?, Cal_TercerParcial = ? WHERE Usuario = ? AND Materia = ?");
$stmt->bind_param("dddii", $p1, $p2, $p3, $user, $materia);

if ($stmt->execute()) {
    echo json_encode(['success'=>true,'message'=>'Calificación actualizada']);
} else {
    echo json_encode(['success'=>false,'message'=>$stmt->error]);
}
?>