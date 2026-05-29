<?php
require_once '../php/sesion.php';
iniciarSesion();

// Si ya hay sesión activa, redirigir a principal
if (estaAutenticado()) {
    header('Location: principal.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bookly - Tu Biblioteca Personal Digital</title>
    <link rel="stylesheet" href="../css/style.css">
</head>
<body class="page-home">

    <!-- ── Carrusel ─────────────────────────────────────────────────────────── -->
    <div class="carouselContainer">

        <div class="carouselContainer__slide" id="active">
            <div class="carouselContainer__slide__img">
                <img src="../css/img/libros.jpg" alt="Biblioteca de libros">
            </div>
            <div class="carouselContainer__slide__text">
                <h1>Bienvenido a Bookly</h1>
                <p>Tu biblioteca personal digital. Organiza, descubre y comparte tu pasión por la lectura en un solo lugar.</p>
                <button class="login-btn" id="button">Iniciar Sesión</button>
            </div>
        </div>

        <div class="carouselContainer__slide" id="reverse">
            <div class="carouselContainer__slide__text">
                <h1>Organiza Tu Biblioteca</h1>
                <p>Registra todos tus libros con información detallada. Clasifícalos en por leer, leyendo o leídos.</p>
                <button class="login-btn" id="button">Iniciar Sesión</button>
            </div>
            <div class="carouselContainer__slide__img">
                <img src="../css/img/biblioteca.jpg" alt="Organiza tu biblioteca">
            </div>
        </div>

        <div class="carouselContainer__slide">
            <div class="carouselContainer__slide__img">
                <img src="../css/img/like.jpg" alt="Recomendaciones de libros">
            </div>
            <div class="carouselContainer__slide__text">
                <h1>Supera el Bloqueo Lector</h1>
                <p>¿No sabes qué leer? Recibe recomendaciones personalizadas con nuestro sistema tipo Tinder para libros.</p>
                <button class="login-btn" id="button">Iniciar Sesión</button>
            </div>
        </div>

        <div class="carouselContainer__slide" id="reverse">
            <div class="carouselContainer__slide__text">
                <h1>Únete a la Comunidad</h1>
                <p>Comparte reseñas, califica libros y conecta con lectores apasionados.</p>
                <button class="login-btn" id="button">Iniciar Sesión</button>
            </div>
            <div class="carouselContainer__slide__img">
                <img src="../css/img/leer.jpg" alt="Comunidad de lectores">
            </div>
        </div>

        <div class="carouselContainer__slide">
            <div class="carouselContainer__slide__img">
                <img src="../css/img/libreria.jpg" alt="Lee en cualquier lugar">
            </div>
            <div class="carouselContainer__slide__text">
                <h1>Lee Donde Quieras</h1>
                <p>Sube tus libros en formato eBook y accede a ellos desde cualquier dispositivo.</p>
                <button class="login-btn" id="button">Iniciar Sesión</button>
            </div>
        </div>

        <div class="carouselContainer__slide" id="reverse">
            <div class="carouselContainer__slide__text">
                <h1>Crea Tus Listas</h1>
                <p>Organiza tus favoritos, crea listas personalizadas y guarda las recomendaciones que más te gusten.</p>
                <button class="login-btn" id="button">Iniciar Sesión</button>
            </div>
            <div class="carouselContainer__slide__img">
                <img src="../css/img/estanterias.jpg" alt="Listas de favoritos">
            </div>
        </div>

        <div class="carouselContainer__slide">
            <div class="carouselContainer__slide__img">
                <img src="../css/img/estanteriasConBombillas.jpg" alt="Conecta con lectores">
            </div>
            <div class="carouselContainer__slide__text">
                <h1>Conecta con Lectores</h1>
                <p>Sistema de mensajería interna para dialogar con otros amantes de la lectura.</p>
                <button class="login-btn" id="button">Iniciar Sesión</button>
            </div>
        </div>

        <div class="carouselContainer__slide" id="reverse">
            <div class="carouselContainer__slide__text">
                <h1>Comienza Tu Aventura</h1>
                <p>Únete a Bookly hoy y transforma tu experiencia lectora. ¡Es gratis!</p>
                <button class="login-btn" id="button">Registrarse Gratis</button>
            </div>
            <div class="carouselContainer__slide__img">
                <img src="../css/img/librosFondoBlanco.jpg" alt="Únete a Bookly">
            </div>
        </div>

        <!-- Controles -->
        <div class="carouselContainer__controls">
            <button class="carouselContainer__controls__btn" id="prevBtn">
                <img src="../css/img/flechaIzquierda.png" alt="anterior">
            </button>
            <button class="carouselContainer__controls__btn" id="nextBtn">
                <img src="../css/img/flechaDerecha.png" alt="siguiente">
            </button>
        </div>

        <!-- Indicadores -->
        <div class="carouselContainer__indicators">
            <span class="carouselContainer__indicators__indicator" id="active" data-slide="0"></span>
            <span class="carouselContainer__indicators__indicator" data-slide="1"></span>
            <span class="carouselContainer__indicators__indicator" data-slide="2"></span>
            <span class="carouselContainer__indicators__indicator" data-slide="3"></span>
            <span class="carouselContainer__indicators__indicator" data-slide="4"></span>
            <span class="carouselContainer__indicators__indicator" data-slide="5"></span>
            <span class="carouselContainer__indicators__indicator" data-slide="6"></span>
            <span class="carouselContainer__indicators__indicator" data-slide="7"></span>
        </div>
    </div>

    <!-- ── Popup Login ───────────────────────────────────────────────────────── -->
    <div class="loginPopUp" id="loginPopUp">
        <div class="loginPopUp__content">
            <button class="loginPopUp__content__close" id="closeLoginModal">&times;</button>
            <h2>Bienvenido de nuevo</h2>
            <p class="loginPopUp__content__text">Inicia sesión para seguir usando Bookly</p>
            <form id="loginForm">
                <div class="loginPopUp__content__formGroup">
                    <label for="loginEmail">Correo Electrónico</label>
                    <input type="email" id="loginEmail" name="email" placeholder="tu@gmail.com" required>
                </div>
                <div class="loginPopUp__content__formGroup">
                    <label for="loginPassword">Contraseña</label>
                    <input type="password" id="loginPassword" name="password" placeholder="••••••••" required>
                </div>
                <div class="loginPopUp__content__formOptions">
                    <label class="loginPopUp__content__formOptions__checkboxLabel">
                        <input type="checkbox" name="remember">
                        <span>Recordarme</span>
                    </label>
                    <a href="#" class="loginPopUp__content__formOptions__forgotPassword">¿Olvidaste tu contraseña?</a>
                </div>
                <button type="submit" class="loginPopUp__content__submitBtn">Iniciar Sesión</button>
                <p class="loginPopUp__content__error" id="loginError"></p>
                <p class="loginPopUp__content__signupLink">
                    ¿No tienes cuenta? <a href="#" id="openSignupFromLogin">Regístrate aquí</a>
                </p>
            </form>
        </div>
    </div>

    <!-- ── Popup Registro ────────────────────────────────────────────────────── -->
    <div class="signUpPopUp" id="signUpPopUp">
        <div class="signUpPopUp__content">
            <button class="signUpPopUp__content__close" id="closeSignupModal">&times;</button>
            <h2>Crea tu cuenta en Bookly</h2>
            <p class="signUpPopUp__content__text">Regístrate gratis y comienza tu biblioteca digital</p>
            <form id="signupForm">
                <div class="signUpPopUp__content__formGroup">
                    <label for="signupName">Nombre</label>
                    <input type="text" id="signupName" name="nombre" placeholder="Tu nombre" required>
                </div>
                <div class="signUpPopUp__content__formGroup">
                    <label for="signupLastName">Apellidos</label>
                    <input type="text" id="signupLastName" name="apellidos" placeholder="Tus apellidos" required>
                </div>
                <div class="signUpPopUp__content__formGroup">
                    <label for="signupUserName">Usuario</label>
                    <input type="text" id="signupUserName" name="usuario" placeholder="Nombre de usuario" required>
                </div>
                <div class="signUpPopUp__content__formGroup">
                    <label for="signupBirthdate">Nacimiento</label>
                    <input type="date" id="signupBirthdate" name="fecha" required>
                </div>
                <div class="signUpPopUp__content__formGroup">
                    <label for="signupEmail">Email</label>
                    <input type="email" id="signupEmail" name="email" placeholder="tu@gmail.com" required>
                </div>
                <div class="signUpPopUp__content__formGroup">
                    <label for="signupPassword">Contraseña</label>
                    <input type="password" id="signupPassword" name="password" placeholder="••••••••" required>
                </div>
                <div class="signUpPopUp__content__formGroup">
                    <label for="signupConfirmPassword">Confirmar</label>
                    <input type="password" id="signupConfirmPassword" name="confirmar" placeholder="••••••••" required>
                </div>
                <button type="submit" class="signUpPopUp__content__submitBtn">Registrarse</button>
                <p class="signUpPopUp__content__error" id="signupError"></p>
                <p class="signUpPopUp__content__loginLink">
                    ¿Ya tienes cuenta? <a href="#" id="openLoginFromSignup">Inicia sesión aquí</a>
                </p>
            </form>
        </div>
    </div>

    <script src="../js/home.js"></script>
</body>
</html>