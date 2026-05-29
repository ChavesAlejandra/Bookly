<?php
require_once __DIR__ . '/conexion.php';

function iniciarSesion(): void {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
}

function estaAutenticado(): bool {
    iniciarSesion();
    return isset($_SESSION['usuario_id']);
}

function requiereAuth(): void {
    if (!estaAutenticado()) {
        header('Location: ../html/home.php');
        exit;
    }
}

function getUsuarioId(): ?int {
    iniciarSesion();
    return $_SESSION['usuario_id'] ?? null;
}

function getUsuarioNombre(): ?string {
    iniciarSesion();
    return $_SESSION['usuario_nombre'] ?? null;
}
