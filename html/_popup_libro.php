<!-- ── Popup Gestión Libro ────────────────────────────────────────────────── -->
<div class="libroPopUp" id="libroPopUp">
    <div class="libroPopUp__content">
        <button class="libroPopUp__content__close" id="cerrarPopupLibro">&times;</button>

        <div class="libroPopUp__content__header">
            <div class="libroPopUp__content__header__portada">
                <img id="popupPortada" src="" alt="Portada">
            </div>
            <div class="libroPopUp__content__header__info">
                <h2 id="popupTitulo"></h2>
                <p class="popup-autor"  id="popupAutor"></p>
                <span class="popup-genero" id="popupGenero"></span>
            </div>
        </div>

        <p class="libroPopUp__content__descripcion" id="popupDescripcion"></p>

        <div class="libroPopUp__content__acciones">
            <h3>Estado de lectura</h3>
            <div class="libroPopUp__content__acciones__estados">
                <button class="estado-leido"   data-estado="leido">
                    <span class="icon">✅</span> Leído
                </button>
                <button class="estado-leyendo" data-estado="leyendo">
                    <span class="icon">📖</span> Leyendo
                </button>
                <button class="estado-noleido" data-estado="no_leido">
                    <span class="icon">🕐</span> Por leer
                </button>
            </div>

            <button class="libroPopUp__content__acciones__favorito" id="btnFavorito">
                <span class="icon">🤍</span> Añadir a favoritos
            </button>

            <button class="libroPopUp__content__acciones__eliminar" id="btnEliminar">
                <span class="icon">🗑️</span> Eliminar de mi biblioteca
            </button>
        </div>
    </div>
</div>
