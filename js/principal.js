'use strict';

// ── Toast ──────────────────────────────────────────────────────────────────────
function mostrarToast(msg, esError = false) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.className   = 'toast show' + (esError ? ' error' : '');
    setTimeout(() => { t.className = 'toast'; }, 3000);
}

// ── Skeletons ──────────────────────────────────────────────────────────────────
function buildSkeletons(n, sec) {
    return Array.from({ length: n }, () => `
        <div class="content__${sec}__libros__libro">
            <div class="content__${sec}__libros__libro__flipCard">
                <div class="content__${sec}__libros__libro__flipCard__inner">
                    <div class="content__${sec}__libros__libro__flipCard__inner__front skeleton"></div>
                </div>
            </div>
        </div>`).join('');
}

// ── Construir tarjeta ──────────────────────────────────────────────────────────
function buildCardHTML(libro, sec) {
    return `
    <div class="content__${sec}__libros__libro"
         data-id="${libro.id}"
         data-titulo="${libro.titulo}"
         data-autor="${libro.autor ?? ''}"
         data-descripcion="${(libro.descripcion ?? '').replace(/"/g, '&quot;')}"
         data-genero="${libro.genero ?? ''}"
         data-estado="${libro.estado ?? ''}"
         data-favorito="${libro.favorito ?? 0}">
        <div class="content__${sec}__libros__libro__flipCard">
            <div class="content__${sec}__libros__libro__flipCard__inner">
                <div class="content__${sec}__libros__libro__flipCard__inner__front">
                    <div class="content__${sec}__libros__libro__flipCard__inner__front__imagen">
                        <img class="portada-lazy" alt="${libro.titulo}">
                    </div>
                    <div class="content__${sec}__libros__libro__flipCard__inner__front__title">
                        <h3>${libro.titulo}</h3>
                    </div>
                    <div class="content__${sec}__libros__libro__flipCard__inner__front__autor">
                        <p>${libro.autor ?? ''}</p>
                    </div>
                </div>
                <div class="content__${sec}__libros__libro__flipCard__inner__back">
                    <div class="content__${sec}__libros__libro__flipCard__inner__back__title">
                        <h3>Descripción</h3>
                    </div>
                    <div class="content__${sec}__libros__libro__flipCard__inner__back__texto">
                        <p>${libro.descripcion ?? 'Sin descripción.'}</p>
                    </div>
                    <div class="content__${sec}__libros__libro__flipCard__inner__back__abrir">
                        <button class="btn-abrir-popup">Ver detalles</button>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}

// ── Cargar portadas en un grid ─────────────────────────────────────────────────
function cargarPortadasEnGrid(gridEl) {
    gridEl.querySelectorAll('[data-titulo]').forEach(card => {
        const img = card.querySelector('img.portada-lazy');
        if (img) aplicarPortada(img, card.dataset.titulo, card.dataset.autor);
    });
}

// ── Mis Libros ─────────────────────────────────────────────────────────────────
async function cargarMisLibros() {
    const grid = document.getElementById('misLibrosGrid');
    grid.innerHTML = buildSkeletons(4, 'misLibros');
    try {
        const res  = await fetch('../php/libros.php?accion=mis_libros&limite=4');
        const data = await res.json();
        if (!data.ok) throw new Error();
        if (data.libros.length === 0) {
            grid.innerHTML = '<p class="grid-msg">Aún no tienes libros. ¡Desliza en las recomendaciones!</p>';
            return;
        }
        grid.innerHTML = data.libros.map(l => buildCardHTML(l, 'misLibros')).join('');
        cargarPortadasEnGrid(grid);
    } catch {
        grid.innerHTML = '<p class="grid-msg error">No se pudieron cargar tus libros.</p>';
    }
}

// ── Favoritos ──────────────────────────────────────────────────────────────────
async function cargarFavoritos() {
    const grid = document.getElementById('favoritosGrid');
    grid.innerHTML = buildSkeletons(4, 'losFavoritos');
    try {
        const res  = await fetch('../php/libros.php?accion=favoritos&limite=4');
        const data = await res.json();
        if (!data.ok) throw new Error();
        if (data.libros.length === 0) {
            grid.innerHTML = '<p class="grid-msg">No tienes favoritos todavía.</p>';
            return;
        }
        grid.innerHTML = data.libros.map(l => buildCardHTML(l, 'losFavoritos')).join('');
        cargarPortadasEnGrid(grid);
    } catch {
        grid.innerHTML = '<p class="grid-msg error">No se pudieron cargar los favoritos.</p>';
    }
}

// ── Buscador ───────────────────────────────────────────────────────────────────
document.getElementById('busqueda').addEventListener('input', function () {
    const q = this.value.trim().toLowerCase();
    ['misLibrosGrid', 'favoritosGrid'].forEach(gridId => {
        document.getElementById(gridId)?.querySelectorAll('[data-id]').forEach(card => {
            const titulo = (card.dataset.titulo ?? '').toLowerCase();
            const autor  = (card.dataset.autor  ?? '').toLowerCase();
            card.style.display = (!q || titulo.includes(q) || autor.includes(q)) ? '' : 'none';
        });
    });
});

// ── Tinder ─────────────────────────────────────────────────────────────────────
class TinderBooks {
    constructor() {
        this.stack      = document.getElementById('tinderStack');
        this.controls   = document.getElementById('tinderControls');
        this.emptyState = document.getElementById('tinderEmpty');
        this.currentCard = null;
        this.startX   = 0;
        this.currentX = 0;
        this.isDragging = false;

        // Guardamos referencias a los handlers para poder eliminarlos después
        this._onMouseMove = e => this.handleMove(e);
        this._onMouseUp   = () => this.handleEnd();
        this._onTouchMove = e => this.handleMove(e);
        this._onTouchEnd  = () => this.handleEnd();

        this.init();
    }

    async init() {
        try {
            const res  = await fetch('../php/libros.php?accion=recomendaciones');
            const data = await res.json();
            if (!data.ok || data.libros.length === 0) { this.showEmptyState(); return; }

            data.libros.forEach(libro => {
                const div = document.createElement('div');
                div.className = 'content__encuentra__libros__libro';
                div.dataset.id          = libro.id;
                div.dataset.titulo      = libro.titulo;
                div.dataset.autor       = libro.autor       ?? '';
                div.dataset.descripcion = libro.descripcion ?? '';
                div.dataset.genero      = libro.genero      ?? '';

                div.innerHTML = `
                    <div class="content__encuentra__libros__libro__flipCard tinder-mode">
                        <div class="content__encuentra__libros__libro__flipCard__inner">
                            <div class="content__encuentra__libros__libro__flipCard__inner__front">
                                <div class="content__encuentra__libros__libro__flipCard__inner__front__imagen">
                                    <img class="portada-lazy" alt="${libro.titulo}">
                                </div>
                                <div class="content__encuentra__libros__libro__flipCard__inner__front__info">
                                    <h3>${libro.titulo}</h3>
                                    <p>${libro.autor ?? ''}</p>
                                </div>
                                <div class="content__encuentra__libros__libro__flipCard__inner__front__likeStamp">ME GUSTA</div>
                                <div class="content__encuentra__libros__libro__flipCard__inner__front__nopeStamp">NO</div>
                            </div>
                            <div class="content__encuentra__libros__libro__flipCard__inner__back">
                                <div class="content__encuentra__libros__libro__flipCard__inner__back__title"><h3>Descripción</h3></div>
                                <div class="content__encuentra__libros__libro__flipCard__inner__back__texto"><p>${libro.descripcion ?? 'Sin descripción.'}</p></div>
                            </div>
                        </div>
                    </div>`;

                this.stack.appendChild(div);
                aplicarPortada(div.querySelector('img.portada-lazy'), libro.titulo, libro.autor ?? '');
            });

            this.setCurrentCard();
            this.bindControls();
        } catch {
            mostrarToast('No se pudieron cargar las recomendaciones.', true);
        }
    }

    bindControls() {
        document.getElementById('dislikeBtn').addEventListener('click', () => this.reject());
        document.getElementById('likeBtn').addEventListener('click',    () => this.accept());
        document.getElementById('infoBtn').addEventListener('click',    () => this.showInfo());
        document.getElementById('restartBtn').addEventListener('click', () => location.reload());
    }

    setCurrentCard() {
        this.currentCard = this.stack.querySelector('.content__encuentra__libros__libro:first-child');
        if (this.currentCard) this.attachCardEvents();
        else this.showEmptyState();
    }

    // Añade listeners SOLO en la carta actual; los de document se eliminan al cambiar de carta
    attachCardEvents() {
        if (!this.currentCard) return;
        this.currentCard.addEventListener('mousedown',  e => this.handleStart(e));
        this.currentCard.addEventListener('touchstart', e => this.handleStart(e), { passive: true });
        document.addEventListener('mousemove',  this._onMouseMove);
        document.addEventListener('mouseup',    this._onMouseUp);
        document.addEventListener('touchmove',  this._onTouchMove, { passive: false });
        document.addEventListener('touchend',   this._onTouchEnd);
    }

    detachDocumentEvents() {
        document.removeEventListener('mousemove',  this._onMouseMove);
        document.removeEventListener('mouseup',    this._onMouseUp);
        document.removeEventListener('touchmove',  this._onTouchMove);
        document.removeEventListener('touchend',   this._onTouchEnd);
    }

    handleStart(e) {
        this.isDragging = true;
        const t = e.touches ? e.touches[0] : e;
        this.startX = this.currentX = t.clientX;
    }

    handleMove(e) {
        if (!this.isDragging || !this.currentCard) return;
        if (e.cancelable) e.preventDefault();
        const t = e.touches ? e.touches[0] : e;
        this.currentX = t.clientX;
        const deltaX = this.currentX - this.startX;

        this.currentCard.style.transform  = `translate(${deltaX}px, 0) rotate(${deltaX * 0.08}deg)`;
        this.currentCard.style.transition = 'none';

        const like = this.currentCard.querySelector('[class*="likeStamp"]');
        const nope = this.currentCard.querySelector('[class*="nopeStamp"]');

        if (deltaX > 50) {
            if (like) like.style.opacity = Math.min(deltaX / 100, 1);
            if (nope) nope.style.opacity = 0;
            this.currentCard.classList.add('swiping-right');
            this.currentCard.classList.remove('swiping-left');
        } else if (deltaX < -50) {
            if (nope) nope.style.opacity = Math.min(Math.abs(deltaX) / 100, 1);
            if (like) like.style.opacity = 0;
            this.currentCard.classList.add('swiping-left');
            this.currentCard.classList.remove('swiping-right');
        } else {
            if (like) like.style.opacity = 0;
            if (nope) nope.style.opacity = 0;
            this.currentCard.classList.remove('swiping-right', 'swiping-left');
        }
    }

    handleEnd() {
        if (!this.isDragging || !this.currentCard) return;
        this.isDragging = false;
        const deltaX = this.currentX - this.startX;

        const like = this.currentCard.querySelector('[class*="likeStamp"]');
        const nope = this.currentCard.querySelector('[class*="nopeStamp"]');
        if (like) like.style.opacity = 0;
        if (nope) nope.style.opacity = 0;

        if      (deltaX >  100) this.accept();
        else if (deltaX < -100) this.reject();
        else {
            this.currentCard.style.transform  = '';
            this.currentCard.style.transition = 'transform 0.3s ease';
            this.currentCard.classList.remove('swiping-right', 'swiping-left');
        }
    }

    // Like: guardar automáticamente en BD + avanzar carta
    async accept() {
        if (!this.currentCard) return;
        const card = this.currentCard;
        card.classList.add('swiped-right');
        this.detachDocumentEvents();

        // Guardar en BD como "no_leido"
        try {
            const fd = new FormData();
            fd.append('accion',   'guardar_libro');
            fd.append('libro_id', card.dataset.id);
            fd.append('estado',   'no_leido');
            const res  = await fetch('../php/libros.php', { method: 'POST', body: fd });
            const data = await res.json();
            if (data.ok) {
                mostrarToast('📚 Añadido a tu biblioteca');
                if (typeof cargarMisLibros === 'function') cargarMisLibros();
            } else {
                mostrarToast(data.mensaje || 'Error al guardar', true);
            }
        } catch {
            mostrarToast('Error al guardar el libro', true);
        }

        this.removeCard(card);
    }

    // Dislike: simplemente avanzar carta
    reject() {
        if (!this.currentCard) return;
        const card = this.currentCard;
        card.classList.add('swiped-left');
        this.detachDocumentEvents();
        this.removeCard(card);
    }

    // Botón ℹ: mostrar popup con info del libro sin guardarlo
    showInfo() {
        if (!this.currentCard) return;
        abrirPopupLibro({
            id:          this.currentCard.dataset.id,
            titulo:      this.currentCard.dataset.titulo,
            autor:       this.currentCard.dataset.autor,
            descripcion: this.currentCard.dataset.descripcion,
            genero:      this.currentCard.dataset.genero,
            estado:      '',
            favorito:    0,
        });
    }

    removeCard(card) {
        setTimeout(() => {
            card.remove();
            this.currentCard = null;
            this.setCurrentCard();
        }, 500);
    }

    showEmptyState() {
        this.emptyState.classList.add('active');
        if (this.controls) this.controls.style.display = 'none';
    }
}

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

document.getElementById('misLibrosVerMas').addEventListener('click', () => {
    window.location.href = 'library.php';
});
document.getElementById('favoritosVerMas').addEventListener('click', () => {
    window.location.href = 'library.php?filtro=favorito';
});

// ── Init ───────────────────────────────────────────────────────────────────────
cargarMisLibros();
cargarFavoritos();
new TinderBooks();

// ── Click en botón "Ver detalles" → abrir popup ───────────────────────────────
document.addEventListener('click', async e => {
    const btn = e.target.closest('.btn-abrir-popup');
    if (!btn) return;
    e.stopPropagation();
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