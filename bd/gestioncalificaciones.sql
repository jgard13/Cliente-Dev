-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 27-11-2025
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;


CREATE TABLE `calificacionalumnos` (
  `Usuario` int(11) NOT NULL,
  `Materia` int(11) NOT NULL,
  `Cal_PrimerParcial` int(11) NOT NULL,
  `Cal_SegundoParcial` int(11) NOT NULL,
  `Cal_TercerParcial` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `materias` (
  `id_materia` int(11) NOT NULL,
  `NombreMateria` text NOT NULL,
  `TipoPonderacion` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


INSERT INTO `materias` (`id_materia`, `NombreMateria`, `TipoPonderacion`) VALUES
(1, 'EMPRENDIMIENTO I', 'C'),
(2, 'INGLÉS VII', 'B'),
(3, 'PROGRAMACIÓN MÓVIL II', 'C'),
(4, 'PROGRAMACIÓN AVANZADA I', 'C'),
(5, 'PROGRAMACIÓN WEB I', 'C'),
(6, 'PROYECTO INTEGRADOR DE DESARROLLO DE SOFTWARE I', 'D'),
(7, 'SERVICIOS DE RED Y CÓMPUTO NUBE', 'A'),
(8, 'SISTEMAS EMBEBIDOS II', 'A'),
(9, 'SISTEMAS DE MEDICIÓN Y CONTROL', 'C');



CREATE TABLE `users` (
  `id_user` int(11) NOT NULL,
  `username` text NOT NULL,
  `password` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


ALTER TABLE `calificacionalumnos`
  ADD KEY `Usuario` (`Usuario`),
  ADD KEY `Materia` (`Materia`);


ALTER TABLE `materias`
  ADD PRIMARY KEY (`id_materia`);


ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`);



ALTER TABLE `materias`
  MODIFY `id_materia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;


ALTER TABLE `users`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT;


ALTER TABLE `calificacionalumnos`
  ADD CONSTRAINT `calificacionalumnos_ibfk_1` FOREIGN KEY (`Usuario`) REFERENCES `users` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `calificacionalumnos_ibfk_2` FOREIGN KEY (`Materia`) REFERENCES `materias` (`id_materia`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;
