document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA DA ANIMAÇÃO AO ROLAR (SCROLL REVEAL) ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.1 });
    animatedElements.forEach(element => { observer.observe(element); });

    // --- LÓGICA DO MINI PLAYER DE MÚSICA (SEM ALTERAÇÕES) ---
    // (Todo o código do player continua aqui, igual ao anterior)
    const audioPlayer = document.getElementById('audio-player');
    const playPauseBtn = document.querySelector('.play-pause-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const progressBar = document.querySelector('.progress-bar');
    const progressContainer = document.querySelector('.progress-container');
    const currentTimeEl = document.querySelector('.current-time');
    const totalDurationEl = document.querySelector('.total-duration');
    const albumArt = document.querySelector('.album-art');
    const trackTitle = document.querySelector('.track-title');
    const trackArtist = document.querySelector('.track-artist');
    const playlistEl = document.querySelector('.playlist');
    const volumeBtn = document.querySelector('.volume-btn');
    const volumeSlider = document.querySelector('.volume-slider');

    const playlistData = [
        { src: 'corrente.mp3', title: 'Corrente', artist: 'Lz da França, Kawe', cover: 'capcorrente.png' },
        { src: 'sorvete.mp3', title: 'Sorvete', artist: 'Lz da França', cover: 'capsorvete.png' },
        { src: 'luxo.mp3', title: 'Luxo', artist: 'Lz da França, Mc Kadu', cover: 'capluxo.png' }
    ];

    let currentTrackIndex = 0;
    let isPlaying = false;

    function loadPlaylist() { playlistData.forEach((track, index) => { const li = document.createElement('li'); li.classList.add('playlist-item'); li.dataset.index = index; li.innerHTML = `<img src="${track.cover}" alt="${track.title} cover"><div class="playlist-item-info"><span class="title">${track.title}</span><span class="artist">${track.artist}</span></div>`; playlistEl.appendChild(li); }); }
    function loadTrack(index) { const track = playlistData[index]; albumArt.src = track.cover; trackTitle.textContent = track.title; trackArtist.textContent = track.artist; audioPlayer.src = track.src; document.querySelectorAll('.playlist-item').forEach(item => { item.classList.remove('active'); }); playlistEl.querySelector(`[data-index='${index}']`).classList.add('active'); currentTrackIndex = index; }
    function playTrack() { isPlaying = true; playPauseBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M10 4H7v16h3V4zm7 0h-3v16h3V4z"/></svg>'; audioPlayer.play(); }
    function pauseTrack() { isPlaying = false; playPauseBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M8 19V5l11 7l-11 7z"/></svg>'; audioPlayer.pause(); }
    function prevTrack() { currentTrackIndex = (currentTrackIndex - 1 + playlistData.length) % playlistData.length; loadTrack(currentTrackIndex); playTrack(); }
    function nextTrack() { currentTrackIndex = (currentTrackIndex + 1) % playlistData.length; loadTrack(currentTrackIndex); playTrack(); }
    function updateProgress(e) { const { duration, currentTime } = e.srcElement; const progressPercent = (currentTime / duration) * 100; progressBar.style.width = `${progressPercent}%`; if(duration) { totalDurationEl.textContent = formatTime(duration); } currentTimeEl.textContent = formatTime(currentTime); }
    function formatTime(seconds) { const minutes = Math.floor(seconds / 60); const secs = Math.floor(seconds % 60); return `${minutes}:${secs < 10 ? '0' : ''}${secs}`; }
    function setProgress(e) { const width = this.clientWidth; const clickX = e.offsetX; const duration = audioPlayer.duration; audioPlayer.currentTime = (clickX / width) * duration; }
    function updateVolume() { audioPlayer.volume = volumeSlider.value; if (audioPlayer.volume > 0.5) { volumeBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77c0-4.28-2.99-7.86-7-8.77M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02M3 9v6h4l5 5V4L7 9H3z"/></svg>'; } else if (audioPlayer.volume > 0 && audioPlayer.volume <= 0.5) { volumeBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>'; } else { volumeBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27L7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21L21 19.73l-9-9L4.27 3zM12 4L9.91 6.09L12 8.18V4z"/></svg>'; } }
    
    playPauseBtn.addEventListener('click', () => (isPlaying ? pauseTrack() : playTrack()));
    prevBtn.addEventListener('click', prevTrack);
    nextBtn.addEventListener('click', nextTrack);
    audioPlayer.addEventListener('timeupdate', updateProgress);
    progressContainer.addEventListener('click', setProgress);
    audioPlayer.addEventListener('ended', nextTrack);
    volumeSlider.addEventListener('input', updateVolume);
    playlistEl.addEventListener('click', (e) => { const item = e.target.closest('.playlist-item'); if (item) { const index = item.dataset.index; loadTrack(index); playTrack(); } });

    loadPlaylist();
    if(playlistData.length > 0) {
        loadTrack(currentTrackIndex);
        updateVolume();
    }
    
    // --- LÓGICA DE CLIQUE E AUTOMAÇÃO DA GALERIA ---
    const galleryItemsAuto = document.querySelectorAll('.gallery-item');
    let autoClickInterval;
    let currentCardIndex = 0;
    const autoClickDelay = 3000; // Tempo em milissegundos (3 segundos)

    // Função para mostrar um card específico e fechar os outros
    // SUBSTITUA SUA FUNÇÃO showCard POR ESTA:

function showCard(index) {
    galleryItemsAuto.forEach((item, idx) => {
        const overlay = item.querySelector('.card-overlay');
        if (idx === index) {
            // Adiciona a classe .active ao card PAI e ao overlay
            item.classList.add('active');
            overlay.classList.add('active');
        } else {
            // Remove a classe .active de ambos
            item.classList.remove('active');
            overlay.classList.remove('active');
        }
    });
}

    // Função para iniciar o loop automático
    function startAutoClick() {
        // Limpa qualquer loop anterior para evitar múltiplos timers
        clearInterval(autoClickInterval);
        
        autoClickInterval = setInterval(() => {
            showCard(currentCardIndex);
            currentCardIndex = (currentCardIndex + 1) % galleryItemsAuto.length;
        }, autoClickDelay);
    }

    // Adiciona o evento de clique manual em cada card
    galleryItemsAuto.forEach((item, index) => {
        item.addEventListener('click', () => {
            // 1. Para o loop automático
            clearInterval(autoClickInterval);
            
            // 2. Define o card clicado como o atual
            currentCardIndex = index;
            showCard(currentCardIndex);
            
            // 3. Prepara o *próximo* card para o reinício do loop
            currentCardIndex = (currentCardIndex + 1) % galleryItemsAuto.length;
            
            // 4. Reinicia o loop automático a partir do próximo card
            startAutoClick();
        });
    });

    // Inicia o loop automático quando a página carrega
    if (galleryItemsAuto.length > 0) {
        startAutoClick();
    }
});