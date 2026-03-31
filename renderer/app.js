// -----------------------------
// Mock caso rode no navegador
// -----------------------------
if (!window.api) {
    window.api = {
        getSeries: async () => ({
            "Cyberpunk": [
                { name: "Episodio_01.mp4", path: "C:/videos/Episodio_01.mp4" },
                { name: "Episodio_02.mp4", path: "C:/videos/Episodio_02.mp4" }
            ]
        }),
        setPath: async () => { }
    };
}

// -----------------------------
// Elementos DOM
// -----------------------------
const video = document.querySelector('#video-anteriormente');
const barraProgresso = document.getElementById("barra-progresso");
const botaoPular = document.getElementById("btn-pular");
const list = document.querySelector('#video-list');

const segundosParaMostrarBotao = 45;

let progress = {
    seriesName: '',
    file: '',
    time: 0
};

let seriesData = {};

// -----------------------------
// Nome do usuário
// -----------------------------
function initUserName() {

    const userName = document.querySelector("#nameUser");

    if (!userName) return;

    const saved = localStorage.getItem("userName");

    if (saved) userName.value = saved;

    userName.addEventListener("input", () => {
        localStorage.setItem("userName", userName.value);
    });
}

// -----------------------------
// Inicialização
// -----------------------------
window.addEventListener('DOMContentLoaded', async () => {

    initUserName();

    seriesData = await window.api.getSeries();

    renderSeriesList();

    const saved = JSON.parse(localStorage.getItem('progress') || '{}');

    if (saved.seriesName && seriesData[saved.seriesName]) {

        const episodes = seriesData[saved.seriesName];

        const episode = episodes.find(ep => ep.name === saved.file);

        if (episode) {
            carregandoVideo(saved.seriesName, episode, saved.time);
        }

    }

    setupEventListeners();
});

// -----------------------------
// Renderizar séries
// -----------------------------
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

        const btnL = document.createElement('div');
        btnL.className = 'move-left';
        btnL.innerHTML = '<i class="fas fa-chevron-left"></i>';
        btnL.onclick = () => carousel.scrollBy({ left: -400, behavior: 'smooth' });

        const btnR = document.createElement('div');
        btnR.className = 'move-right';
        btnR.innerHTML = '<i class="fas fa-chevron-right"></i>';
        btnR.onclick = () => carousel.scrollBy({ left: 400, behavior: 'smooth' });

        seriesData[seriesName].forEach(ep => {

            const item = document.createElement('div');
            item.className = 'video-item';

            const safePath = ep.path ? ep.path.replace(/\\/g, "/") : "";

            item.innerHTML = `
                <video class="video-tamb-EP" src="file:///${safePath}#t=10"></video>
                <p class="title-EP">${ep.name}</p>
            `;

            item.onclick = () => carregandoVideo(seriesName, ep);

            carousel.appendChild(item);
        });

        spanContainer.append(title, btnL, btnR, carousel);

        list.appendChild(spanContainer);
    }
}

// -----------------------------
// Player
// -----------------------------
function carregandoVideo(seriesName, episode, startTime = 0) {

    if (!episode || !episode.path) {
        console.error("Episódio inválido:", episode);
        return;
    }

    const file = episode.name;
    const videoPath = episode.path;

    const progressHistory = JSON.parse(localStorage.getItem('progressHistory') || '{}');

    const timeToSeek = startTime || progressHistory[`${seriesName}/${file}`] || 0;

    document.querySelector("#titulo-atual").innerText = file;
    document.querySelector("#titulo-serie").innerText = seriesName;

    progress = { seriesName, file, time: timeToSeek };

    video.src = `file:///${videoPath.replace(/\\/g, "/")}`;

    video.onloadedmetadata = () => {
        video.currentTime = timeToSeek;
        atualizaControlesUI();
    };

    video.ontimeupdate = () => {

        const current = video.currentTime;
        const duration = video.duration;

        const pct = (current / duration) * 100;

        barraProgresso.style.width = `${pct}%`;

        progressHistory[`${seriesName}/${file}`] = current;

        localStorage.setItem('progressHistory', JSON.stringify(progressHistory));

        localStorage.setItem('progress', JSON.stringify({
            seriesName,
            file,
            time: current
        }));

        if (duration - current < segundosParaMostrarBotao) {
            botaoPular.style.display = 'block';
        } else {
            botaoPular.style.display = 'none';
        }
    };

    video.onended = () => contAvancar();

    video.pause();

    atualizaControlesUI();
}

// -----------------------------
// Path
// -----------------------------
async function setPathSeries() {

    const result = await window.api.setPath();

    if (!result) return;

    seriesData = await window.api.getSeries();

    renderSeriesList();
}

// -----------------------------
// Controles
// -----------------------------
function togglePlay(e) {

    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }

    if (video.paused) video.play();
    else video.pause();

    atualizaControlesUI();
}

function setupEventListeners() {

    const playBtn = document.getElementById("play");
    const pauseBtn = document.getElementById("pause");

    playBtn.onclick = () => { video.play(); atualizaControlesUI(); };
    pauseBtn.onclick = () => { video.pause(); atualizaControlesUI(); };

    video.onclick = togglePlay;

    document.addEventListener('keydown', (e) => {

        if (e.target.tagName === 'INPUT') return;

        switch (e.code) {

            case 'Space':
                e.preventDefault();
                togglePlay();
                break;

            case 'KeyF':
                e.preventDefault();
                if (!document.fullscreenElement) video.requestFullscreen();
                else document.exitFullscreen();
                break;

            case 'ArrowRight':
                video.currentTime += 10;
                break;

            case 'ArrowLeft':
                video.currentTime -= 10;
                break;

            case 'ArrowUp':
                video.volume = Math.min(1, video.volume + 0.05);
                break;

            case 'ArrowDown':
                video.volume = Math.max(0, video.volume - 0.05);
                break;

            case 'KeyM':
                video.muted = !video.muted;
                break;
        }
    });

    document.getElementById("avancar").onclick = contAvancar;
    document.getElementById("voltar").onclick = contVoltar;
    document.getElementById("fullscreen-btn").onclick = () => video.requestFullscreen();

    botaoPular.onclick = contAvancar;
}

// -----------------------------
// UI
// -----------------------------
function atualizaControlesUI() {

    document.getElementById("play")
        .classList.toggle("cont-lig-des", !video.paused);

    document.getElementById("pause")
        .classList.toggle("cont-lig-des", video.paused);

    if (document.activeElement) document.activeElement.blur();
}

// -----------------------------
// Navegação episódios
// -----------------------------
function contAvancar() {

    const episodes = seriesData[progress.seriesName];
    const idx = episodes.findIndex(ep => ep.name === progress.file);

    if (idx < episodes.length - 1) {
        carregandoVideo(progress.seriesName, episodes[idx + 1]);
    }
}

function contVoltar() {

    const episodes = seriesData[progress.seriesName];
    const idx = episodes.findIndex(ep => ep.name === progress.file);

    if (idx > 0) {
        carregandoVideo(progress.seriesName, episodes[idx - 1]);
    }
}