// 1. Mock de Dados e Configurações
if (!window.api) {
    window.api = {
        getSeries: async () => ({
            "Cyberpunk": ["Episodio_01.mp4", "Episodio_02.mp4", "Episodio_03.mp4"],
            "Arcane": ["A_Queda.mp4", "Inimigo_Comum.mp4"],
            "Breaking Bad": ["Pilot.mp4", "Cat_in_the_bag.mp4"]
        })
    };
}

const video = document.querySelector('#video-anteriormente');
const barraProgresso = document.getElementById("barra-progresso");
const botaoPular = document.getElementById("btn-pular");
const list = document.querySelector('#video-list');
const segundosParaMostrarBotao = 45; // Tempo antes do fim para mostrar o botão

let progress = {
    seriesName: '',
    file: '',
    time: 0
};
let seriesData = {};

// 2. Inicialização
window.addEventListener('DOMContentLoaded', async () => {
    seriesData = await window.api.getSeries();
    renderSeriesList();

    const saved = JSON.parse(localStorage.getItem('progress') || '{}');
    if (saved.seriesName && seriesData[saved.seriesName]) {
        carregandoVideo(saved.seriesName, saved.file, saved.time);
    }

    setupEventListeners();
});

// 3. Renderização da Interface
function renderSeriesList() {
    list.innerHTML = '';
    for (const seriesName in seriesData) {
        const spanContainer = document.createElement('span');
        spanContainer.className = 'container-span';

        const title = document.createElement('p');
        title.className = 'titulo-element';
        title.textContent = seriesName;

        const carousel = document.createElement('div');
        carousel.className = 'container-video-item';

        // Botões de navegação
        const btnL = document.createElement('div');
        btnL.className = 'move-left';
        btnL.innerHTML = '<i class="fas fa-chevron-left"></i>';
        btnL.onclick = () => carousel.scrollBy({
            left: -400,
            behavior: 'smooth'
        });

        const btnR = document.createElement('div');
        btnR.className = 'move-right';
        btnR.innerHTML = '<i class="fas fa-chevron-right"></i>';
        btnR.onclick = () => carousel.scrollBy({
            left: 400,
            behavior: 'smooth'
        });

        seriesData[seriesName].forEach(file => {
            const item = document.createElement('div');
            item.className = 'video-item';
            item.innerHTML = `
            <video class="video-tamb-EP" src="videos/${seriesName}/${file}#t=10"></video>
            <p class="title-EP">${file}</p>
          `;
            item.onclick = () => carregandoVideo(seriesName, file);
            carousel.appendChild(item);
        });

        spanContainer.append(title, btnL, btnR, carousel);
        list.appendChild(spanContainer);
    }
}

// 4. Lógica do Player
function carregandoVideo(seriesName, file, startTime = 0) {
    const progressHistory = JSON.parse(localStorage.getItem('progressHistory') || '{}');
    const timeToSeek = startTime || progressHistory[`${seriesName}/${file}`] || 0;

    document.querySelector("#titulo-atual").innerText = file;
    document.querySelector("#titulo-serie").innerText = seriesName;

    progress = {
        seriesName,
        file,
        time: timeToSeek
    };
    video.src = `videos/${seriesName}/${file}`;

    video.onloadedmetadata = () => {
        video.currentTime = timeToSeek;
        atualizaControlesUI();
    };

    video.ontimeupdate = () => {
        const current = video.currentTime;
        const duration = video.duration;

        // Atualiza Barra
        const pct = (current / duration) * 100;
        barraProgresso.style.width = `${pct}%`;

        // Salva Progresso
        progressHistory[`${seriesName}/${file}`] = current;
        localStorage.setItem('progressHistory', JSON.stringify(progressHistory));
        localStorage.setItem('progress', JSON.stringify({
            seriesName,
            file,
            time: current
        }));

        // Lógica do botão "Pular Próximo"
        if (duration - current < segundosParaMostrarBotao) {
            botaoPular.style.display = 'block';
        } else {
            botaoPular.style.display = 'none';
        }
    };

    video.onended = () => contAvancar();
    video.play();
    atualizaControlesUI();
}

// 1. Mova a togglePlay para fora (escopo global do script)
function togglePlay(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }

    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
    atualizaControlesUI();
}

function setupEventListeners() {
    const playBtn = document.getElementById("play");
    const pauseBtn = document.getElementById("pause");

    // Cliques nos botões da barra
    playBtn.onclick = () => { video.play(); atualizaControlesUI(); };
    pauseBtn.onclick = () => { video.pause(); atualizaControlesUI(); };

    // Clique no centro do vídeo
    video.onclick = togglePlay;

    // Atalhos de Teclado Atualizados
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        switch (e.code) {
            case 'Space':
                e.preventDefault();
                togglePlay();
                break;
            case 'KeyF':
                e.preventDefault();
                if (!document.fullscreenElement) {
                    video.requestFullscreen();
                } else {
                    document.exitFullscreen();
                }
                break;
            case 'ArrowRight':
                e.preventDefault();
                video.currentTime += 10;
                break;
            case 'ArrowLeft':
                e.preventDefault();
                video.currentTime -= 10;
                break;
            // --- NOVOS ATALHOS DE VOLUME ---
            case 'ArrowUp':
                e.preventDefault();
                // Aumenta o volume em 0.1 (10%), limitando ao máximo de 1.0
                video.volume = Math.min(1, video.volume + 0.05);
                console.log("Volume:", Math.round(video.volume * 100) + "%");
                break;
            case 'ArrowDown':
                e.preventDefault();
                // Diminui o volume em 0.1 (10%), limitando ao mínimo de 0.0
                video.volume = Math.max(0, video.volume - 0.05);
                console.log("Volume:", Math.round(video.volume * 100) + "%");
                break;
            // Tecla M para Mudo (Mute)
            case 'KeyM':
                e.preventDefault();
                video.muted = !video.muted;
                break;
        }
    });

    // Outros botões
    document.getElementById("avancar").onclick = contAvancar;
    document.getElementById("voltar").onclick = contVoltar;
    document.getElementById("fullscreen-btn").onclick = () => video.requestFullscreen();
    botaoPular.onclick = contAvancar;
}

function atualizaControlesUI() {
    document.getElementById("play").classList.toggle("cont-lig-des", !video.paused);
    document.getElementById("pause").classList.toggle("cont-lig-des", video.paused);

    // REMOVE O FOCO DE QUALQUER COISA: 
    // Isso impede que o 'Espaço' ative o último botão clicado
    if (document.activeElement) {
        document.activeElement.blur();
    }
}

function contAvancar() {
    const episodes = seriesData[progress.seriesName];
    const idx = episodes.indexOf(progress.file);
    if (idx < episodes.length - 1) {
        carregandoVideo(progress.seriesName, episodes[idx + 1]);
    }
}

function contVoltar() {
    const episodes = seriesData[progress.seriesName];
    const idx = episodes.indexOf(progress.file);
    if (idx > 0) {
        carregandoVideo(progress.seriesName, episodes[idx - 1]);
    }
}