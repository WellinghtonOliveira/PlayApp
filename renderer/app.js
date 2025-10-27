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

// controladores do video
function contPlay() {
    video.play()
}

function contPause() {
    video.pause()
}

function contVoltar() {
    controlesEstilo()
    const episodes = seriesData[progress.seriesName];
    const currentIndex = episodes.indexOf(progress.file);
    const retrocesso = episodes[currentIndex - 1];
    if (retrocesso) carregandoVideo(progress.seriesName, retrocesso);
    video.pause()
}

function contAvancar() {
    controlesEstilo()
    const episodes = seriesData[progress.seriesName];
    const currentIndex = episodes.indexOf(progress.file);
    const proximo = episodes[currentIndex + 1];
    if (proximo) carregandoVideo(progress.seriesName, proximo);
    video.pause()
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

    spanElement.appendChild(moveL())
    spanElement.appendChild(moveR())

    return spanElement
}

const series = () => {
    const divElement = document.createElement('div');

    divElement.classList.add('container-video-item');

    return divElement
}

// rendeniza as setas
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

    const tituloVideoAtual = document.querySelector("#titulo-atual")
    const tituloSerieAtual = document.querySelector("#titulo-serie")

    tituloVideoAtual.innerText = file
    tituloSerieAtual.innerText = seriesName

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

    controlesEstilo()
    iconTelaCheia()
}

const verificPause = () => {
    if (video.paused) {
        controlesEstilo()
    }
    if (!video.paused) {
        video.play()
    }
    return
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

// barra de progrsso
function atualizaBarra(valorAtual) {
    if (valorAtual > tamanhoVideoAtual) {
        tamanhoVideoAtual = valorAtual;
    }

    const porcentagem = (valorAtual / tamanhoVideoAtual) * 100;

    barraProgresso.style.width = porcentagem + '%'
}

function carrosel(setas) {
    setas.forEach((el) => {
        const container = el.parentElement.querySelector(".container-video-item");

        const larguraItem = 200;
        const totalItens = container.children.length / 2;

        let pos = 0;

        el.addEventListener("click", (e) => {
            const direcao = el.classList.contains("move-right") ? -1 : 1;

            pos += direcao * larguraItem;
            container.style.transition = "transform 0.3s ease";
            container.style.transform = `translateX(${pos}px)`;

            setTimeout(() => {
                // reset para loop infinito
                if (pos <= -larguraItem * totalItens) {
                    container.style.transition = "none";
                    pos = 0;
                    container.style.transform = `translateX(${pos}px)`;
                }
                if (pos > 0) {
                    container.style.transition = "none";
                    pos = -larguraItem * (totalItens - 1);
                    container.style.transform = `translateX(${pos}px)`;
                }
            }, 10);
        });
    });
}

const iconTelaCheia = () => {
    const icon = document.querySelector(".icon-tela-inteira")

    icon.addEventListener("click", () => {
        video.requestFullscreen()
    })
}

// Inicialização
window.addEventListener('DOMContentLoaded', async () => {
    coletaProgressAtual()
    const dado = await loadDataSets();
    const setas = document.querySelectorAll(".move-right, .move-left"); // pega todas de uma vez

    carrosel(setas)
    controlesEstilo()

    if (progress.time >= 0) atualizaBarra(progress.time)
    else atualizaBarra(0)

    if (dado && progress.seriesName && seriesData[progress.seriesName]) {
        carregandoVideo(progress.seriesName, progress.file);
        video.currentTime = progress.time || 0;
    }
});

// Estilo com js
function controlesEstilo() {
    const controles = document.querySelectorAll(".controle")

    controles.forEach((el) => {
        el.addEventListener("click", function () {
            controles.forEach((a) => a.classList.remove("cont-lig-des"))
            el.classList.add("cont-lig-des")
            return
        })

        controles.forEach((a) => a.classList.remove("cont-lig-des"))
        const p = document.querySelector("#pause")
        p.classList.add("cont-lig-des")
    })
}