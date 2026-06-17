document.addEventListener('DOMContentLoaded', () => {
    
    // --- EFECTO MOUSE: BRILLITOS (SPARKLES) ---
    document.addEventListener('mousemove', (e) => {
        if(Math.random() > 0.5) return;

        const sparkle = document.createElement('div');
        sparkle.classList.add('mouse-sparkle');
        
        sparkle.style.left = e.pageX + 'px';
        sparkle.style.top = e.pageY + 'px';
        
        const size = Math.random() * 4 + 4 + 'px';
        sparkle.style.width = size;
        sparkle.style.height = size;

        document.body.appendChild(sparkle);

        setTimeout(() => {
            sparkle.remove();
        }, 800);
    });

    // --- ELEMENTOS PRINCIPALES ---
    const enterScreen = document.getElementById('enter-screen');
    const enterBtn = document.getElementById('enter-btn');
    const mainLayout = document.getElementById('main-layout');
    const typingText = document.getElementById('typing-text');
    const audio = document.getElementById('audio');
    const vinyl = document.getElementById('vinyl');
    const playIcon = document.getElementById('play-icon');
    const progressBar = document.getElementById('progress-bar');

    // --- ENTRADA ---
    enterBtn.addEventListener('click', () => {
        playMusic(); 

        enterScreen.style.opacity = '0';
        
        setTimeout(() => {
            enterScreen.style.display = 'none';
            mainLayout.classList.remove('hidden-layout');
            
            setTimeout(() => {
                const navMenu = document.querySelector('.nav-menu');
                if(navMenu) navMenu.classList.add('animate-buttons');
            }, 300);

            initTypewriter();
        }, 800);
    });

    // --- MAQUINA DE ESCRIBIR ---
    const welcomeMsg = "It's a bad day, not a bad life. ";
    let typeWriterTimeout = null; 

    function initTypewriter() {
        if (typeWriterTimeout) clearTimeout(typeWriterTimeout);
        
        let i = 0;
        typingText.innerHTML = "";
        
        function type() {
            if (i < welcomeMsg.length) {
                typingText.innerHTML += welcomeMsg.charAt(i);
                i++;
                typeWriterTimeout = setTimeout(type, 50); 
            }
        }
        type();
    }

    // --- GESTIÓN DE MODALES ---
    window.openModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if(modal) {
            modal.classList.add('active');
            mainLayout.style.filter = "blur(10px) grayscale(20%)";
            mainLayout.style.transform = "scale(0.98)";
            
            if(modalId === 'modal-gallery') {
                setTimeout(() => {
                    updateGallery3D();
                }, 50);
            }
        }
    };

    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if(modal) modal.classList.remove('active');
        mainLayout.style.filter = "none";
        mainLayout.style.transform = "scale(1)";
    };
    
    window.onclick = (e) => {
        if (e.target.classList.contains('modal')) closeModal(e.target.id);
    };

    // --- GALERÍA 3D NUEVAS FOTOS ---
    const galleryImages = [
        "https://xatimg.com/image/u4994TVDa96D.jpg",
        "https://xatimg.com/image/e3gY1sqCo4sz.jpg",
        "https://xatimg.com/image/YbBKzI0qGdC0.jpg",
        "https://xatimg.com/image/7rRApMnsEpv1.jpg"
    ];
    
    const carouselTrack = document.getElementById('carousel-3d-track');
    let galleryIndex = 0; 

    if(carouselTrack) {
        carouselTrack.innerHTML = "";
        galleryImages.forEach((src, i) => {
            const card = document.createElement('div');
            card.className = 'card-3d-gold';
            card.innerHTML = `<img src="${src}" alt="Img ${i}" style="width:100%;height:100%;object-fit:contain;">`;
            
            card.onclick = () => { galleryIndex = i; updateGallery3D(); };
            carouselTrack.appendChild(card);
        });
    }

    window.updateGallery3D = () => {
        const cards = document.querySelectorAll('#carousel-3d-track .card-3d-gold');
        if(!cards.length) return;
        
        cards.forEach(c => c.classList.remove('active'));
        if(cards[galleryIndex]) cards[galleryIndex].classList.add('active');

        const container = document.querySelector('.gallery-container-3d');
        if(!container) return;
        
        const containerWidth = container.offsetWidth;
        const cardWidth = cards[0].offsetWidth; 
        const cardMargin = 40; 
        const fullCardSpace = cardWidth + cardMargin;

        const centerPosition = (containerWidth / 2) - (galleryIndex * fullCardSpace) - (cardWidth / 2) - 20;

        if(carouselTrack) carouselTrack.style.transform = `translateX(${centerPosition}px)`;
    };

    window.moveGallery = (dir) => {
        galleryIndex += dir;
        if(galleryIndex < 0) galleryIndex = galleryImages.length - 1;
        if(galleryIndex >= galleryImages.length) galleryIndex = 0;
        updateGallery3D();
    };

    // --- MÚSICA ---
    const playlist = [
        { 
            title: "'นารกนอยลงหนอย", 
            artist: "PERSES", 
            src: "audio/PERSES 'นารกนอยลงหนอย.mp3" 
        },
    ];
    let sIdx = 0; let isPlaying = false; let pInt;

    function loadMusic(i) {
        audio.src = playlist[i].src;
        document.getElementById('song-title').innerText = playlist[i].title;
        document.getElementById('song-artist').innerText = playlist[i].artist;
    }
    
    window.playMusic = () => {
        var playPromise = audio.play();

        if (playPromise !== undefined) {
            playPromise.then(_ => {
                isPlaying = true;
                vinyl.classList.add('vinyl-spin');
                playIcon.className = "fas fa-pause";
                
                if(pInt) clearInterval(pInt);
                pInt = setInterval(() => {
                    if(audio.duration) {
                        progressBar.style.width = (audio.currentTime/audio.duration)*100 + "%";
                    }
                }, 100);
            })
            .catch(error => {
                console.log("Error al reproducir música: ", error);
            });
        }
    };
    
    window.togglePlay = () => {
        if(isPlaying) {
            audio.pause(); isPlaying = false;
            vinyl.classList.remove('vinyl-spin');
            playIcon.className = "fas fa-play";
            clearInterval(pInt);
        } else {
            playMusic();
        }
    };
    
    window.nextSong = () => { sIdx=(sIdx+1)%playlist.length; loadMusic(sIdx); playMusic(); };
    window.prevSong = () => { sIdx=(sIdx-1+playlist.length)%playlist.length; loadMusic(sIdx); playMusic(); };
    
    loadMusic(0);

    window.addEventListener('resize', () => {
        updateGallery3D();
    });

    // --- BLOQUEAR INSPECCIONAR Y BOTÓN DERECHO ---
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'F12' || e.keyCode === 123) {
            e.preventDefault();
            return false;
        }
        if (e.ctrlKey && e.shiftKey && 
           (e.key === 'I' || e.key === 'J' || e.key === 'C' || e.key === 'i' || e.key === 'j' || e.key === 'c')) {
            e.preventDefault();
            return false;
        }
        if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) {
            e.preventDefault();
            return false;
        }
    });
});