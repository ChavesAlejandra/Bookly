'use strict';

// ── Carrusel ───────────────────────────────────────────────────────────────────
const slides     = document.querySelectorAll('.carouselContainer__slide');
const indicators = document.querySelectorAll('.carouselContainer__indicators__indicator');
const prevBtn    = document.getElementById('prevBtn');
const nextBtn    = document.getElementById('nextBtn');
const carousel   = document.querySelector('.carouselContainer');

let currentSlide = 0;
let autoSlide;
const SLIDE_INTERVAL = 15000;

function showSlide(index) {
    if (index >= slides.length) currentSlide = 0;
    else if (index < 0)          currentSlide = slides.length - 1;
    else                          currentSlide = index;

    slides.forEach(s => s.removeAttribute('id'));
    indicators.forEach(i => i.removeAttribute('id'));

    // Restaurar id original reverse en los slides que lo tenían
    const reverseSlides = [1, 3, 5, 7];
    slides.forEach((s, i) => {
        if (reverseSlides.includes(i)) s.id = 'reverse';
    });

    slides[currentSlide].id = 'active';
    indicators[currentSlide].id = 'active';
}

function nextSlide()  { showSlide(currentSlide + 1); }
function prevSlide()  { showSlide(currentSlide - 1); }
function startAuto()  { autoSlide = setInterval(nextSlide, SLIDE_INTERVAL); }
function stopAuto()   { clearInterval(autoSlide); }
function resetAuto()  { stopAuto(); startAuto(); }

prevBtn.addEventListener('click', () => { prevSlide(); resetAuto(); });
nextBtn.addEventListener('click', () => { nextSlide(); resetAuto(); });

indicators.forEach(ind => {
    ind.addEventListener('click', () => {
        showSlide(parseInt(ind.dataset.slide));
        resetAuto();
    });
});

carousel.addEventListener('mouseenter', stopAuto);
carousel.addEventListener('mouseleave', startAuto);

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  { prevSlide(); resetAuto(); }
    if (e.key === 'ArrowRight') { nextSlide(); resetAuto(); }
});

// ── Modales ────────────────────────────────────────────────────────────────────
const loginPopUp        = document.getElementById('loginPopUp');
const signUpPopUp       = document.getElementById('signUpPopUp');
const closeLoginModal   = document.getElementById('closeLoginModal');
const closeSignupModal  = document.getElementById('closeSignupModal');
const openSignupFromLogin  = document.getElementById('openSignupFromLogin');
const openLoginFromSignup  = document.getElementById('openLoginFromSignup');
const loginError        = document.getElementById('loginError');
const signupError       = document.getElementById('signupError');

function openLogin()  { loginPopUp.id  = 'active'; stopAuto(); }
function closeLogin() { loginPopUp.id  = 'loginPopUp'; startAuto(); loginError.textContent = ''; }
function openSignup() { signUpPopUp.id = 'active'; stopAuto(); }
function closeSignup(){ signUpPopUp.id = 'signUpPopUp'; startAuto(); signupError.textContent = ''; }

// Botones "Iniciar Sesión" del carrusel
document.querySelectorAll('.login-btn').forEach(btn => {
    btn.addEventListener('click', openLogin);
});

closeLoginModal.addEventListener('click', closeLogin);
closeSignupModal.addEventListener('click', closeSignup);

loginPopUp.addEventListener('click',  e => { if (e.target === loginPopUp)  closeLogin(); });
signUpPopUp.addEventListener('click', e => { if (e.target === signUpPopUp) closeSignup(); });

openSignupFromLogin.addEventListener('click', e => {
    e.preventDefault(); closeLogin(); setTimeout(openSignup, 300);
});
openLoginFromSignup.addEventListener('click', e => {
    e.preventDefault(); closeSignup(); setTimeout(openLogin, 300);
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        if (loginPopUp.id === 'active')  closeLogin();
        if (signUpPopUp.id === 'active') closeSignup();
    }
});

// ── Login fetch ────────────────────────────────────────────────────────────────
document.getElementById('loginForm').addEventListener('submit', async e => {
    e.preventDefault();
    loginError.textContent = '';

    const formData = new FormData(e.target);
    formData.append('accion', 'login');

    try {
        const res  = await fetch('../php/auth.php', { method: 'POST', body: formData });
        const data = await res.json();

        if (data.ok) {
            window.location.href = 'principal.php';
        } else {
            loginError.textContent = data.mensaje;
        }
    } catch {
        loginError.textContent = 'Error de conexión. Inténtalo de nuevo.';
    }
});

// ── Registro fetch ─────────────────────────────────────────────────────────────
document.getElementById('signupForm').addEventListener('submit', async e => {
    e.preventDefault();
    signupError.textContent = '';

    const formData = new FormData(e.target);
    formData.append('accion', 'registro');

    try {
        const res  = await fetch('../php/auth.php', { method: 'POST', body: formData });
        const data = await res.json();

        if (data.ok) {
            window.location.href = 'principal.php';
        } else {
            signupError.textContent = data.mensaje;
        }
    } catch {
        signupError.textContent = 'Error de conexión. Inténtalo de nuevo.';
    }
});

// ── Arrancar carrusel ──────────────────────────────────────────────────────────
startAuto();
