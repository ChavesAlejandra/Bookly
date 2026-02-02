// Seleccionar elementos del DOM
const slides = document.querySelectorAll('.carouselContainer__slide');
const indicators = document.querySelectorAll('.carouselContainer__indicators__indicator');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// Variables de control
let currentSlide = 0;
const slideInterval = 9000; // 5 segundos
let autoSlide;

/**
 * Muestra el slide correspondiente al índice
 * @param {number} index - Índice del slide a mostrar
 */
function showSlide(index) {
    // Asegurar que el índice esté en rango
    if (index >= slides.length) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = slides.length - 1;
    } else {
        currentSlide = index;
    }

    // Actualizar slides - remover ID active de todos
    slides.forEach(slide => slide.removeAttribute('id'));
    // Agregar ID active solo al slide actual
    slides[currentSlide].setAttribute('id', 'active');

    // Actualizar indicadores - remover ID active de todos
    indicators.forEach(indicator => indicator.removeAttribute('id'));
    // Agregar ID active solo al indicador actual
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

// Event listeners para controles de navegación
nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAutoSlide();
});

prevBtn.addEventListener('click', () => {
    prevSlide();
    resetAutoSlide();
});

// Event listeners para indicadores
indicators.forEach(indicator => {
    indicator.addEventListener('click', () => {
        const slideIndex = parseInt(indicator.getAttribute('data-slide'));
        showSlide(slideIndex);
        resetAutoSlide();
    });
});

// Pausar cuando el mouse está sobre el carrusel
const carousel = document.querySelector('.carouselContainer');
carousel.addEventListener('mouseenter', stopAutoSlide);
carousel.addEventListener('mouseleave', startAutoSlide);

// Soporte para navegación con teclado
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        prevSlide();
        resetAutoSlide();
    } else if (e.key === 'ArrowRight') {
        nextSlide();
        resetAutoSlide();
    }
});

// Iniciar el carrusel automático al cargar la página
startAutoSlide();

// Control del modal de inicio de sesión
const loginButtons = document.querySelectorAll('.login-btn');
const loginModal = document.getElementById('loginModal');
const closeModal = document.getElementById('closeModal');
const loginForm = document.getElementById('loginForm');

// Abrir modal al hacer clic en cualquier botón de inicio de sesión
loginButtons.forEach(button => {
    button.addEventListener('click', () => {
        loginModal.setAttribute('id', 'active');
        stopAutoSlide(); // Pausar el carrusel cuando se abre el modal
    });
});

// Cerrar modal al hacer clic en la X
closeModal.addEventListener('click', () => {
    loginModal.setAttribute('id', 'loginModal');
    startAutoSlide(); // Reanudar el carrusel cuando se cierra el modal
});

// Cerrar modal al hacer clic fuera del contenido
loginModal.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.setAttribute('id', 'loginModal');
        startAutoSlide();
    }
});

// Cerrar modal con la tecla ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && loginModal.getAttribute('id') === 'active') {
        loginModal.setAttribute('id', 'loginModal');
        startAutoSlide();
    }
});

// Manejar el envío del formulario
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Obtener valores del formulario
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Aquí puedes agregar la lógica para procesar el inicio de sesión
    console.log('Intento de inicio de sesión:', { email, password });
    
    // Ejemplo: mostrar mensaje de éxito
    alert('¡Inicio de sesión exitoso! Email: ' + email);
    
    // Cerrar el modal
    loginModal.setAttribute('id', 'loginModal');
    startAutoSlide();
    
    // Limpiar el formulario
    loginForm.reset();
});