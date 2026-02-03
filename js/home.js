// Seleccionar elementos del DOM
const slides = document.querySelectorAll('.carouselContainer__slide');
const indicators = document.querySelectorAll('.carouselContainer__indicators__indicator');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const carousel = document.querySelector('.carouselContainer');

// Control del modal de inicio de sesión
const loginButtons = document.querySelectorAll('#button');
const loginPopUp = document.getElementById('loginPopUp');
const closeLoginModal = document.getElementById('closeLoginModal');
const loginForm = document.getElementById('loginForm');

// Control del modal de registro
const signUpPopUp = document.getElementById('signUpPopUp');
const closeSignupModal = document.getElementById('closeSignupModal');
const signupForm = document.getElementById('signupForm');

// Enlaces para cambiar entre modales
const openSignupFromLogin = document.getElementById('openSignupFromLogin');
const openLoginFromSignup = document.getElementById('openLoginFromSignup');

// Variables de control del carrusel
let currentSlide = 0;
const slideInterval = 15000;
let autoSlide;

/**
 * Muestra el slide correspondiente al índice
 * @param {number} index - Índice del slide a mostrar
 */
function showSlide(index) {
    if (index >= slides.length) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = slides.length - 1;
    } else {
        currentSlide = index;
    }

    // Actualizar slides
    slides.forEach(slide => slide.removeAttribute('id'));
    slides[currentSlide].setAttribute('id', 'active');

    // Actualizar indicadores
    indicators.forEach(indicator => indicator.removeAttribute('id'));
    indicators[currentSlide].setAttribute('id', 'active');
}

/**
 * Avanza al siguiente slide
 */
function nextSlide() {
    showSlide(currentSlide + 1);
}

/**
 * Retrocede al slide anterior
 */
function prevSlide() {
    showSlide(currentSlide - 1);
}

/**
 * Inicia el cambio automático de slides
 */
function startAutoSlide() {
    autoSlide = setInterval(nextSlide, slideInterval);
}

/**
 * Detiene el cambio automático de slides
 */
function stopAutoSlide() {
    clearInterval(autoSlide);
}

/**
 * Reinicia el temporizador automático
 */
function resetAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
}

// ==========================================
// FUNCIONES DE MODAL
// ==========================================

/**
 * Abre el modal de login
 */
function openLoginModal() {
    loginPopUp.setAttribute('id', 'active');
    stopAutoSlide();
}

/**
 * Cierra el modal de login
 */
function closeLoginModalFunc() {
    loginPopUp.setAttribute('id', 'loginPopUp');
    startAutoSlide();
}

/**
 * Abre el modal de registro
 */
function openSignupModal() {
    signUpPopUp.setAttribute('id', 'active');
    stopAutoSlide();
}

/**
 * Cierra el modal de registro
 */
function closeSignupModalFunc() {
    signUpPopUp.setAttribute('id', 'signUpPopUp');
    startAutoSlide();
}

/**
 * Cambia de modal de login a registro
 */
function switchToSignup(e) {
    e.preventDefault();
    closeLoginModalFunc();
    setTimeout(openSignupModal, 300); // Pequeño delay para transición suave
}

/**
 * Cambia de modal de registro a login
 */
function switchToLogin(e) {
    e.preventDefault();
    closeSignupModalFunc();
    setTimeout(openLoginModal, 300); // Pequeño delay para transición suave
}

// ==========================================
// EVENT LISTENERS - CARRUSEL
// ==========================================

nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAutoSlide();
});

prevBtn.addEventListener('click', () => {
    prevSlide();
    resetAutoSlide();
});

indicators.forEach(indicator => {
    indicator.addEventListener('click', () => {
        const slideIndex = parseInt(indicator.getAttribute('data-slide'));
        showSlide(slideIndex);
        resetAutoSlide();
    });
});

carousel.addEventListener('mouseenter', stopAutoSlide);
carousel.addEventListener('mouseleave', startAutoSlide);

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        prevSlide();
        resetAutoSlide();
    } else if (e.key === 'ArrowRight') {
        nextSlide();
        resetAutoSlide();
    }
});

// ==========================================
// EVENT LISTENERS - MODAL LOGIN
// ==========================================

// Abrir modal de login
loginButtons.forEach(button => {
    button.addEventListener('click', openLoginModal);
});

// Cerrar modal de login
closeLoginModal.addEventListener('click', closeLoginModalFunc);

// Cerrar modal al hacer clic fuera
loginPopUp.addEventListener('click', (e) => {
    if (e.target === loginPopUp) {
        closeLoginModalFunc();
    }
});

// Cambiar a modal de registro
openSignupFromLogin.addEventListener('click', switchToSignup);

// Manejar envío del formulario de login
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    console.log('Intento de inicio de sesión:', { email, password });
    alert('¡Inicio de sesión exitoso! Email: ' + email);
    
    closeLoginModalFunc();
    loginForm.reset();
});

// ==========================================
// EVENT LISTENERS - MODAL SIGNUP
// ==========================================

// Cerrar modal de registro
closeSignupModal.addEventListener('click', closeSignupModalFunc);

// Cerrar modal al hacer clic fuera
signUpPopUp.addEventListener('click', (e) => {
    if (e.target === signUpPopUp) {
        closeSignupModalFunc();
    }
});

// Cambiar a modal de login
openLoginFromSignup.addEventListener('click', switchToLogin);

// Manejar envío del formulario de registro
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    
    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
    }
    
    console.log('Intento de registro:', { name, email, password });
    alert('¡Registro exitoso! Bienvenido ' + name);
    
    closeSignupModalFunc();
    signupForm.reset();
});

// ==========================================
// EVENT LISTENERS - TECLADO (ESC)
// ==========================================

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (loginPopUp.getAttribute('id') === 'active') {
            closeLoginModalFunc();
        }
        if (signUpPopUp.getAttribute('id') === 'active') {
            closeSignupModalFunc();
        }
    }
});

// ==========================================
// INICIAR CARRUSEL
// ==========================================

startAutoSlide();