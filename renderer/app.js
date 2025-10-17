const play = document.getElementById("play").addEventListener("click", contPlay())
const voltar = document.getElementById("voltar").addEventListener("click", contVoltar())
const pause = document.getElementById("pause").addEventListener("click", contPause())
const avancar = document.getElementById("avancar").addEventListener("click", contAvancar())
const barraProgresso = document.getElementById("barra-progresso")

const progress = JSON.parse(localStorage.getItem('progress') || '{}');
const video = document.querySelector('#video-anteriormente');
const list = document.querySelector('#video-list');
let tamanhoVideoAtual = 0
let currentSeries = '';
let seriesData = {};

window.api.getSeries().then(series => {
    seriesData = series;
    renderSeriesList();
});

//controladores
function contPlay() { }

function contVoltar() { }

function contPause() { }

function contAvancar() { }

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

            containerEP.onclick = () => playVideo(seriesName, file);


            containerEP.appendChild(tambElement)
            containerEP.appendChild(nameElement)
            divElement.appendChild(containerEP)
        })
    }
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

function playVideo(seriesName, file) {
    video.src = `videos/${seriesName}/${file}`;

    video.addEventListener('loadedmetadata', () => {
        console.log('Duração total:', video.duration, 'segundos');
        tamanhoVideoAtual = video.duration
        atualizaBarra(progress.time)
    });

    video.controls = true

    video.addEventListener("timeupdate", console.log(progress.time))

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
    // video.onended = () => {
    //     const episodes = seriesData[seriesName];
    //     const currentIndex = episodes.indexOf(file);
    //     const next = episodes[currentIndex + 1];
    //     if (next) playVideo(seriesName, next);
    // };
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
    const dado = await loadDataSets()

    if (progress.time >= 0) atualizaBarra(progress.time)
    else atualizaBarra(0)

    if (dado && progress.seriesName && seriesData[progress.seriesName]) {
        playVideo(progress.seriesName, progress.file);
        video.currentTime = progress.time || 0;
    }
});
