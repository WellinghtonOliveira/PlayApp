document.getElementById("play").addEventListener("click", contPlay)
document.getElementById("voltar").addEventListener("click", contVoltar)
document.getElementById("pause").addEventListener("click", contPause)
document.getElementById("avancar").addEventListener("click", contAvancar)

const barraProgresso = document.getElementById("barra-progresso")
const video = document.querySelector('#video-anteriormente');
const list = document.querySelector('#video-list');


let progress
let tamanhoVideoAtual = 0
let seriesData = {};

window.api.getSeries().then(series => {
    seriesData = series;
    renderSeriesList();
});

function controladorSetaOverflow() {}
// moveSetaRigth.addEventListener("click", function move() {})
// const moveSetaLeft = document.querySelectorAll(".move-left")
// const moveSetaRigth = document.querySelectorAll(".move-right")

//controladores
function contPlay() {
    video.play()
}

function contPause() {
    video.pause()
}

function contVoltar() {
    const episodes = seriesData[progress.seriesName];
    const currentIndex = episodes.indexOf(progress.file);
    const retrocesso = episodes[currentIndex - 1];
    if (retrocesso) carregandoVideo(progress.seriesName, retrocesso);
    video.play()
}

function contAvancar() {
    const episodes = seriesData[progress.seriesName];
    const currentIndex = episodes.indexOf(progress.file);
    const proximo = episodes[currentIndex + 1];
    if (proximo) carregandoVideo(progress.seriesName, proximo);
    video.play()
}

function renderSeriesList() {
    list.innerHTML = '';

    for (const seriesName in seriesData) {// escreve as series pelo nome da pasta
        const divElement = series()
        const spanElement = individualSeries()
        const paragrapyElement = nomeEpsodios(seriesName)


        spanElement.appendChild(paragrapyElement)
        spanElement.appendChild(divElement);
        list.appendChild(spanElement)

        seriesData[seriesName].forEach(file => {// escreve os epsodios
            const { containerEP, nameElement, tambElement } = epsodios(file, seriesName)

            containerEP.onclick = () => carregandoVideo(seriesName, file)

            containerEP.appendChild(tambElement)
            containerEP.appendChild(nameElement)
            divElement.appendChild(containerEP)
        })
    }

    controladorSetaOverflow()
}

// Epsodios 
const epsodios = (file, seriesName) => {
    const containerEP = document.createElement('div')
    const nameElement = document.createElement('p')
    const tambElement = document.createElement('video')

    //tambElement.controls = true
    nameElement.textContent = file
    nameElement.className = 'title-EP'
    tambElement.className = 'video-tamb-EP'
    tambElement.src = `videos/${seriesName}/${file}`
    containerEP.classList.add('video-item')

    return { containerEP, nameElement, tambElement }
}

const nomeEpsodios = (seriesName) => {
    const paragrapyElement = document.createElement('p')

    paragrapyElement.className = 'titulo-element'
    paragrapyElement.textContent = seriesName;

    return paragrapyElement
}

// series
const individualSeries = () => {
    const spanElement = document.createElement('span')

    spanElement.className = 'container-span'

    return spanElement
}

const series = () => {
    const divElement = document.createElement('div');

    divElement.classList.add('container-video-item');

    divElement.appendChild(moveL())
    divElement.appendChild(moveR())

    return divElement
}

// setas
const moveR = () => {
    const moveRight = document.createElement('div');

    moveRight.className = 'move-right'
    moveRight.textContent = '>'

    return moveRight
}

const moveL = () => {
    const moveLeft = document.createElement('div');

    moveLeft.className = 'move-left'
    moveLeft.textContent = '<'

    return moveLeft
}

const coletaProgressAtual = () => {
    progress = JSON.parse(localStorage.getItem('progress') || '{}')
}

function carregandoVideo(seriesName, file) {
    const progressHistory = JSON.parse(localStorage.getItem('progressHistory') || '{}');
    const savedTime = progressHistory[`${seriesName}/${file}`] || 0;

    progress = { seriesName, file, time: savedTime };
    localStorage.setItem('progress', JSON.stringify(progress));

    video.src = `videos/${seriesName}/${file}`;

    const onLoadedMetadata = () => {
        tamanhoVideoAtual = video.duration;
        video.currentTime = savedTime;
        atualizaBarra(savedTime);
    };

    video.removeEventListener('loadedmetadata', onLoadedMetadata);
    video.addEventListener('loadedmetadata', onLoadedMetadata);

    video.ontimeupdate = () => {
        const currentTime = video.currentTime;
        atualizaBarra(currentTime);

        localStorage.setItem('progress', JSON.stringify({
            seriesName,
            file,
            time: currentTime
        }));

        progressHistory[`${seriesName}/${file}`] = currentTime;
        localStorage.setItem('progressHistory', JSON.stringify(progressHistory));
    };
    video.controls
}

async function loadDataSets() {
    return new Promise((resolve) => {
        const check = setInterval(() => {
            if (seriesData != {}) {
                clearInterval(check);
                resolve(true);
            }
        }, 1000)
    });
}

function atualizaBarra(valorAtual) {
    if (valorAtual > tamanhoVideoAtual) {
        tamanhoVideoAtual = valorAtual;
    }

    const porcentagem = (valorAtual / tamanhoVideoAtual) * 100;

    barraProgresso.style.width = porcentagem + '%'
}

// Restaurar progresso
window.addEventListener('DOMContentLoaded', async () => {
    coletaProgressAtual()
    const dado = await loadDataSets()

    if (progress.time >= 0) atualizaBarra(progress.time)
    else atualizaBarra(0)

    if (dado && progress.seriesName && seriesData[progress.seriesName]) {
        carregandoVideo(progress.seriesName, progress.file);
        video.currentTime = progress.time || 0;
    }
});
