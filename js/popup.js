'use strict';

/**
 * popup.js — Gestión del popup de libro
 * Se usa en principal.php y library.php
 * Requiere que portadas.js esté cargado antes
 */

let _popupLibroActual = null; // { id, titulo, autor, genero, descripcion, estado, favorito }

// ── Abrir popup ────────────────────────────────────────────────────────────────
async function abrirPopupLibro(datos) {
    _popupLibroActual = { ...datos };

    // Rellenar datos
    document.getElementById('popupTitulo').textContent      = datos.titulo      ?? '';
    document.getElementById('popupAutor').textContent       = datos.autor       ?? '';
    document.getElementById('popupGenero').textContent      = datos.genero      ?? '';
    document.getElementById('popupDescripcion').textContent = datos.descripcion ?? '';

    // Portada via Open Library
    const imgEl = document.getElementById('popupPortada');
    imgEl.src = '';
    aplicarPortada(imgEl, datos.titulo, datos.autor ?? '');

    // Estado activo
    actualizarBotonesEstado(datos.estado ?? '');

    // Favorito
    actualizarBotonFavorito(datos.favorito == 1 || datos.favorito === true);

    // Mostrar popup
    document.getElementById('libroPopUp').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ── Cerrar popup ───────────────────────────────────────────────────────────────
function cerrarPopupLibro() {
    document.getElementById('libroPopUp').classList.remove('active');
    document.body.style.overflow = '';
    _popupLibroActual = null;
}

// ── Actualizar UI estado ───────────────────────────────────────────────────────
function actualizarBotonesEstado(estado) {
    document.querySelectorAll('.libroPopUp__content__acciones__estados button').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.estado === estado);
    });
}

function actualizarBotonFavorito(esFavorito) {
    const btn = document.getElementById('btnFavorito');
    if (!btn) return;
    btn.classList.toggle('active', esFavorito);
    btn.innerHTML = esFavorito
        ? '<span class="icon">❤️</span> En favoritos'
        : '<span class="icon">🤍</span> Añadir a favoritos';
}

// ── Cambiar estado ─────────────────────────────────────────────────────────────
async function cambiarEstadoLibro(estado) {
    if (!_popupLibroActual) return;

    const fd = new FormData();
    fd.append('accion',   'guardar_libro');
    fd.append('libro_id', _popupLibroActual.id);
    fd.append('estado',   estado);

    try {
        const res  = await fetch('../php/libros.php', { method: 'POST', body: fd });
        const data = await res.json();
        if (!data.ok) throw new Error(data.mensaje);

        _popupLibroActual.estado = estado;
        actualizarBotonesEstado(estado);
        mostrarToast('✔ Estado actualizado');

        // Refrescar grids si existen en la página
        if (typeof cargarMisLibros  === 'function') cargarMisLibros();
        if (typeof recargarLibros   === 'function') recargarLibros();
    } catch (e) {
        mostrarToast(e.message || 'Error al actualizar estado', true);
    }
}

// ── Toggle favorito ────────────────────────────────────────────────────────────
async function toggleFavorito() {
    if (!_popupLibroActual) return;

    const fd = new FormData();
    fd.append('accion',   'toggle_favorito');
    fd.append('libro_id', _popupLibroActual.id);

    try {
        const res  = await fetch('../php/libros.php', { method: 'POST', body: fd });
        const data = await res.json();
        if (!data.ok) throw new Error(data.mensaje);

        _popupLibroActual.favorito = !_popupLibroActual.favorito;
        actualizarBotonFavorito(_popupLibroActual.favorito);
        mostrarToast(_popupLibroActual.favorito ? '❤️ Añadido a favoritos' : '🤍 Eliminado de favoritos');

        if (typeof cargarFavoritos === 'function') cargarFavoritos('favoritosGrid');
        if (typeof recargarLibros  === 'function') recargarLibros();
    } catch (e) {
        mostrarToast(e.message || 'Error al actualizar favorito', true);
    }
}

// ── Eliminar libro ─────────────────────────────────────────────────────────────
async function eliminarLibro() {
    if (!_popupLibroActual) return;
    if (!confirm(`¿Eliminar "${_popupLibroActual.titulo}" de tu biblioteca?`)) return;

    const fd = new FormData();
    fd.append('accion',   'eliminar_libro');
    fd.append('libro_id', _popupLibroActual.id);

    try {
        const res  = await fetch('../php/libros.php', { method: 'POST', body: fd });
        const data = await res.json();
        if (!data.ok) throw new Error(data.mensaje);

        mostrarToast('🗑️ Libro eliminado de tu biblioteca');
        cerrarPopupLibro();

        if (typeof cargarMisLibros === 'function') cargarMisLibros();
        if (typeof cargarFavoritos === 'function') cargarFavoritos('favoritosGrid');
        if (typeof recargarLibros  === 'function') recargarLibros();
    } catch (e) {
        mostrarToast(e.message || 'Error al eliminar', true);
    }
}

// ── Event listeners del popup ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    // Cerrar
    document.getElementById('cerrarPopupLibro')
        ?.addEventListener('click', cerrarPopupLibro);

    document.getElementById('libroPopUp')
        ?.addEventListener('click', e => {
            if (e.target === document.getElementById('libroPopUp')) cerrarPopupLibro();
        });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') cerrarPopupLibro();
    });

    // Botones estado
    document.querySelectorAll('.libroPopUp__content__acciones__estados button').forEach(btn => {
        btn.addEventListener('click', () => cambiarEstadoLibro(btn.dataset.estado));
    });

    // Favorito
    document.getElementById('btnFavorito')
        ?.addEventListener('click', toggleFavorito);

    // Eliminar
    document.getElementById('btnEliminar')
        ?.addEventListener('click', eliminarLibro);
});
