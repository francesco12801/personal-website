document.addEventListener('DOMContentLoaded', function() {
    initTypingEffect();
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('nav');
    
    if (!menuToggle || !nav) {
      console.error('Errore: elementi del menu mobile non trovati!');
      return;
    }
    
    console.log('Menu mobile trovato, inizializzazione...');
    
    // Aggiungi stili inline critici
    menuToggle.style.zIndex = '9999';
    menuToggle.style.position = 'relative';
    menuToggle.style.display = 'block';
    
    nav.style.transition = 'right 0.3s ease';
    
    // Correggi la gestione degli eventi di click
    menuToggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation(); // Previene la propagazione dell'evento
      
      console.log('Menu toggle cliccato');
      
      // Toggle della classe active
      if (nav.classList.contains('active')) {
        nav.classList.remove('active');
        menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
        console.log('Menu chiuso');
      } else {
        nav.classList.add('active');
        menuToggle.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        console.log('Menu aperto');
      }
    });
    
    // Aggiungi un listener per i click sui link di navigazione
    const navLinks = nav.querySelectorAll('a');
    navLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        nav.classList.remove('active');
        menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
        console.log('Menu chiuso dopo click su link');
      });
    });
    
    // Previeni la chiusura del menu quando si clicca dentro di esso
    nav.addEventListener('click', function(e) {
      e.stopPropagation();
    });
    
    // Chiudi il menu quando si clicca altrove nella pagina
    document.addEventListener('click', function() {
      if (nav.classList.contains('active')) {
        nav.classList.remove('active');
        menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
        console.log('Menu chiuso dopo click esterno');
      }
    });
    
    console.log('Menu mobile inizializzato con successo!');
  });
// Particle animation system for background
function initParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;
    
    // Create particles with random properties
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random size between 2px and 6px
        const size = Math.random() * 4 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random position
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Random color from accent colors
        const colors = ['#3b82f6', '#6366f1', '#8b5cf6'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        // Random animation duration between 15s and 30s
        const duration = Math.random() * 15 + 15;
        particle.style.animation = `float-particle ${duration}s infinite linear`;
        
        // Random delay so they don't all start at the same time
        particle.style.animationDelay = `${Math.random() * 10}s`;
        
        particlesContainer.appendChild(particle);
    }
    
    // Add mouse interaction with particles
    document.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        const particles = document.querySelectorAll('.particle');
        particles.forEach(particle => {
            const rect = particle.getBoundingClientRect();
            const particleX = rect.left + rect.width / 2;
            const particleY = rect.top + rect.height / 2;
            
            const distX = mouseX - particleX;
            const distY = mouseY - particleY;
            const distance = Math.sqrt(distX * distX + distY * distY);
            
            if (distance < 100) {
                // Calculate repulsion force
                const force = 100 / distance;
                const directionX = distX / distance;
                const directionY = distY / distance;
                
                // Apply temporary transform to create "push" effect
                particle.style.transform = `translate(${-directionX * force * 5}px, ${-directionY * force * 5}px)`;
                
                // Reset after animation
                setTimeout(() => {
                    particle.style.transform = '';
                }, 500);
            }
        });
    });
}

function initHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}
// Typing effect for the hero section
function initTypingEffect() {
    const typeText = document.getElementById('type-text');
    if (!typeText) return;
    
    const phrases = ['Francesco', 'a Developer', 'a Designer', 'an Innovator'];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            // Remove a character
            typeText.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            // Add a character
            typeText.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }
        
        // Speed control
        let typeSpeed = isDeleting ? 50 : 100;
        
        // If complete, pause then start deleting
        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typeSpeed = 1000; // Pause at the end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500; // Pause before typing new word
        }
        
        setTimeout(type, typeSpeed);
    }
    
    // Start the typing animation
    setTimeout(type, 1000);
}

// Scroll reveal animation for sections
function initScrollReveal() {
    const sections = document.querySelectorAll('section');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });
    
    // Add CSS class for revealed sections
    document.head.insertAdjacentHTML('beforeend', `
        <style>
            section.reveal {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        </style>
    `);
}

// Hover effects for skill tags
function initSkillHover() {
    const skillTags = document.querySelectorAll('.skill-tag');
    
    skillTags.forEach(tag => {
        // Create ripple effect on hover
        tag.addEventListener('mouseenter', function(e) {
            const ripple = document.createElement('span');
            ripple.classList.add('skill-ripple');
            
            // Apply styles for ripple
            ripple.style.position = 'absolute';
            ripple.style.width = '100%';
            ripple.style.height = '100%';
            ripple.style.top = '0';
            ripple.style.left = '0';
            ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            ripple.style.borderRadius = 'inherit';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple-effect 0.6s linear';
            ripple.style.zIndex = '-1';
            
            // Add animation keyframes
            if (!document.querySelector('#ripple-keyframes')) {
                const style = document.createElement('style');
                style.id = 'ripple-keyframes';
                style.textContent = `
                    @keyframes ripple-effect {
                        0% { transform: scale(0); opacity: 1; }
                        100% { transform: scale(2.5); opacity: 0; }
                    }
                `;
                document.head.appendChild(style);
            }
            
            // Set position relative for proper absolute positioning of ripple
            if (window.getComputedStyle(tag).position !== 'relative') {
                tag.style.position = 'relative';
            }
            
            // Add ripple to the tag
            tag.appendChild(ripple);
            
            // Remove after animation completes
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
        
        // Add glowing effect
        tag.addEventListener('mouseover', function() {
            tag.style.boxShadow = '0 0 15px rgba(99, 102, 241, 0.5)';
        });
        
        tag.addEventListener('mouseout', function() {
            tag.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        });
    });
}

function initBackToTop() {
    const backToTop = document.getElementById('back-to-top');
    if (!backToTop) return;

    // Show button when user has scrolled down
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    });

    // Scroll to top when clicked
    backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}


function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('nav');
    
    if (!menuToggle || !nav) {
        console.error('Menu mobile: elementi non trovati');
        return;
    }
    
    console.log('Menu mobile inizializzato');
    
    // Assicurati che il pulsante abbia l'icona corretta all'inizio
    if (!menuToggle.querySelector('i')) {
        menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    }
    
    menuToggle.addEventListener('click', function(e) {
        e.preventDefault(); // Previene comportamenti indesiderati
        console.log('Menu toggle cliccato');
        
        // Toggle della classe active
        nav.classList.toggle('active');
        
        // Aggiorna l'icona
        menuToggle.innerHTML = nav.classList.contains('active')
            ? '<i class="fa-solid fa-xmark"></i>'
            : '<i class="fa-solid fa-bars"></i>';
        
        console.log('Stato menu:', nav.classList.contains('active'));
    });
    
    // Chiudi menu quando si clicca su link
    const navLinks = document.querySelectorAll('nav ul li a');
    
    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
        });
    });
    
    // Chiudi menu quando si clicca fuori
    document.addEventListener('click', (e) => {
        // Se il menu è aperto e il click non è sul menu o sul pulsante toggle
        if (
            nav.classList.contains('active') && 
            !nav.contains(e.target) && 
            e.target !== menuToggle &&
            !menuToggle.contains(e.target)
        ) {
            nav.classList.remove('active');
            menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
        }
    });
}
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    themeToggle.addEventListener('click', () => {
        themeToggle.innerHTML = themeToggle.innerHTML.includes('moon')
            ? '<i class="fa-solid fa-sun"></i>'
            : '<i class="fa-solid fa-moon"></i>';

        // Show a notification
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.padding = '15px 20px';
        notification.style.background = 'var(--accent-primary)';
        notification.style.color = 'white';
        notification.style.borderRadius = 'var(--border-radius)';
        notification.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
        notification.style.zIndex = '1000';
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        notification.style.transition = 'all 0.3s ease';
        notification.textContent =
            'Dark mode is the only available theme for this website.';

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 100);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    });
}
// 3D tilt effect for images
function initTiltEffect() {
    const tiltElements = document.querySelectorAll('.hero-img-container, .about-image');
    
    tiltElements.forEach(el => {
        el.addEventListener('mousemove', function(e) {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const xPercent = x / rect.width;
            const yPercent = y / rect.height;
            
            // Calculate tilt angles (max 15 degrees)
            const tiltX = (0.5 - yPercent) * 15;
            const tiltY = (xPercent - 0.5) * 15;
            
            // Apply transform
            el.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
            
            // Add shine effect
            const shine = el.querySelector('.shine') || document.createElement('div');
            if (!el.querySelector('.shine')) {
                shine.classList.add('shine');
                shine.style.position = 'absolute';
                shine.style.top = '0';
                shine.style.left = '0';
                shine.style.right = '0';
                shine.style.bottom = '0';
                shine.style.background = 'linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%)';
                shine.style.transform = 'translateZ(1px)';
                shine.style.pointerEvents = 'none';
                shine.style.borderRadius = 'inherit';
                shine.style.zIndex = '10';
                el.appendChild(shine);
            }
            
            // Position the shine effect based on mouse
            shine.style.opacity = '0.2';
            shine.style.backgroundPosition = `${x / 5 + y / 5}% ${y / 5 + x / 5}%`;
        });
        
        el.addEventListener('mouseleave', function() {
            // Reset transform on mouse leave
            el.style.transform = '';
            
            // Remove or hide shine effect
            const shine = el.querySelector('.shine');
            if (shine) {
                shine.style.opacity = '0';
            }
        });
    });
}

// Add smooth scrolling for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Skip for non-anchor links
        if (href === '#') return;
        
        // Prevent default behavior
        e.preventDefault();
        
        // Get target element
        const target = document.querySelector(href);
        
        // Scroll to target
        if (target) {
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Effetto mini-gioco in stile hacker/retro
function addNerdyGameEffect() {
    // Crea il pulsante per attivare l'effetto
    const gameBtn = document.createElement('button');
    gameBtn.id = 'game-toggle';
    gameBtn.innerHTML = '<i class="fa-solid fa-gamepad"></i>';
    gameBtn.style.position = 'fixed';
    gameBtn.style.bottom = '30px';
    gameBtn.style.right = '30px';
    gameBtn.style.zIndex = '100';
    gameBtn.style.width = '50px';
    gameBtn.style.height = '50px';
    gameBtn.style.borderRadius = '50%';
    gameBtn.style.background = 'linear-gradient(135deg, #3b82f6, #8b5cf6)';
    gameBtn.style.color = 'white';
    gameBtn.style.border = 'none';
    gameBtn.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
    gameBtn.style.cursor = 'pointer';
    gameBtn.style.display = 'flex';
    gameBtn.style.alignItems = 'center';
    gameBtn.style.justifyContent = 'center';
    gameBtn.style.fontSize = '1.2rem';
    gameBtn.style.transition = 'all 0.3s ease';
    
    document.body.appendChild(gameBtn);
    
    // Crea il container per il gioco
    const gameContainer = document.createElement('div');
    gameContainer.id = 'game-container';
    gameContainer.style.position = 'fixed';
    gameContainer.style.top = '0';
    gameContainer.style.left = '0';
    gameContainer.style.width = '100%';
    gameContainer.style.height = '100%';
    gameContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
    gameContainer.style.zIndex = '-1';
    gameContainer.style.opacity = '0';
    gameContainer.style.transition = 'opacity 0.5s ease';
    gameContainer.style.display = 'flex';
    gameContainer.style.flexDirection = 'column';
    gameContainer.style.alignItems = 'center';
    gameContainer.style.justifyContent = 'center';
    gameContainer.style.color = '#4ade80';
    gameContainer.style.fontFamily = "'Courier New', monospace";
    gameContainer.style.overflow = 'hidden';
    gameContainer.style.userSelect = 'none';
    
    // Aggiungi interfaccia del gioco
    gameContainer.innerHTML = `
        <div class="game-header" style="margin-bottom: 20px; font-size: 1.5rem; text-align: center;">
            <div style="font-size: 2rem; margin-bottom: 10px;"><i class="fa-solid fa-terminal"></i> CODE BREAKER</div>
            <div>Use arrow keys to navigate. Collect good code (green), avoid bugs (red).</div>
            <div style="margin-top: 10px;">SCORE: <span id="game-score">0</span> | LEVEL: <span id="game-level">1</span> | BUGS: <span id="bugs-count">0</span>/3</div>
        </div>
        <canvas id="game-canvas" width="800" height="500" style="border: 2px solid #4ade80; background-color: #0f172a;"></canvas>
        <div class="game-footer" style="margin-top: 20px; font-size: 0.9rem; opacity: 0.7;">Press ESC to exit | WASD or Arrow keys to move</div>
    `;
    
    document.body.appendChild(gameContainer);
    
    // Variabili di gioco
    let gameActive = false;
    let gameLoop;
    let player = {
        x: 400,
        y: 250,
        size: 20,
        speed: 5,
        score: 0,
        level: 1,
        bugs: 0
    };
    
    let goodCodes = [];
    let badCodes = [];
    let powers = [];
    let lastPowerTime = 0;
    let codeIcons = ['<>', '{}', '()', '[]', '/*', '*/', '//'];
    let bugIcons = ['🐛', '⚠️', '💥', '🔴', '❌'];
    let powerIcons = ['⚡', '🔄', '🛡️', '🔋'];
    
    // Inizializza Game Audio
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    function playTone(frequency, duration, type = 'sine') {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = type;
        oscillator.frequency.value = frequency;
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        const now = audioContext.currentTime;
        gainNode.gain.setValueAtTime(0.2, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);
        
        oscillator.start(now);
        oscillator.stop(now + duration);
    }
    
    function playCollectSound() {
        playTone(800, 0.1, 'sine');
        setTimeout(() => playTone(1200, 0.1, 'sine'), 100);
    }
    
    function playBugSound() {
        playTone(300, 0.2, 'sawtooth');
        setTimeout(() => playTone(200, 0.3, 'sawtooth'), 200);
    }
    
    function playPowerSound() {
        playTone(600, 0.1, 'square');
        setTimeout(() => playTone(800, 0.1, 'square'), 100);
        setTimeout(() => playTone(1000, 0.1, 'square'), 200);
    }
    
    // Funzioni di gioco
    function startGame() {
        const canvas = document.getElementById('game-canvas');
        const ctx = canvas.getContext('2d');
        
        // Adatta il canvas alle dimensioni della finestra
        canvas.width = Math.min(800, window.innerWidth - 40);
        canvas.height = Math.min(500, window.innerHeight - 200);
        
        // Reset del gioco
        player.x = canvas.width / 2;
        player.y = canvas.height / 2;
        player.score = 0;
        player.level = 1;
        player.bugs = 0;
        player.speed = 5;
        
        goodCodes = [];
        badCodes = [];
        powers = [];
        
        // Aggiungi i primi oggetti
        for (let i = 0; i < 5; i++) {
            spawnGoodCode(canvas);
        }
        
        for (let i = 0; i < 2; i++) {
            spawnBadCode(canvas);
        }
        
        // Variabili di controllo
        let keys = {
            up: false,
            down: false,
            left: false,
            right: false
        };
        
        // Event listeners per i tasti
        window.addEventListener('keydown', function(e) {
            if (!gameActive) return;
            
            switch(e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    keys.up = true;
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    keys.down = true;
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    keys.left = true;
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    keys.right = true;
                    break;
                case 'Escape':
                    stopGame();
                    break;
            }
        });
        
        window.addEventListener('keyup', function(e) {
            switch(e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    keys.up = false;
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    keys.down = false;
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    keys.left = false;
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    keys.right = false;
                    break;
            }
        });
        
        // Loop principale del gioco
        gameLoop = setInterval(() => {
            // Movimento del giocatore
            if (keys.up && player.y > 0) player.y -= player.speed;
            if (keys.down && player.y < canvas.height - player.size) player.y += player.speed;
            if (keys.left && player.x > 0) player.x -= player.speed;
            if (keys.right && player.x < canvas.width - player.size) player.x += player.speed;
            
            // Spawna nuovi elementi periodicamente
            if (Math.random() < 0.02) spawnGoodCode(canvas);
            if (Math.random() < 0.01) spawnBadCode(canvas);
            
            // Power-ups occasionali
            if (Date.now() - lastPowerTime > 10000 && Math.random() < 0.005) {
                spawnPower(canvas);
                lastPowerTime = Date.now();
            }
            
            // Aggiorna posizione degli elementi
            moveElements();
            
            // Controlla collisioni
            checkCollisions(canvas);
            
            // Aggiorna la UI
            updateUI();
            
            // Pulisci e ridisegna il canvas
            draw(ctx, canvas);
            
            // Controlla se il gioco è finito
            if (player.bugs >= 3) {
                gameOver(ctx, canvas);
            }
        }, 1000 / 60); // 60 FPS
    }
    
    function spawnGoodCode(canvas) {
        goodCodes.push({
            x: Math.random() * (canvas.width - 30),
            y: Math.random() * (canvas.height - 30),
            size: 20,
            speedX: (Math.random() - 0.5) * 2,
            speedY: (Math.random() - 0.5) * 2,
            icon: codeIcons[Math.floor(Math.random() * codeIcons.length)]
        });
    }
    
    function spawnBadCode(canvas) {
        badCodes.push({
            x: Math.random() * (canvas.width - 30),
            y: Math.random() * (canvas.height - 30),
            size: 20,
            speedX: (Math.random() - 0.5) * 4,
            speedY: (Math.random() - 0.5) * 4,
            icon: bugIcons[Math.floor(Math.random() * bugIcons.length)]
        });
    }
    
    function spawnPower(canvas) {
        powers.push({
            x: Math.random() * (canvas.width - 30),
            y: Math.random() * (canvas.height - 30),
            size: 20,
            speedX: (Math.random() - 0.5) * 3,
            speedY: (Math.random() - 0.5) * 3,
            icon: powerIcons[Math.floor(Math.random() * powerIcons.length)],
            type: Math.floor(Math.random() * 4) // 0: Speed, 1: Clear bugs, 2: Shield, 3: Clear screen
        });
    }
    
    function moveElements() {
        // Muovi i codici buoni
        goodCodes.forEach(code => {
            code.x += code.speedX;
            code.y += code.speedY;
            
            // Rimbalza dalle pareti
            if (code.x <= 0 || code.x >= 800 - code.size) {
                code.speedX *= -1;
            }
            if (code.y <= 0 || code.y >= 500 - code.size) {
                code.speedY *= -1;
            }
        });
        
        // Muovi i codici cattivi
        badCodes.forEach(bug => {
            bug.x += bug.speedX;
            bug.y += bug.speedY;
            
            // Rimbalza dalle pareti
            if (bug.x <= 0 || bug.x >= 800 - bug.size) {
                bug.speedX *= -1;
            }
            if (bug.y <= 0 || bug.y >= 500 - bug.size) {
                bug.speedY *= -1;
            }
        });
        
        // Muovi i power-ups
        powers.forEach(power => {
            power.x += power.speedX;
            power.y += power.speedY;
            
            // Rimbalza dalle pareti
            if (power.x <= 0 || power.x >= 800 - power.size) {
                power.speedX *= -1;
            }
            if (power.y <= 0 || power.y >= 500 - power.size) {
                power.speedY *= -1;
            }
        });
    }
    
    function checkCollisions(canvas) {
        // Controlla collisioni con i codici buoni
        for (let i = goodCodes.length - 1; i >= 0; i--) {
            if (
                player.x < goodCodes[i].x + goodCodes[i].size &&
                player.x + player.size > goodCodes[i].x &&
                player.y < goodCodes[i].y + goodCodes[i].size &&
                player.y + player.size > goodCodes[i].y
            ) {
                // Collisione! Raccogli il codice
                player.score += 10;
                playCollectSound();
                
                // Rimuovi il codice raccolto
                goodCodes.splice(i, 1);
                
                // Aggiungi più codici quando il punteggio raggiunge soglie
                if (player.score % 50 === 0) {
                    player.level++;
                    // Aggiungi più buoni e cattivi con l'aumentare del livello
                    for (let j = 0; j < 2; j++) {
                        spawnGoodCode(canvas);
                    }
                    spawnBadCode(canvas);
                }
            }
        }
        
        // Controlla collisioni con i codici cattivi
        for (let i = badCodes.length - 1; i >= 0; i--) {
            if (
                player.x < badCodes[i].x + badCodes[i].size &&
                player.x + player.size > badCodes[i].x &&
                player.y < badCodes[i].y + badCodes[i].size &&
                player.y + player.size > badCodes[i].y
            ) {
                // Collisione! Bug trovato
                player.bugs++;
                playBugSound();
                
                // Rimuovi il bug
                badCodes.splice(i, 1);
                
                // Aggiungi un nuovo bug
                spawnBadCode(canvas);
            }
        }
        
        // Controlla collisioni con i power-ups
        for (let i = powers.length - 1; i >= 0; i--) {
            if (
                player.x < powers[i].x + powers[i].size &&
                player.x + player.size > powers[i].x &&
                player.y < powers[i].y + powers[i].size &&
                player.y + player.size > powers[i].y
            ) {
                // Collisione! Attiva power-up
                playPowerSound();
                
                switch(powers[i].type) {
                    case 0: // Velocità
                        player.speed += 2;
                        setTimeout(() => player.speed = Math.max(5, player.speed - 2), 5000);
                        break;
                    case 1: // Rimuovi bug
                        player.bugs = Math.max(0, player.bugs - 1);
                        break;
                    case 2: // Scudo (rimuovi tutti i bug dallo schermo)
                        badCodes = [];
                        setTimeout(() => {
                            for (let j = 0; j < 2 + player.level; j++) {
                                spawnBadCode(canvas);
                            }
                        }, 2000);
                        break;
                    case 3: // Rimuovi tutto dallo schermo
                        goodCodes = [];
                        badCodes = [];
                        setTimeout(() => {
                            for (let j = 0; j < 5; j++) {
                                spawnGoodCode(canvas);
                            }
                            for (let j = 0; j < 2; j++) {
                                spawnBadCode(canvas);
                            }
                        }, 1000);
                        break;
                }
                
                // Rimuovi il power-up
                powers.splice(i, 1);
            }
        }
    }
    
    function updateUI() {
        document.getElementById('game-score').textContent = player.score;
        document.getElementById('game-level').textContent = player.level;
        document.getElementById('bugs-count').textContent = player.bugs;
    }
    
    function draw(ctx, canvas) {
        // Pulisci il canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Disegna sfondo a griglia (stile "Tron" o reticolo cibernetico)
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.2)';
        ctx.lineWidth = 1;
        
        // Griglia orizzontale
        for (let i = 0; i < canvas.height; i += 30) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(canvas.width, i);
            ctx.stroke();
        }
        
        // Griglia verticale
        for (let i = 0; i < canvas.width; i += 30) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height);
            ctx.stroke();
        }
        
        // Disegna il giocatore
        ctx.fillStyle = '#4ade80';
        ctx.font = '20px monospace';
        ctx.fillText('👨‍💻', player.x, player.y + 20);
        
        // Disegna i codici buoni
        ctx.fillStyle = '#4ade80'; // verde
        goodCodes.forEach(code => {
            ctx.font = '16px monospace';
            ctx.fillText(code.icon, code.x, code.y + 16);
        });
        
        // Disegna i codici cattivi
        ctx.fillStyle = '#ef4444'; // rosso
        badCodes.forEach(bug => {
            ctx.font = '18px monospace';
            ctx.fillText(bug.icon, bug.x, bug.y + 18);
        });
        
        // Disegna i power-ups
        ctx.fillStyle = '#f59e0b'; // ambra
        powers.forEach(power => {
            ctx.font = '18px monospace';
            ctx.fillText(power.icon, power.x, power.y + 18);
        });
    }
    
    function gameOver(ctx, canvas) {
        clearInterval(gameLoop);
        
        // Messaggi finali
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#ef4444';
        ctx.font = '36px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 50);
        
        ctx.fillStyle = '#4ade80';
        ctx.font = '24px monospace';
        ctx.fillText(`FINAL SCORE: ${player.score}`, canvas.width / 2, canvas.height / 2);
        ctx.fillText(`LEVEL REACHED: ${player.level}`, canvas.width / 2, canvas.height / 2 + 40);
        
        ctx.font = '18px monospace';
        ctx.fillText('Press SPACE to play again', canvas.width / 2, canvas.height / 2 + 80);
        ctx.fillText('Press ESC to exit', canvas.width / 2, canvas.height / 2 + 110);
        
        // Listener per riavviare o uscire
        const restartListener = function(e) {
            if (e.key === ' ') {
                window.removeEventListener('keydown', restartListener);
                startGame();
            } else if (e.key === 'Escape') {
                window.removeEventListener('keydown', restartListener);
                stopGame();
            }
        };
        
        window.addEventListener('keydown', restartListener);
    }
    
    function stopGame() {
        clearInterval(gameLoop);
        gameActive = false;
        
        // Nascondi il container del gioco
        gameContainer.style.opacity = '0';
        gameContainer.style.zIndex = '-1';
        
        // Ripristina il pulsante
        gameBtn.innerHTML = '<i class="fa-solid fa-gamepad"></i>';
        gameBtn.style.background = 'linear-gradient(135deg, #3b82f6, #8b5cf6)';
    }
    
    // Toggle del gioco
    gameBtn.addEventListener('click', function() {
        gameActive = !gameActive;
        
        if (gameActive) {
            // Mostra il container del gioco
            gameContainer.style.zIndex = '999';
            gameContainer.style.opacity = '1';
            
            // Cambia l'icona del pulsante
            gameBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
            gameBtn.style.background = 'linear-gradient(135deg, #ef4444, #f97316)';
            
            // Inizia il gioco
            startGame();
        } else {
            stopGame();
        }
    });
    
    // Gestisci il ridimensionamento della finestra
    window.addEventListener('resize', function() {
        if (gameActive) {
            const canvas = document.getElementById('game-canvas');
            if (canvas) {
                canvas.width = Math.min(800, window.innerWidth - 40);
                canvas.height = Math.min(500, window.innerHeight - 200);
            }
        }
    });
}

// Sostituisci la chiamata alla funzione Matrix con la nuova funzione
// addMatrixEffect();
// E aggiungi questo:
addNerdyGameEffect();

// Add 3D cube navigation effect
function add3DCubeNav() {
    // Create a container for the 3D cube
    const cubeContainer = document.createElement('div');
    cubeContainer.className = 'cube-container';
    cubeContainer.style.position = 'fixed';
    cubeContainer.style.top = '50%';
    cubeContainer.style.right = '20px';
    cubeContainer.style.transform = 'translateY(-50%)';
    cubeContainer.style.width = '60px';
    cubeContainer.style.height = '60px';
    cubeContainer.style.perspective = '500px';
    cubeContainer.style.zIndex = '100';
    cubeContainer.style.display = 'none'; // Initially hidden, shown on scroll
    
    // Create the cube
    const cube = document.createElement('div');
    cube.className = 'cube';
    cube.style.width = '100%';
    cube.style.height = '100%';
    cube.style.position = 'relative';
    cube.style.transformStyle = 'preserve-3d';
    cube.style.transition = 'transform 0.5s ease';
    cubeContainer.appendChild(cube);
    
    // Create the cube faces
    const sections = ['home', 'about']; // Add more sections as needed
    const faces = ['front', 'right', 'back', 'left', 'top', 'bottom'];
    const icons = ['fa-house', 'fa-user']; // Add more icons matching sections
    
    faces.forEach((face, index) => {
        const cubeFace = document.createElement('div');
        cubeFace.className = `cube-face cube-face-${face}`;
        cubeFace.style.position = 'absolute';
        cubeFace.style.width = '100%';
        cubeFace.style.height = '100%';
        cubeFace.style.display = 'flex';
        cubeFace.style.alignItems = 'center';
        cubeFace.style.justifyContent = 'center';
        cubeFace.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(139, 92, 246, 0.8))';
        cubeFace.style.border = '1px solid rgba(255, 255, 255, 0.2)';
        cubeFace.style.borderRadius = '10px';
        cubeFace.style.boxShadow = 'inset 0 0 10px rgba(255, 255, 255, 0.2)';
        cubeFace.style.backdropFilter = 'blur(5px)';
        
        // Position the faces
        switch(face) {
            case 'front':
                cubeFace.style.transform = 'translateZ(30px)';
                if (icons[0]) {
                    cubeFace.innerHTML = `<i class="fa-solid ${icons[0]}"></i>`;
                    cubeFace.setAttribute('data-section', sections[0] || '');
                }
                break;
            case 'right':
                cubeFace.style.transform = 'rotateY(90deg) translateZ(30px)';
                if (icons[1]) {
                    cubeFace.innerHTML = `<i class="fa-solid ${icons[1]}"></i>`;
                    cubeFace.setAttribute('data-section', sections[1] || '');
                }
                break;
            case 'back':
                cubeFace.style.transform = 'rotateY(180deg) translateZ(30px)';
                break;
            case 'left':
                cubeFace.style.transform = 'rotateY(-90deg) translateZ(30px)';
                break;
            case 'top':
                cubeFace.style.transform = 'rotateX(90deg) translateZ(30px)';
                break;
            case 'bottom':
                cubeFace.style.transform = 'rotateX(-90deg) translateZ(30px)';
                break;
        }
        
        // Style for icons
        cubeFace.style.color = 'white';
        cubeFace.style.fontSize = '1.5rem';
        cubeFace.style.cursor = 'pointer';
        
        cube.appendChild(cubeFace);
    });
    
    document.body.appendChild(cubeContainer);
    
    // Add functionality
    let currentRotation = 0;
    
    // Handle cube face clicks
    document.querySelectorAll('.cube-face').forEach(face => {
        face.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            if (section) {
                const targetElement = document.getElementById(section);
                if (targetElement) {
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Rotate cube on scroll
    window.addEventListener('scroll', function() {
        const scrollProgress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
        currentRotation = scrollProgress * 360 * 2; // Multiple rotations based on scroll
        
        cube.style.transform = `rotateY(${currentRotation}deg)`;
        
        // Show cube after scrolling down a bit
        if (window.scrollY > 300) {
            cubeContainer.style.display = 'block';
        } else {
            cubeContainer.style.display = 'none';
        }
    });
    
    // Add hover effect
    cubeContainer.addEventListener('mouseenter', function() {
        cube.style.transform = `rotateY(${currentRotation}deg) scale(1.1)`;
    });
    
    cubeContainer.addEventListener('mouseleave', function() {
        cube.style.transform = `rotateY(${currentRotation}deg) scale(1)`;
    });
}

// Initialize the 3D cube navigation
add3DCubeNav();