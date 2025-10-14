const video = document.querySelector('video');
const list = document.querySelector('#video-list');
let currentSeries = '';
let seriesData = {};

window.api.getSeries().then(series => {
    seriesData = series;
    renderSeriesList();
});

function renderSeriesList() {
    list.innerHTML = '';
    for (const seriesName in seriesData) {
        const item = document.createElement('div');
        item.textContent = seriesName;
        item.classList.add('video-item');
        item.onclick = () => renderEpisodeList(seriesName);
        list.appendChild(item);
    }
}

function renderEpisodeList(seriesName) {
    list.innerHTML = '';
    currentSeries = seriesName;
    
    seriesData[seriesName].forEach(file => {
        const ep = document.createElement('div');
        ep.textContent = file;
        ep.classList.add('video-item');
        ep.onclick = () => playVideo(seriesName, file);
        list.appendChild(ep);
    });
}

function playVideo(seriesName, file) {
    video.src = `videos/${seriesName}/${file}`;
    video.play();

    // Salvar progresso
    video.ontimeupdate = () => {
        localStorage.setItem('progress', JSON.stringify({
            seriesName,
            file,
            time: video.currentTime
        }));
    };

    // Próximo episódio automaticamente
    video.onended = () => {
        const episodes = seriesData[seriesName];
        const currentIndex = episodes.indexOf(file);
        const next = episodes[currentIndex + 1];
        if (next) playVideo(seriesName, next);
    };
}

// Restaurar progresso
window.addEventListener('DOMContentLoaded', () => {
    const progress = JSON.parse(localStorage.getItem('progress') || '{}');
    if (progress.seriesName && seriesData[progress.seriesName]) {
        playVideo(progress.seriesName, progress.file);
        video.currentTime = progress.time || 0;
    }
});
