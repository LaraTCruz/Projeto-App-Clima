const entradaCidade = document.querySelector('.entrada-cidade')
const btnBusca = document.querySelector('.btn-busca')

const infoClima = document.querySelector('.info-clima')
const naoEncontrado = document.querySelector('.nao-encontrado')
const busca = document.querySelector('.busca')

const pais = document.querySelector('.pais')
const tempTxt = document.querySelector('.temp')
const condTxt = document.querySelector('.cond-txt')
const valorUmidade = document.querySelector('.valor-umidade')
const valorVento = document.querySelector('.valor-vento')
const resumoImg = document.querySelector('.resumo-img')
const dataAtual = document.querySelector('.data-atual')

const previsao = document.querySelector('.previsao')

const apiKey = `a19ceb56122978312747e5646f61697a`

btnBusca.addEventListener('click', () => {
    if (entradaCidade.value.trim() != ''){
        atualizarInfoClima(entradaCidade.value)
        entradaCidade.value = ''
        entradaCidade.blur()
    }   
})

entradaCidade.addEventListener('keydown', (event) =>{
    if (event.key == 'Enter' &&
        entradaCidade.value.trim() != ''
    ){
        atualizarInfoClima(entradaCidade.value)
        entradaCidade.value = ''
        entradaCidade.blur()
    }
})

async function buscaDados(endPoint, cidade){
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${cidade}&appid=${apiKey}&units=metric`

    const response = await fetch(apiUrl)

    return response.json()
}

function getIconeClima(id){
    if(id <= 232) return 'thunderstorm.svg'
    if(id <= 321) return 'drizzle.svg'
    if(id <= 531) return 'rain.svg'
    if(id <= 622) return 'snow.svg'
    if(id <= 781) return 'atmosphere.svg'
    if(id <= 800) return 'clear.svg'
    else return 'clouds.svg'
}

function getDataAtual(){
    const dataAtual = new Date()
    const opcoes = {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    }

    return dataAtual.toLocaleDateString('pt-br', opcoes)
}

async function atualizarInfoClima(cidade){
    const climaDados = await buscaDados('weather', cidade)

    if(climaDados.cod != 200){
        exibirSessao(naoEncontrado)
        return
    }

    const{
        name: country,
        main:{ temp, humidity },
        weather:[{ id, main }],
        wind: { speed }
    } = climaDados

    pais.textContent = country
    tempTxt.textContent = Math.round(temp) + ' °C'
    condTxt.textContent = main
    valorUmidade.textContent = humidity + ' %'
    valorVento.textContent = speed + ' M/s'

    dataAtual.textContent = getDataAtual()
    resumoImg.src = `anexos/weather/${getIconeClima(id)}`

    await atualizarPrevisao(cidade)
    exibirSessao(infoClima)
}

async function atualizarPrevisao(cidade){
    const dadosPrevisao = await buscaDados('forecast', cidade)

    const hora = '12:00:00'
    const dataHoje = new Date().toISOString().split('T')[0]
    
    previsao.innerHTML = ''
    dadosPrevisao.list.forEach(climaPrevisao => {
        if(climaPrevisao.dt_txt.includes(hora) &&
           !climaPrevisao.dt_txt.includes(dataHoje)){
            atualizarPrevisaoItems(climaPrevisao)
        }
    })
}

function atualizarPrevisaoItems(climaDados){
    console.log(climaDados)
    const{
        dt_txt: date,
        weather: [{ id }],
        main:{ temp }
    } = climaDados

    const dataHoje = new Date(date)
    const dataOpcoes = {
        day: '2-digit',
        month: 'short'
    }
    const resultadoData = dataHoje.toLocaleDateString('pt-br', dataOpcoes)

    const previsaoItem = `
        <div class="previsao-item">
            <h5 class="data-previsao data-ant">${resultadoData}</h5>
            <img src="anexos/weather/${getIconeClima(id)}" class="previsao-img">
            <h5 class="temp-previsao">${Math.round(temp)} °C</h5>
        </div>
    `
    previsao.insertAdjacentHTML('beforeend', previsaoItem)
}

function exibirSessao(sessao){
    [infoClima, busca, naoEncontrado]
        .forEach(sessao => sessao.style.display = 'none')

    sessao.style.display = 'flex'
}