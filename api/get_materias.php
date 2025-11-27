<?php
header('Content-Type: application/json; charset=utf-8');
require_once "db.php";

$sql = "SELECT id_materia, NombreMateria, TipoPonderacion FROM materias ORDER BY NombreMateria ASC";
$res = $conn->query($sql);

$materias = [];
while ($row = $res->fetch_assoc()) {
    $materias[] = [
        'id_materia' => intval($row['id_materia']),
        'NombreMateria' => $row['NombreMateria'],
        'TipoPonderacion' => strtoupper(trim($row['TipoPonderacion']))
    ];
}

echo json_encode(['success'=>true, 'data'=>$materias]);
?>