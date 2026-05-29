-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 29-05-2026 a las 15:56:15
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `bookly`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `conversacion`
--

CREATE TABLE `conversacion` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `tipo` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `libros`
--

CREATE TABLE `libros` (
  `id` int(11) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `autor` varchar(255) DEFAULT NULL,
  `genero` varchar(100) NOT NULL,
  `portada` varchar(255) DEFAULT NULL,
  `num_paginas` int(11) DEFAULT NULL,
  `descripcion` longtext DEFAULT NULL,
  `autor_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `libros`
--

INSERT INTO `libros` (`id`, `titulo`, `autor`, `genero`, `portada`, `num_paginas`, `descripcion`, `autor_id`) VALUES
(1, 'El Hobbit', 'J.R.R. Tolkien', 'Fantasía', 'hobbit.jpg', 310, 'La aventura épica de Bilbo Bolsón hacia la Montaña Solitaria.', NULL),
(2, 'Sapiens', 'Yuval Noah Harari', 'Ensayo', 'sapiens.jpg', 496, 'Un recorrido por la historia de la humanidad desde los primeros humanos.', NULL),
(3, 'La sombra del viento', 'Carlos Ruiz Zafón', 'Misterio', 'sombra_viento.jpg', 569, 'Un joven descubre un libro maldito en el Cementerio de los Libros Olvidados.', NULL),
(4, 'Reina Roja', 'Juan Gómez-Jurado', 'Thriller', 'reina_roja.jpg', 568, 'Antonia Scott es la persona más inteligente del mundo y resuelve crímenes imposibles.', NULL),
(5, 'El cuento de la criada', 'Margaret Atwood', 'Distopía', 'handmaid.jpg', 333, 'Una sociedad teocrática donde las mujeres son propiedad del estado.', NULL),
(6, 'Ready Player One', 'Ernest Cline', 'Ciencia Ficción', 'ready_player.jpg', 374, 'Una búsqueda del tesoro dentro de un mundo de realidad virtual llamado OASIS.', NULL),
(7, 'Circe', 'Madeline Miller', 'Mitología', 'circe.jpg', 393, 'La vida de la hechicera de la Odisea desde una perspectiva feminista.', NULL),
(8, 'Hábitos Atómicos', 'James Clear', 'Autoayuda', 'habitos.jpg', 320, 'Guía práctica para crear buenos hábitos y romper los malos.', NULL),
(9, 'El paciente', 'Juan Gómez-Jurado', 'Thriller', 'paciente.jpg', 480, 'Un neurocirujano se enfrenta a un dilema imposible para salvar a su hija.', NULL),
(10, 'Cien años de soledad', 'Gabriel García Márquez', 'Realismo Mágico', '100_años.jpg', 471, 'La saga de la familia Buendía en el pueblo de Macondo.', NULL),
(11, 'Proyecto Hail Mary', 'Andy Weir', 'Ciencia Ficción', 'hail_mary.jpg', 476, 'Un hombre despierta solo en una nave espacial sin recordar su misión.', NULL),
(12, 'Alas de Sangre', 'Rebecca Yarros', 'Romantasy', 'fourth_wing.jpg', 736, 'Dragones, romance y una academia militar donde sobrevivir es la única opción.', NULL),
(13, 'La biblioteca de la medianoche', 'Matt Haig', 'Fantasía', 'midnight_library.jpg', 304, 'Entre la vida y la muerte hay una biblioteca con todas las vidas que pudiste vivir.', NULL),
(14, 'Normal People', 'Sally Rooney', 'Ficción Contemporánea', 'normal_people.jpg', 273, 'La compleja relación entre dos jóvenes a lo largo de los años.', NULL),
(15, 'El imperio final', 'Brandon Sanderson', 'Fantasía', 'mistborn.jpg', 541, 'Un mundo donde cae ceniza del cielo y un grupo de ladrones planea un golpe contra un dios.', NULL),
(16, 'El psicoanalista', 'John Katzenbach', 'Thriller', 'psicoanalista.jpg', 450, 'Un médico recibe una nota que dice: Feliz cumpleaños, doctor. Bienvenido al primer día de su muerte.', NULL),
(17, 'Crónica de una muerte anunciada', 'Gabriel García Márquez', 'Drama', 'cronica.jpg', 150, 'La reconstrucción de un asesinato que todo el pueblo sabía que iba a ocurrir.', NULL),
(18, 'La chica del tren', 'Paula Hawkins', 'Suspense', 'chica_tren.jpg', 312, 'Una mujer observa algo extraño desde la ventana del tren que cambia su vida.', NULL),
(19, 'Dune', 'Frank Herbert', 'Ciencia Ficción', 'dune.jpg', 688, 'La lucha por el control del planeta desierto Arrakis y su valiosa especia.', NULL),
(20, 'La canción de Aquiles', 'Madeline Miller', 'Mitología', 'aquiles.jpg', 352, 'El romance entre Patroclo y Aquiles durante la guerra de Troya.', NULL),
(21, 'El mapa de los anhelos', 'Alice Kellen', 'Romance', 'mapa_anhelos.jpg', 448, 'Un juego para encontrar el camino después de una pérdida dolorosa.', NULL),
(22, 'Invisible', 'Eloy Moreno', 'Juvenil', 'invisible.jpg', 304, 'Una historia sobre el acoso escolar desde una perspectiva emotiva y única.', NULL),
(23, 'Todo arde', 'Juan Gómez-Jurado', 'Acción', 'todo_arde.jpg', 544, 'Tres mujeres que lo han perdido todo planean una venganza imposible.', NULL),
(24, 'El código Enigma', 'Andrew Hodges', 'Biografía', 'turing.jpg', 736, 'La vida de Alan Turing, el genio que descifró los códigos nazis.', NULL),
(25, '1984', 'George Orwell', 'Distopía', '1984.jpg', 328, 'Un futuro vigilado por el Gran Hermano donde el pensamiento es un crimen.', NULL),
(26, 'El resplandor', 'Stephen King', 'Terror', 'shining.jpg', 447, 'Un hotel aislado, un niño con poderes y un padre que desciende a la locura.', NULL),
(27, 'Lanza de Dios', 'Juan Gómez-Jurado', 'Aventura', 'espia_dios.jpg', 400, 'Un thriller ambientado en el Vaticano durante un cónclave papal.', NULL),
(28, 'Fahrenheit 451', 'Ray Bradbury', 'Distopía', 'f451.jpg', 176, 'Un mundo donde los bomberos queman libros en lugar de apagar fuegos.', NULL),
(29, 'Los pilares de la Tierra', 'Ken Follett', 'Histórica', 'pilares.jpg', 1032, 'La construcción de una catedral gótica en la Inglaterra medieval.', NULL),
(30, 'Ensayo sobre la ceguera', 'José Saramago', 'Ficción', 'ceguera.jpg', 352, 'Una epidemia de ceguera blanca pone a prueba la moralidad humana.', NULL),
(31, 'El nombre de la rosa', 'Umberto Eco', 'Misterio Histórico', 'rosa.jpg', 512, 'Crímenes misteriosos en una abadía benedictina en el siglo XIV.', NULL),
(32, 'Un mundo feliz', 'Aldous Huxley', 'Distopía', 'brave_new_world.jpg', 256, 'Una sociedad perfecta controlada por la ingeniería genética y el placer.', NULL),
(33, 'Tokio Blues', 'Haruki Murakami', 'Drama', 'tokio_blues.jpg', 384, 'Nostalgia y amor juvenil en el Japón de los años sesenta.', NULL),
(34, 'It', 'Stephen King', 'Terror', 'it.jpg', 1138, 'Siete niños se enfrentan a una entidad malvada que habita en las cloacas.', NULL),
(35, 'El alquimista', 'Paulo Coelho', 'Fábula', 'alquimista.jpg', 192, 'El viaje de un pastor en busca de su tesoro personal.', NULL),
(36, 'La tregua', 'Mario Benedetti', 'Romance', 'tregua.jpg', 202, 'El diario de un hombre que encuentra el amor poco antes de jubilarse.', NULL),
(37, 'Rayuela', 'Julio Cortázar', 'Experimental', 'rayuela.jpg', 600, 'Una historia de amor en París que puede leerse de múltiples formas.', NULL),
(38, 'El olvido que seremos', 'Héctor Abad Faciolince', 'Memorias', 'olvido.jpg', 272, 'Un emotivo relato sobre la vida y asesinato del padre del autor.', NULL),
(39, 'Patria', 'Fernando Aramburu', 'Drama', 'patria.jpg', 646, 'El impacto del terrorismo en dos familias vascas a lo largo de décadas.', NULL),
(40, 'La verdad sobre el caso Harry Quebert', 'Joël Dicker', 'Thriller', 'quebert.jpg', 672, 'Un escritor investiga un asesinato ocurrido hace décadas para salvar a su mentor.', NULL),
(41, 'El marciano', 'Andy Weir', 'Ciencia Ficción', 'martian.jpg', 369, 'Un astronauta debe sobrevivir solo en Marte usando su ingenio.', NULL),
(42, 'La insoportable levedad del ser', 'Milan Kundera', 'Filosofía', 'levedad.jpg', 312, 'Una reflexión sobre el amor y la existencia durante la Primavera de Praga.', NULL),
(43, 'Persépolis', 'Marjane Satrapi', 'Novela Gráfica', 'persepolis.jpg', 352, 'La infancia de una niña en Irán durante la revolución islámica.', NULL),
(44, 'Kafka en la orilla', 'Haruki Murakami', 'Surrealismo', 'kafka.jpg', 505, 'Dos historias entrelazadas con gatos que hablan y tormentas de peces.', NULL),
(45, 'El amor en los tiempos del cólera', 'Gabriel García Márquez', 'Romance', 'amor_colera.jpg', 368, 'La eterna espera de Florentino Ariza por el amor de Fermina Daza.', NULL),
(46, 'Crónica del pájaro que da cuerda al mundo', 'Haruki Murakami', 'Realismo Mágico', 'pajaro.jpg', 607, 'Un hombre busca a su gato y a su esposa en un mundo onírico.', NULL),
(47, 'La carretera', 'Cormac McCarthy', 'Postapocalíptico', 'road.jpg', 212, 'Un padre y un hijo caminan por un mundo devastado por el frío y el hambre.', NULL),
(48, 'Paula', 'Isabel Allende', 'Memorias', 'paula.jpg', 352, 'La carta de una madre a su hija en coma, recorriendo la historia familiar.', NULL),
(49, 'El dragón rojo', 'Thomas Harris', 'Thriller', 'red_dragon.jpg', 480, 'La primera aparición del Dr. Hannibal Lecter ayudando a capturar a un asesino.', NULL),
(50, 'American Gods', 'Neil Gaiman', 'Fantasía', 'american_gods.jpg', 560, 'Una guerra entre los viejos dioses mitológicos y los nuevos dioses tecnológicos.', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mensajes`
--

CREATE TABLE `mensajes` (
  `id` int(11) NOT NULL,
  `descripcion` longtext NOT NULL,
  `fecha_envio` datetime NOT NULL DEFAULT current_timestamp(),
  `editado` varchar(255) NOT NULL,
  `eliminado` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mis_bibliotecas`
--

CREATE TABLE `mis_bibliotecas` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mis_libros`
--

CREATE TABLE `mis_libros` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL DEFAULT 0,
  `id_libro` int(11) NOT NULL,
  `estado` enum('leido','no_leido','leyendo') NOT NULL,
  `favorito` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `mis_libros`
--

INSERT INTO `mis_libros` (`id`, `id_usuario`, `id_libro`, `estado`, `favorito`) VALUES
(1, 1, 19, 'no_leido', 0),
(2, 1, 40, 'no_leido', 0),
(3, 1, 27, 'no_leido', 0),
(4, 1, 45, 'no_leido', 0),
(5, 1, 3, 'no_leido', 0),
(6, 1, 36, 'no_leido', 0),
(7, 1, 26, 'no_leido', 0),
(8, 1, 31, 'no_leido', 0),
(10, 3, 13, 'no_leido', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `participantes`
--

CREATE TABLE `participantes` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_conversacion` int(11) NOT NULL,
  `fecha_ingreso` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reseñas`
--

CREATE TABLE `reseñas` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_libro` int(11) NOT NULL,
  `puntuacion` varchar(255) NOT NULL,
  `comentario` longtext NOT NULL,
  `created_at` date NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `role` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id`, `role`, `created_at`, `updated_at`) VALUES
(1, 'usuario', '2026-05-29 07:59:24', '2026-05-29 07:59:24'),
(2, 'admin', '2026-05-29 07:59:24', '2026-05-29 07:59:24');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `usuario` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `id_roles` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `usuario`, `password`, `id_roles`, `created_at`, `updated_at`) VALUES
(1, 'aaleejaa', '$2y$10$39HupzFuRUoKpQG5.bFIo..u4xNyDG9JC1ygnh1V1lCJ1r3W0PFo.', 1, '2026-05-29 08:06:00', '2026-05-29 08:06:00'),
(2, 'si', '$2y$10$TWm3fnlpXLTJpUse60QgHuBRNBfFG7IYz.1N2Ia6gXo5apsf3cahK', 1, '2026-05-29 14:18:01', '2026-05-29 14:18:01'),
(3, 'aaa', '$2y$10$4Xt9rDWVgwofXd.55jGizeeImz9bXn/4ew9V.gKLorFqbPzzoOX52', 1, '2026-05-29 14:57:46', '2026-05-29 14:57:46');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `apellidos` varchar(255) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `email` varchar(255) NOT NULL,
  `avatar` varchar(255) NOT NULL,
  `updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `apellidos`, `fecha_nacimiento`, `email`, `avatar`, `updated_at`, `created_at`) VALUES
(1, 'Alejandra', 'Chaves Durán', '2003-09-18', 'chavesduranalejandra@gmail.com', 'default_avatar.png', '2026-05-29 08:06:00', '2026-05-29 08:06:00'),
(2, 'si', 'si', '1999-12-15', 'aibfiu@gmail.com', 'default_avatar.png', '2026-05-29 14:18:01', '2026-05-29 14:18:01'),
(3, 'aa', 'aa', '2003-09-18', 'anoff@gmail.com', 'default_avatar.png', '2026-05-29 14:57:46', '2026-05-29 14:57:46');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `conversacion`
--
ALTER TABLE `conversacion`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `libros`
--
ALTER TABLE `libros`
  ADD PRIMARY KEY (`id`),
  ADD KEY `autor_id` (`autor_id`);

--
-- Indices de la tabla `mensajes`
--
ALTER TABLE `mensajes`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `mis_bibliotecas`
--
ALTER TABLE `mis_bibliotecas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `mis_libros`
--
ALTER TABLE `mis_libros`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_usuario_libro` (`id_usuario`,`id_libro`);

--
-- Indices de la tabla `participantes`
--
ALTER TABLE `participantes`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `reseñas`
--
ALTER TABLE `reseñas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `conversacion`
--
ALTER TABLE `conversacion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `libros`
--
ALTER TABLE `libros`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT de la tabla `mensajes`
--
ALTER TABLE `mensajes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `mis_bibliotecas`
--
ALTER TABLE `mis_bibliotecas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `mis_libros`
--
ALTER TABLE `mis_libros`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `participantes`
--
ALTER TABLE `participantes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `reseñas`
--
ALTER TABLE `reseñas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
