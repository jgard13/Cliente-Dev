<?php
// Cliente-Dev/api/get_calificaciones.php

header('Content-Type: application/json');

$host = "localhost"; // o 127.0.0.1
$user = "root";      // tu usuario de MySQL
$pass = "";          // tu contraseña de MySQL
$db   = "gestioncalificaciones"; // tu base de datos

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    echo json_encode([]);
    exit;
}

// Obtener id_user desde GET
$id_user = isset($_GET['id_user']) ? intval($_GET['id_user']) : 0;

$sql = "SELECT c.Usuario, c.Materia, c.Cal_PrimerParcial, c.Cal_SegundoParcial, c.Cal_TercerParcial,
               m.NombreMateria, m.TipoPonderacion
        FROM calificacionalumnos c
        INNER JOIN materias m ON c.Materia = m.id_materia
        WHERE c.Usuario = $id_user";

$result = $conn->query($sql);

$data = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

echo json_encode($data);
$conn->close();
