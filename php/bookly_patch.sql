-- ============================================================
-- bookly_patch.sql
-- Ejecutar DESPUÉS de importar bookly.sql
-- Añade columnas y ajustes necesarios para el proyecto completo
-- ============================================================

-- Añadir id_usuario a mis_libros (la tabla original no lo tenía)
ALTER TABLE `mis_libros`
    ADD COLUMN `id_usuario` int(11) NOT NULL DEFAULT 0 AFTER `id`,
    ADD COLUMN `favorito`   tinyint(1) NOT NULL DEFAULT 0,
    ADD UNIQUE KEY `uq_usuario_libro` (`id_usuario`, `id_libro`);

-- Relacionar mis_libros con usuarios
ALTER TABLE `mis_libros`
    ADD CONSTRAINT `fk_ml_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
    ADD CONSTRAINT `fk_ml_libro`   FOREIGN KEY (`id_libro`)   REFERENCES `libros`   (`id`) ON DELETE CASCADE;

-- Relacionar users con roles
ALTER TABLE `users`
    ADD CONSTRAINT `fk_users_roles` FOREIGN KEY (`id_roles`) REFERENCES `roles` (`id`);

-- Insertar rol por defecto
INSERT IGNORE INTO `roles` (`id`, `role`) VALUES (1, 'usuario'), (2, 'admin');
