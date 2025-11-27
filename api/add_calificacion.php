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

if ($user <= 0 || $materia <= 0) {
    echo json_encode(['success'=>false,'message'=>'Usuario o materia inválidos']);
    exit;
}
foreach ([$p1,$p2,$p3] as $v) {
    if ($v < 0 || $v > 100) {
        echo json_encode(['success'=>false,'message'=>'Parciales deben estar entre 0 y 100']);
        exit;
    }
}

$stmtCheck = $conn->prepare("SELECT COUNT(*) as cnt FROM calificacionalumnos WHERE Usuario = ? AND Materia = ?");
$stmtCheck->bind_param("ii", $user, $materia);
$stmtCheck->execute();
$resCheck = $stmtCheck->get_result()->fetch_assoc();
if ($resCheck['cnt'] > 0) {
    echo json_encode(['success'=>false,'message'=>'Ya existe calificación para este usuario y materia']);
    exit;
}

$stmt = $conn->prepare("INSERT INTO calificacionalumnos (Usuario, Materia, Cal_PrimerParcial, Cal_SegundoParcial, Cal_TercerParcial) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("iiddd", $user, $materia, $p1, $p2, $p3);

if ($stmt->execute()) {
    echo json_encode(['success'=>true,'message'=>'Calificación agregada']);
} else {
    echo json_encode(['success'=>false,'message'=>$stmt->error]);
}
?>