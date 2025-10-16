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
    let index = 0
    for (const seriesName in seriesData) {
        const divElement = document.createElement('div');
        const moveRight = document.createElement('div');
        const moveLeft = document.createElement('div');
        const spanElement = document.createElement('span')
        const paragrapyElement = document.createElement('p')

        // setas
        moveRight.className = 'move-right'
        moveRight.textContent = '>'

        moveLeft.className = 'move-left'
        moveLeft.textContent = '<'

        spanElement.className = 'container-span'
        paragrapyElement.className = 'titulo-element'
        paragrapyElement.textContent = seriesName;
        divElement.classList.add('container-video-item');

        divElement.appendChild(moveRight)
        divElement.appendChild(moveLeft)
        spanElement.appendChild(paragrapyElement)
        spanElement.appendChild(divElement);
        list.appendChild(spanElement)

        seriesData[seriesName].forEach(file => {
            const containerEP = document.createElement('div')
            const nameElement = document.createElement('p')
            const tambElement = document.createElement('video')


            nameElement.textContent = file
            nameElement.className = 'title-EP'
            tambElement.className = 'video-tamb-EP'
            tambElement.src = `videos/${seriesName}/${file}`
            containerEP.classList.add('video-item')
            
            containerEP.appendChild(tambElement)
            containerEP.appendChild(nameElement)
            divElement.appendChild(containerEP)
        })
    }
}

// function renderEpisodeList(seriesName) {
//     list.innerHTML = '';
//     currentSeries = seriesName;
    
//     seriesData[seriesName].forEach(file => {
//         const ep = document.createElement('div');
//         ep.textContent = file;
//         ep.classList.add('video-item');
//         ep.onclick = () => playVideo(seriesName, file);
//         list.appendChild(ep);
//     });
// }

function playVideo(seriesName, file) {
    video.src = `videos/${seriesName}/${file}`;
    //video.play();

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
    if ( 1 === 2 && progress.seriesName && seriesData[progress.seriesName]) {
        playVideo(progress.seriesName, progress.file);
        video.currentTime = progress.time || 0;
    }
});
