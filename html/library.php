<?php
require_once '../php/sesion.php';
requiereAuth();
$nombreUsuario = htmlspecialchars(getUsuarioNombre());
echo __FILE__;
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bookly - Mi Biblioteca</title>
    <link rel="stylesheet" href="../css/style.css">
    <script src="../js/portadas.js" defer></script>
    <script src="../js/popup.js"    defer></script>
    <script src="../js/library.js"  defer></script>
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
                <a href="principal.php">Inicio</a>
                <button id="btnLogout">Cerrar sesión</button>
            </div>
        </div>
    </header>

    <div class="filtros">
        <button class="filtros__btn active" data-estado="todos">Todos</button>
        <button class="filtros__btn" data-estado="leido">Leídos</button>
        <button class="filtros__btn" data-estado="leyendo">Leyendo</button>
        <button class="filtros__btn" data-estado="no_leido">Por leer</button>
        <button class="filtros__btn" data-estado="favorito">Favoritos</button>
    </div>

    <h2 class="seccion__titulo" id="tituloLeidos">Libros leídos</h2>
    <article id="leidosGrid"></article>
    <div class="seccion__verMas" id="leidosVerMas"><h4>Ver más</h4></div>

    <h2 class="seccion__titulo" id="tituloPorLeer">Libros por leer</h2>
    <article id="porLeerGrid"></article>
    <div class="seccion__verMas" id="porLeerVerMas"><h4>Ver más</h4></div>

    <h2 class="seccion__titulo" id="tituloLeyendo">Leyendo ahora</h2>
    <article id="leyendoGrid"></article>
    <div class="seccion__verMas" id="leyendoVerMas"><h4>Ver más</h4></div>

    <h2 class="seccion__titulo" id="tituloFavoritos">Favoritos</h2>
    <article id="favoritosGrid"></article>
    <div class="seccion__verMas" id="favoritosVerMas"><h4>Ver más</h4></div>

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

    <!-- Popup libro (único) -->
    <div class="libroPopUp" id="libroPopUp">
        <div class="libroPopUp__content">
            <button class="libroPopUp__content__close" id="cerrarPopupLibro">&times;</button>

            <div class="libroPopUp__content__header">
                <div class="libroPopUp__content__header__portada">
                    <img id="popupPortada" src="" alt="Portada">
                </div>
                <div class="libroPopUp__content__header__info">
                    <h2 id="popupTitulo"></h2>
                    <p class="libroPopUp__content__header__info__autor" id="popupAutor"></p>
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