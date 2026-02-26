class TinderBooks {
    constructor() {
        this.currentCard = null;
        this.cards = [];
        this.startX = 0;
        this.startY = 0;
        this.currentX = 0;
        this.currentY = 0;
        this.isDragging = false;
        this.likedBooks = [];
        this.dislikedBooks = [];
        
        this.init();
    }

    init() {
        // Obtener todas las cartas
        this.cards = Array.from(document.querySelectorAll('.content__encuentra__libros__libro'));
        
        if (this.cards.length === 0) return;

        // Añadir clase tinder-mode a las flipCards
        this.cards.forEach(card => {
            const flipCard = card.querySelector('.content__encuentra__libros__libro__flipCard');
            if (flipCard) {
                flipCard.classList.add('tinder-mode');
            }
        });

        // Reorganizar las cartas en un contenedor stack
        this.createStack();
        
        // Crear controles
        this.createControls();
        
        // Añadir stamps de like/dislike a cada carta
        this.addStamps();
        
        // Inicializar primera carta
        this.setCurrentCard();
        
        // Event listeners para la carta actual
        this.attachCardEvents();
        
        // Crear estado vacío
        this.createEmptyState();
    }

    createStack() {
        const librosContainer = document.querySelector('.content__encuentra__libros');
        if (!librosContainer) return;

        // Crear contenedor stack
        const stack = document.createElement('div');
        stack.className = 'content__encuentra__libros__stack';
        
        // Mover todas las cartas al stack
        this.cards.forEach(card => {
            stack.appendChild(card);
        });
        
        librosContainer.innerHTML = '';
        librosContainer.appendChild(stack);
    }

    createControls() {
        const encuentraSection = document.querySelector('.content__encuentra');
        if (!encuentraSection) return;

        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'content__encuentra__controls';
        controlsDiv.innerHTML = `
            <button class="content__encuentra__controls__btn content__encuentra__controls__btn--dislike" id="dislikeBtn">
                ✕
            </button>
            <button class="content__encuentra__controls__btn content__encuentra__controls__btn--info" id="infoBtn">
                ℹ
            </button>
            <button class="content__encuentra__controls__btn content__encuentra__controls__btn--like" id="likeBtn">
                ♥
            </button>
        `;
        
        encuentraSection.appendChild(controlsDiv);

        // Event listeners para botones
        document.getElementById('dislikeBtn').addEventListener('click', () => this.reject());
        document.getElementById('likeBtn').addEventListener('click', () => this.accept());
        document.getElementById('infoBtn').addEventListener('click', () => this.showInfo());
    }

    addStamps() {
        this.cards.forEach(card => {
            const front = card.querySelector('.content__encuentra__libros__libro__flipCard__inner__front');
            if (front) {
                const likeStamp = document.createElement('div');
                likeStamp.className = 'content__encuentra__libros__libro__flipCard__inner__front__likeStamp';
                likeStamp.textContent = 'ME GUSTA';
                
                const nopeStamp = document.createElement('div');
                nopeStamp.className = 'content__encuentra__libros__libro__flipCard__inner__front__nopeStamp';
                nopeStamp.textContent = 'NO';
                
                front.appendChild(likeStamp);
                front.appendChild(nopeStamp);
            }
        });
    }

    createEmptyState() {
        const encuentraSection = document.querySelector('.content__encuentra');
        if (!encuentraSection) return;

        const emptyState = document.createElement('div');
        emptyState.className = 'content__encuentra__emptyState';
        emptyState.innerHTML = `
            <h2>¡No hay más libros!</h2>
            <p>Has revisado todas las recomendaciones disponibles</p>
            <button id="restartBtn">Volver a empezar</button>
        `;
        
        encuentraSection.appendChild(emptyState);

        document.getElementById('restartBtn').addEventListener('click', () => this.restart());
    }

    setCurrentCard() {
        this.currentCard = document.querySelector('.content__encuentra__libros__libro:first-child');
        if (this.currentCard) {
            this.attachCardEvents();
        } else {
            this.showEmptyState();
        }
    }

    attachCardEvents() {
        if (!this.currentCard) return;

        // Mouse events
        this.currentCard.addEventListener('mousedown', (e) => this.handleStart(e));
        document.addEventListener('mousemove', (e) => this.handleMove(e));
        document.addEventListener('mouseup', () => this.handleEnd());

        // Touch events
        this.currentCard.addEventListener('touchstart', (e) => this.handleStart(e));
        document.addEventListener('touchmove', (e) => this.handleMove(e));
        document.addEventListener('touchend', () => this.handleEnd());
    }

    handleStart(e) {
        if (!this.currentCard) return;
        
        this.isDragging = true;
        
        if (e.type === 'mousedown') {
            this.startX = e.clientX;
            this.startY = e.clientY;
        } else if (e.type === 'touchstart') {
            this.startX = e.touches[0].clientX;
            this.startY = e.touches[0].clientY;
        }
    }

    handleMove(e) {
        if (!this.isDragging || !this.currentCard) return;

        e.preventDefault();

        if (e.type === 'mousemove') {
            this.currentX = e.clientX;
            this.currentY = e.clientY;
        } else if (e.type === 'touchmove') {
            this.currentX = e.touches[0].clientX;
            this.currentY = e.touches[0].clientY;
        }

        const deltaX = this.currentX - this.startX;
        const deltaY = this.currentY - this.startY;
        const rotation = deltaX * 0.1;

        this.currentCard.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(${rotation}deg)`;
        this.currentCard.style.transition = 'none';

        // Mostrar stamps según dirección
        const likeStamp = this.currentCard.querySelector('.content__encuentra__libros__libro__flipCard__inner__front__likeStamp');
        const nopeStamp = this.currentCard.querySelector('.content__encuentra__libros__libro__flipCard__inner__front__nopeStamp');

        if (deltaX > 50) {
            if (likeStamp) likeStamp.style.opacity = Math.min(deltaX / 100, 1);
            if (nopeStamp) nopeStamp.style.opacity = 0;
            this.currentCard.classList.add('swiping-right');
            this.currentCard.classList.remove('swiping-left');
        } else if (deltaX < -50) {
            if (nopeStamp) nopeStamp.style.opacity = Math.min(Math.abs(deltaX) / 100, 1);
            if (likeStamp) likeStamp.style.opacity = 0;
            this.currentCard.classList.add('swiping-left');
            this.currentCard.classList.remove('swiping-right');
        } else {
            if (likeStamp) likeStamp.style.opacity = 0;
            if (nopeStamp) nopeStamp.style.opacity = 0;
            this.currentCard.classList.remove('swiping-right', 'swiping-left');
        }
    }

    handleEnd() {
        if (!this.isDragging || !this.currentCard) return;

        this.isDragging = false;
        const deltaX = this.currentX - this.startX;

        // Resetear stamps
        const likeStamp = this.currentCard.querySelector('.content__encuentra__libros__libro__flipCard__inner__front__likeStamp');
        const nopeStamp = this.currentCard.querySelector('.content__encuentra__libros__libro__flipCard__inner__front__nopeStamp');
        if (likeStamp) likeStamp.style.opacity = 0;
        if (nopeStamp) nopeStamp.style.opacity = 0;

        // Decidir acción según desplazamiento
        if (deltaX > 100) {
            this.accept();
        } else if (deltaX < -100) {
            this.reject();
        } else {
            // Volver a posición original
            this.currentCard.style.transform = '';
            this.currentCard.style.transition = 'transform 0.3s ease';
            this.currentCard.classList.remove('swiping-right', 'swiping-left');
        }
    }

    accept() {
        if (!this.currentCard) return;

        // Guardar en array de gustados
        const title = this.currentCard.querySelector('h3')?.textContent || 'Desconocido';
        this.likedBooks.push(title);
        console.log('✅ Me gusta:', title);

        this.currentCard.classList.add('swiped-right');
        this.removeCard();
    }

    reject() {
        if (!this.currentCard) return;

        // Guardar en array de rechazados
        const title = this.currentCard.querySelector('h3')?.textContent || 'Desconocido';
        this.dislikedBooks.push(title);
        console.log('❌ No me gusta:', title);

        this.currentCard.classList.add('swiped-left');
        this.removeCard();
    }

    showInfo() {
        if (!this.currentCard) return;

        const inner = this.currentCard.querySelector('.content__encuentra__libros__libro__flipCard__inner');
        if (inner) {
            if (inner.style.transform === 'rotateY(180deg)') {
                inner.style.transform = '';
            } else {
                inner.style.transform = 'rotateY(180deg)';
            }
        }
    }

    removeCard() {
        setTimeout(() => {
            if (this.currentCard) {
                this.currentCard.remove();
                this.currentCard = null;
                this.setCurrentCard();
            }
        }, 500);
    }

    showEmptyState() {
        const emptyState = document.querySelector('.content__encuentra__emptyState');
        const controls = document.querySelector('.content__encuentra__controls');
        
        if (emptyState) emptyState.classList.add('active');
        if (controls) controls.style.display = 'none';

        console.log('📚 Libros que te gustaron:', this.likedBooks);
        console.log('🚫 Libros rechazados:', this.dislikedBooks);
    }

    restart() {
        // Recargar la página o recargar las cartas
        location.reload();
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new TinderBooks();
});