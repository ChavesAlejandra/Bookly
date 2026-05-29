<?php
require_once __DIR__ . '/conexion.php';
require_once __DIR__ . '/sesion.php';

iniciarSesion();
header('Content-Type: application/json');

$accion = $_POST['accion'] ?? '';

switch ($accion) {

    // ── LOGIN ────────────────────────────────────────────────────────────────
    case 'login':
        $email    = trim($_POST['email']    ?? '');
        $password = trim($_POST['password'] ?? '');

        if (!$email || !$password) {
            echo json_encode(['ok' => false, 'mensaje' => 'Rellena todos los campos.']);
            exit;
        }

        $pdo  = getConexion();
        $stmt = $pdo->prepare(
            'SELECT u.id, u.nombre, us.password
               FROM usuarios u
               JOIN users us ON us.id = u.id
              WHERE u.email = ?
              LIMIT 1'
        );
        $stmt->execute([$email]);
        $usuario = $stmt->fetch();

        if (!$usuario || !password_verify($password, $usuario['password'])) {
            echo json_encode(['ok' => false, 'mensaje' => 'Email o contraseña incorrectos.']);
            exit;
        }

        $_SESSION['usuario_id']     = $usuario['id'];
        $_SESSION['usuario_nombre'] = $usuario['nombre'];

        echo json_encode(['ok' => true, 'nombre' => $usuario['nombre']]);
        break;

    // ── REGISTRO ─────────────────────────────────────────────────────────────
    case 'registro':
        $nombre    = trim($_POST['nombre']    ?? '');
        $apellidos = trim($_POST['apellidos'] ?? '');
        $usuario   = trim($_POST['usuario']   ?? '');
        $fecha     = trim($_POST['fecha']     ?? '');
        $email     = trim($_POST['email']     ?? '');
        $password  = trim($_POST['password']  ?? '');
        $confirmar = trim($_POST['confirmar'] ?? '');

        if (!$nombre || !$apellidos || !$usuario || !$fecha || !$email || !$password) {
            echo json_encode(['ok' => false, 'mensaje' => 'Rellena todos los campos.']);
            exit;
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            echo json_encode(['ok' => false, 'mensaje' => 'Email no válido.']);
            exit;
        }
        if ($password !== $confirmar) {
            echo json_encode(['ok' => false, 'mensaje' => 'Las contraseñas no coinciden.']);
            exit;
        }
        if (strlen($password) < 6) {
            echo json_encode(['ok' => false, 'mensaje' => 'La contraseña debe tener al menos 6 caracteres.']);
            exit;
        }

        $pdo   = getConexion();
        $check = $pdo->prepare('SELECT id FROM usuarios WHERE email = ? LIMIT 1');
        $check->execute([$email]);
        if ($check->fetch()) {
            echo json_encode(['ok' => false, 'mensaje' => 'Ese email ya está registrado.']);
            exit;
        }

        $pdo->beginTransaction();
        try {
            $ins1 = $pdo->prepare(
                'INSERT INTO usuarios (nombre, apellidos, fecha_nacimiento, email, avatar)
                 VALUES (?, ?, ?, ?, ?)'
            );
            $ins1->execute([$nombre, $apellidos, $fecha, $email, 'default_avatar.png']);
            $nuevoId = (int) $pdo->lastInsertId();

            $hash = password_hash($password, PASSWORD_DEFAULT);
            $ins2 = $pdo->prepare(
                'INSERT INTO users (id, usuario, password, id_roles) VALUES (?, ?, ?, 1)'
            );
            $ins2->execute([$nuevoId, $usuario, $hash]);

            $pdo->commit();

            $_SESSION['usuario_id']     = $nuevoId;
            $_SESSION['usuario_nombre'] = $nombre;

            echo json_encode(['ok' => true, 'nombre' => $nombre]);
        } catch (Exception $e) {
            $pdo->rollBack();
            echo json_encode(['ok' => false, 'mensaje' => 'Error al registrar: ' . $e->getMessage()]);
        }
        break;

    // ── LOGOUT ───────────────────────────────────────────────────────────────
    case 'logout':
        session_destroy();
        echo json_encode(['ok' => true]);
        break;

    default:
        http_response_code(400);
        echo json_encode(['ok' => false, 'mensaje' => 'Acción desconocida.']);
}
