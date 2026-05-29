'use strict';

// ── Toast ──────────────────────────────────────────────────────────────────────
function mostrarToast(msg, esError = false) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.className   = 'toast show' + (esError ? ' error' : '');
    setTimeout(() => { t.className = 'toast'; }, 3000);
}

// ── Construir tarjeta ──────────────────────────────────────────────────────────
function buildCardHTML(libro) {
    return `
    <div class="libros"
         data-id="${libro.id}"
         data-titulo="${libro.titulo}"
         data-autor="${libro.autor ?? ''}"
         data-descripcion="${(libro.descripcion ?? '').replace(/"/g, '&quot;')}"
         data-genero="${libro.genero ?? ''}"
         data-estado="${libro.estado ?? ''}"
         data-favorito="${libro.favorito ?? 0}">
        <div class="libros__flipCard">
            <div class="libros__flipCard__inner">
                <div class="libros__flipCard__inner__front">
                    <div class="libros__flipCard__inner__front__imagen">
                        <img class="portada-lazy" alt="${libro.titulo}">
                    </div>
                    <div class="libros__flipCard__inner__front__title">
                        <h3>${libro.titulo}</h3>
                    </div>
                    <div class="libros__flipCard__inner__front__autor">
                        <p>${libro.autor ?? ''}</p>
                    </div>
                </div>
                <div class="libros__flipCard__inner__back">
                    <div class="libros__flipCard__inner__back__title">
                        <h3>Descripción</h3>
                    </div>
                    <div class="libros__flipCard__inner__back__texto">
                        <p>${libro.descripcion ?? 'Sin descripción disponible.'}</p>
                    </div>
                    <div class="libros__flipCard__inner__back__abrir">
                        <button class="btn-abrir-popup">Ver detalles</button>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}

// ── Cargar portadas ────────────────────────────────────────────────────────────
function cargarPortadasEnGrid(gridEl) {
    gridEl.querySelectorAll('[data-titulo]').forEach(card => {
        const img = card.querySelector('img.portada-lazy');
        if (!img) return;
        aplicarPortada(img, card.dataset.titulo, card.dataset.autor);
    });
}

// ── Cargar sección por estado ──────────────────────────────────────────────────
let _todosLosLibros = null;

async function getTodosLosLibros() {
    if (_todosLosLibros) return _todosLosLibros;
    const res  = await fetch('../php/libros.php?accion=mis_libros&limite=100');
    const data = await res.json();
    if (!data.ok) throw new Error(data.mensaje);
    _todosLosLibros = data.libros;
    return _todosLosLibros;
}

async function cargarSeccion(estado, gridId, verMasId, limiteInicial = 5) {
    const grid   = document.getElementById(gridId);
    const verMas = document.getElementById(verMasId);
    grid.innerHTML = '<p class="grid-msg">Cargando...</p>';

    try {
        const todos  = await getTodosLosLibros();
        const libros = todos.filter(l => l.estado === estado);

        if (libros.length === 0) {
            grid.innerHTML = '<p class="grid-msg">No hay libros en esta sección.</p>';
            if (verMas) verMas.style.display = 'none';
            return;
        }

        let mostrados = limiteInicial;
        const renderizar = () => {
            grid.innerHTML = libros.slice(0, mostrados).map(buildCardHTML).join('');
            cargarPortadasEnGrid(grid);
        };

        renderizar();

        if (verMas) {
            if (libros.length > limiteInicial) {
                verMas.style.display = 'block';
                verMas.onclick = () => {
                    mostrados += 5;
                    renderizar();
                    if (mostrados >= libros.length) verMas.style.display = 'none';
                };
            } else {
                verMas.style.display = 'none';
            }
        }
    } catch {
        grid.innerHTML = '<p class="grid-msg error">Error al cargar los libros.</p>';
    }
}

// ── Favoritos ──────────────────────────────────────────────────────────────────
async function cargarFavoritos(gridId) {
    const grid = document.getElementById(gridId);
    grid.innerHTML = '<p class="grid-msg">Cargando...</p>';

    try {
        const res  = await fetch('../php/libros.php?accion=favoritos&limite=100');
        const data = await res.json();
        if (!data.ok) throw new Error();

        if (data.libros.length === 0) {
            grid.innerHTML = '<p class="grid-msg">No tienes favoritos todavía.</p>';
            return;
        }
        grid.innerHTML = data.libros.map(buildCardHTML).join('');
        cargarPortadasEnGrid(grid);
    } catch {
        grid.innerHTML = '<p class="grid-msg error">Error al cargar favoritos.</p>';
    }
}

// ── Filtros ────────────────────────────────────────────────────────────────────
const SECCIONES = {
    leido:    { tituloId: 'tituloLeidos',    gridId: 'leidosGrid',    verMasId: 'leidosVerMas'   },
    no_leido: { tituloId: 'tituloPorLeer',   gridId: 'porLeerGrid',   verMasId: 'porLeerVerMas'  },
    leyendo:  { tituloId: 'tituloLeyendo',   gridId: 'leyendoGrid',   verMasId: 'leyendoVerMas'  },
    favorito: { tituloId: 'tituloFavoritos', gridId: 'favoritosGrid', verMasId: 'favoritosVerMas'},
};

function mostrarSecciones(filtro) {
    Object.entries(SECCIONES).forEach(([estado, { tituloId, gridId, verMasId }]) => {
        const mostrar = filtro === 'todos' || filtro === estado;
        [tituloId, gridId, verMasId].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = mostrar ? '' : 'none';
        });
    });
}

document.querySelectorAll('.filtros__btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filtros__btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        mostrarSecciones(btn.dataset.estado);
    });
});

// ── Buscador ───────────────────────────────────────────────────────────────────
document.getElementById('busqueda').addEventListener('input', function () {
    const q = this.value.trim().toLowerCase();

    // Si no hay búsqueda, mostrar secciones normales
    if (!q) {
        mostrarSecciones(document.querySelector('.filtros__btn.active')?.dataset.estado ?? 'todos');
        document.querySelectorAll('.libros[data-id]').forEach(c => c.style.display = '');
        return;
    }

    // Mostrar todas las secciones para buscar en todas
    Object.values(SECCIONES).forEach(({ tituloId, gridId, verMasId }) => {
        [tituloId, gridId, verMasId].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = '';
        });
    });

    // Filtrar tarjetas
    document.querySelectorAll('.libros[data-id]').forEach(card => {
        const titulo = (card.dataset.titulo ?? '').toLowerCase();
        const autor  = (card.dataset.autor  ?? '').toLowerCase();
        card.style.display = (titulo.includes(q) || autor.includes(q)) ? '' : 'none';
    });
});

// ── User menu & logout ─────────────────────────────────────────────────────────
const userBtn  = document.getElementById('userBtn');
const userMenu = document.getElementById('userMenu');

userBtn.addEventListener('click', e => {
    e.stopPropagation();
    userMenu.classList.toggle('active');
});
document.addEventListener('click', e => {
    if (!userBtn.contains(e.target)) userMenu.classList.remove('active');
});
document.getElementById('btnLogout').addEventListener('click', async () => {
    const fd = new FormData();
    fd.append('accion', 'logout');
    await fetch('../php/auth.php', { method: 'POST', body: fd });
    window.location.href = 'home.php';
});

// ── Filtro desde URL ───────────────────────────────────────────────────────────
const filtroUrl = new URLSearchParams(window.location.search).get('filtro') ?? 'todos';
const btnActivo = document.querySelector(`.filtros__btn[data-estado="${filtroUrl}"]`);
if (btnActivo) {
    document.querySelectorAll('.filtros__btn').forEach(b => b.classList.remove('active'));
    btnActivo.classList.add('active');
    mostrarSecciones(filtroUrl);
}

// ── Init ───────────────────────────────────────────────────────────────────────
cargarSeccion('leido',    'leidosGrid',   'leidosVerMas');
cargarSeccion('no_leido', 'porLeerGrid',  'porLeerVerMas');
cargarSeccion('leyendo',  'leyendoGrid',  'leyendoVerMas');
cargarFavoritos('favoritosGrid');

// ── Recargar todos los grids ───────────────────────────────────────────────────
function recargarLibros() {
    _todosLosLibros = null;
    cargarSeccion('leido',    'leidosGrid',   'leidosVerMas');
    cargarSeccion('no_leido', 'porLeerGrid',  'porLeerVerMas');
    cargarSeccion('leyendo',  'leyendoGrid',  'leyendoVerMas');
    cargarFavoritos('favoritosGrid');
}

// ── Click en botón "Ver detalles" → abrir popup ───────────────────────────────
document.addEventListener('click', async e => {
    const btn = e.target.closest('.btn-abrir-popup');
    if (!btn) return;
    e.stopPropagation(); // evitar que el click llegue al listener de cierre del popup
    const card = btn.closest('[data-id]');
    if (!card) return;

    try {
        const res  = await fetch(`../php/libros.php?accion=detalle_libro&libro_id=${card.dataset.id}`);
        const data = await res.json();
        if (data.ok) { abrirPopupLibro(data.libro); return; }
    } catch { /* fallback */ }

    abrirPopupLibro({
        id:          card.dataset.id,
        titulo:      card.dataset.titulo,
        autor:       card.dataset.autor       ?? '',
        descripcion: card.dataset.descripcion ?? '',
        genero:      card.dataset.genero      ?? '',
        estado:      card.dataset.estado      ?? '',
        favorito:    card.dataset.favorito    ?? 0,
    });
});