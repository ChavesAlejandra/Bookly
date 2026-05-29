<?php
require_once __DIR__ . '/conexion.php';
require_once __DIR__ . '/sesion.php';

iniciarSesion();
header('Content-Type: application/json');

if (!estaAutenticado()) {
    http_response_code(401);
    echo json_encode(['ok' => false, 'mensaje' => 'No autenticado.']);
    exit;
}

$accion    = $_POST['accion'] ?? $_GET['accion'] ?? '';
$usuarioId = getUsuarioId();
$pdo       = getConexion();

switch ($accion) {

    // ── MIS LIBROS ────────────────────────────────────────────────────────────
    case 'mis_libros':
        $limite = (int)($_GET['limite'] ?? 4);
        try {
            $stmt = $pdo->prepare(
                'SELECT l.id, l.titulo, l.autor, l.genero, l.portada, l.descripcion, ml.estado
                   FROM mis_libros ml
                   JOIN libros l ON l.id = ml.id_libro
                  WHERE ml.id_usuario = ?
                  ORDER BY ml.id DESC
                  LIMIT ?'
            );
            $stmt->execute([$usuarioId, $limite]);
            echo json_encode(['ok' => true, 'libros' => $stmt->fetchAll()]);
        } catch (Exception $e) {
            echo json_encode(['ok' => true, 'libros' => []]);
        }
        break;

    // ── FAVORITOS ─────────────────────────────────────────────────────────────
    case 'favoritos':
        $limite = (int)($_GET['limite'] ?? 4);
        try {
            $stmt = $pdo->prepare(
                'SELECT l.id, l.titulo, l.autor, l.genero, l.portada, l.descripcion
                   FROM mis_libros ml
                   JOIN libros l ON l.id = ml.id_libro
                  WHERE ml.id_usuario = ? AND ml.favorito = 1
                  ORDER BY ml.id DESC
                  LIMIT ?'
            );
            $stmt->execute([$usuarioId, $limite]);
            echo json_encode(['ok' => true, 'libros' => $stmt->fetchAll()]);
        } catch (Exception $e) {
            echo json_encode(['ok' => true, 'libros' => []]);
        }
        break;

    // ── RECOMENDACIONES ───────────────────────────────────────────────────────
    case 'recomendaciones':
        try {
            $stmt = $pdo->prepare(
                'SELECT l.id, l.titulo, l.autor, l.genero, l.portada, l.descripcion
                   FROM libros l
                  WHERE l.id NOT IN (
                        SELECT ml.id_libro FROM mis_libros ml WHERE ml.id_usuario = ?
                  )
                  ORDER BY RAND()
                  LIMIT 10'
            );
            $stmt->execute([$usuarioId]);
            echo json_encode(['ok' => true, 'libros' => $stmt->fetchAll()]);
        } catch (Exception $e) {
            $stmt2 = $pdo->query('SELECT id, titulo, autor, genero, portada, descripcion FROM libros ORDER BY RAND() LIMIT 10');
            echo json_encode(['ok' => true, 'libros' => $stmt2->fetchAll()]);
        }
        break;

    // ── GUARDAR LIKE/DISLIKE RECOMENDACIÓN ────────────────────────────────────
    case 'votar_recomendacion':
        $libroId = (int)($_POST['libro_id'] ?? 0);
        $voto    = $_POST['voto'] ?? '';

        if (!in_array($voto, ['like', 'dislike'])) {
            echo json_encode(['ok' => false, 'mensaje' => 'Voto inválido.']);
            exit;
        }

        if ($voto === 'like') {
            try {
                $stmt = $pdo->prepare(
                    'INSERT IGNORE INTO mis_libros (id_libro, id_usuario, estado)
                     VALUES (?, ?, "no_leido")'
                );
                $stmt->execute([$libroId, $usuarioId]);
            } catch (Exception $e) { /* ignorar */ }
        }

        echo json_encode(['ok' => true]);
        break;

    // ── TOGGLE FAVORITO ───────────────────────────────────────────────────────
    case 'toggle_favorito':
        $libroId = (int)($_POST['libro_id'] ?? 0);
        try {
            $stmt = $pdo->prepare(
                'UPDATE mis_libros SET favorito = NOT favorito
                  WHERE id_libro = ? AND id_usuario = ?'
            );
            $stmt->execute([$libroId, $usuarioId]);
            echo json_encode(['ok' => true]);
        } catch (Exception $e) {
            echo json_encode(['ok' => false, 'mensaje' => $e->getMessage()]);
        }
        break;

    // ── ELIMINAR LIBRO ────────────────────────────────────────────────────────
    case 'eliminar_libro':
        $libroId = (int)($_POST['libro_id'] ?? 0);
        try {
            $stmt = $pdo->prepare(
                'DELETE FROM mis_libros WHERE id_libro = ? AND id_usuario = ?'
            );
            $stmt->execute([$libroId, $usuarioId]);
            echo json_encode(['ok' => true]);
        } catch (Exception $e) {
            echo json_encode(['ok' => false, 'mensaje' => $e->getMessage()]);
        }
        break;


    // ── DETALLE LIBRO ─────────────────────────────────────────────────────────────
    case 'detalle_libro':
        $libroId = (int)($_GET['libro_id'] ?? $_POST['libro_id'] ?? 0);
        try {
            $stmt = $pdo->prepare(
                'SELECT l.id, l.titulo, l.autor, l.genero, l.descripcion,
                        ml.estado, ml.favorito
                   FROM libros l
                   LEFT JOIN mis_libros ml ON ml.id_libro = l.id AND ml.id_usuario = ?
                  WHERE l.id = ?
                  LIMIT 1'
            );
            $stmt->execute([$usuarioId, $libroId]);
            $libro = $stmt->fetch();
            if (!$libro) {
                echo json_encode(['ok' => false, 'mensaje' => 'Libro no encontrado.']);
            } else {
                echo json_encode(['ok' => true, 'libro' => $libro]);
            }
        } catch (Exception $e) {
            echo json_encode(['ok' => false, 'mensaje' => $e->getMessage()]);
        }
        break;

    // ── GUARDAR / ACTUALIZAR ESTADO ───────────────────────────────────────────────
    case 'guardar_libro':
        $libroId = (int)($_POST['libro_id'] ?? 0);
        $estado  = $_POST['estado'] ?? 'no_leido';

        if (!in_array($estado, ['leido', 'no_leido', 'leyendo'])) {
            echo json_encode(['ok' => false, 'mensaje' => 'Estado inválido.']);
            exit;
        }
        try {
            $stmt = $pdo->prepare(
                'INSERT INTO mis_libros (id_libro, id_usuario, estado)
                 VALUES (?, ?, ?)
                 ON DUPLICATE KEY UPDATE estado = VALUES(estado)'
            );
            $stmt->execute([$libroId, $usuarioId, $estado]);
            echo json_encode(['ok' => true]);
        } catch (Exception $e) {
            echo json_encode(['ok' => false, 'mensaje' => $e->getMessage()]);
        }
        break;

    default:
        http_response_code(400);
        echo json_encode(['ok' => false, 'mensaje' => 'Acción desconocida.']);
}
