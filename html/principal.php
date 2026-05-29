<?php
require_once '../php/sesion.php';
requiereAuth();
$nombreUsuario = htmlspecialchars(getUsuarioNombre());
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bookly - Inicio</title>
    <link rel="stylesheet" href="../css/style.css">
    <script src="../js/portadas.js" defer></script>
    <script src="../js/popup.js"    defer></script>
    <script src="../js/principal.js" defer></script>
</head>
<body>

    <header class="header">
        <div class="header__logo">
            <a href="principal.php"><img src="../css/img/LogoHeader.png" alt="Logo"></a>
        </div>
        <div class="header__search">
            <input type="search" id="busqueda" placeholder="Buscar...">
        </div>
        <div class="header__user" id="userBtn">
            <img src="../css/img/user.png" alt="<?= $nombreUsuario ?>">
            <div class="header__user__menu" id="userMenu">
                <a href="library.php">Mi Biblioteca</a>
                <button id="btnLogout">Cerrar sesión</button>
            </div>
        </div>
    </header>

    <article class="content">

        <div class="content__misLibros">
            <div class="content__misLibros__title"><h1>Mis Libros</h1></div>
            <div class="content__misLibros__libros" id="misLibrosGrid"></div>
            <div class="content__misLibros__verMas" id="misLibrosVerMas"><h4>Ver más</h4></div>
        </div>

        <div class="content__losFavoritos">
            <div class="content__losFavoritos__title"><h1>Los Favoritos</h1></div>
            <div class="content__losFavoritos__libros" id="favoritosGrid"></div>
            <div class="content__losFavoritos__verMas" id="favoritosVerMas"><h4>Ver más</h4></div>
        </div>

        <div class="content__encuentra">
            <div class="content__encuentra__title">
                <h1>Encuentra <strong>Tú</strong> Próxima Lectura</h1>
            </div>
            <div class="content__encuentra__libros">
                <div class="content__encuentra__libros__stack" id="tinderStack"></div>
            </div>
            <div class="content__encuentra__controls" id="tinderControls">
                <button class="content__encuentra__controls__btn content__encuentra__controls__btn--dislike" id="dislikeBtn">✕</button>
                <button class="content__encuentra__controls__btn content__encuentra__controls__btn--info"    id="infoBtn">ℹ</button>
                <button class="content__encuentra__controls__btn content__encuentra__controls__btn--like"    id="likeBtn">♥</button>
            </div>
            <div class="content__encuentra__emptyState" id="tinderEmpty">
                <h2>¡No hay más libros!</h2>
                <p>Has revisado todas las recomendaciones disponibles</p>
                <button id="restartBtn">Volver a empezar</button>
            </div>
        </div>

    </article>

    <footer>
        <div class="logo"><img src="../css/img/Logo.png" alt="Logo"></div>
        <div class="links">
            <a href="#">Sobre nosotros</a>
            <a href="#">Términos y condiciones</a>
            <a href="principal.php">Página principal</a>
        </div>
        <div class="socialMedia">
            <div class="socialMedia__insta"><img src="../css/img/instagram.png" alt="instagram"></div>
            <div class="socialMedia__tikTok"><img src="../css/img/tikTok.png" alt="tikTok"></div>
        </div>
    </footer>

    <!-- Popup libro -->
    <div class="libroPopUp" id="libroPopUp">
        <div class="libroPopUp__content">
            <button class="libroPopUp__content__close" id="cerrarPopupLibro">&times;</button>

            <div class="libroPopUp__content__header">
                <div class="libroPopUp__content__header__portada">
                    <img id="popupPortada" src="" alt="">
                </div>
                <div class="libroPopUp__content__header__info">
                    <h2 id="popupTitulo"></h2>
                    <p class="libroPopUp__content__header__info__autor"  id="popupAutor"></p>
                    <span class="libroPopUp__content__header__info__genero" id="popupGenero"></span>
                </div>
            </div>

            <div class="libroPopUp__content__descripcion" id="popupDescripcion"></div>

            <div class="libroPopUp__content__acciones">
                <p class="libroPopUp__content__acciones__titulo">Estado de lectura</p>
                <div class="libroPopUp__content__acciones__estados">
                    <button data-estado="no_leido"><span class="icon">📚</span> Por leer</button>
                    <button data-estado="leyendo"><span class="icon">👁</span> Leyendo</button>
                    <button data-estado="leido"><span class="icon">✅</span> Leído</button>
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

    <div class="toast" id="toast"></div>

</body>
</html>