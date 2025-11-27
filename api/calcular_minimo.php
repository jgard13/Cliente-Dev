<?php
header('Content-Type: application/json; charset=utf-8');
require_once "db.php";

$p1 = isset($_POST['p1']) ? floatval($_POST['p1']) : 0;
$p2 = isset($_POST['p2']) ? floatval($_POST['p2']) : 0;
$tipo = isset($_POST['tipo']) ? strtoupper(trim($_POST['tipo'])) : 'C';

if ($p1 < 0 || $p1 > 100 || $p2 < 0 || $p2 > 100) {
    echo json_encode(['success'=>false,'message'=>'Parciales deben estar entre 0 y 100']);
    exit;
}

switch($tipo){
    case "A": $w1 = 0.20; $w2 = 0.35; $w3 = 0.45; break;
    case "B": $w1 = 0.15; $w2 = 0.35; $w3 = 0.50; break;
    case "C": $w1 = 0.33; $w2 = 0.33; $w3 = 0.34; break;
    case "D": $w1 = 0;    $w2 = 0;    $w3 = 1.0;  break;
}

$meta = 70;
$acumulado = $p1 * $w1 + $p2 * $w2;
$p3_necesario = ($meta - $acumulado) / $w3;

$response = [
    'success' => true,
    'p3_minimo' => round(max(0, $p3_necesario), 2),
    'imposible' => $p3_necesario > 100
];

echo json_encode($response);
?>