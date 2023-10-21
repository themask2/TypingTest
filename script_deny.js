const textArea = document.querySelector("#text-area");
const textGabarito = document.querySelector("#origin-text"); 
const domTime = document.querySelector(".timer");
const textWrapper = document.querySelector(".test-wrapper");
const resetButton = document.querySelector("#reset");

timer = [0,0,0,0]; //minutos : segundos : decimos de segundos : contador de decimos de segundos
var interval;
var timerRunning = false;

function spellCheck() {
    // console.log(textArea);
    if (textArea.value == textGabarito.innerText) {
        clearInterval(interval);
        textWrapper.style.borderColor = "#0c7038";
        textArea.readOnly = true;
    } else {
        textWrapper.style.borderColor = "#e30918";
    }
}

function leadingZero(time) {
    if (time <= 9) {
        time = "0" + time;
    }
    return time; 
}

function runTimer() {
    let currentTime = leadingZero(timer[0]) + ":" + leadingZero(timer[1]) + ":" + leadingZero(timer[2]);
    domTime.innerHTML = currentTime;
    // console.log(timer[3]);
    timer[3]++; // contador de decimos de segundos

    timer[0] = Math.floor(timer[3]/100/60); // converte os decimos de segundos em minutos
    timer[1] = Math.floor((timer[3]/100) - (timer[0] * 60)); // converte os decimos de segundos em segundos (descontando os minutos já considerados)
    timer[2] = Math.floor(timer[3] - timer[1]*100 - timer[0]*60*100); // pega do total de decimos de segundos e desconta os minutos e segundos já considerados acima, para exibir apenas os decimos de segundos remanescentes.
}

function triggerTimer() {
    // console.log("keypress triggered")
    let textLength = textArea.value.length;
    if (textLength === 0 && !timerRunning) { // se nada foi digitado e o timerRunning for false, ativa o timer
        timerRunning = true;
        interval = setInterval(runTimer, 10);
    }
}

textArea.addEventListener("keyup", spellCheck, false);
textArea.addEventListener("keypress", triggerTimer, false);
resetButton.addEventListener("click", reset, false);


async function reset() {
    clearInterval(interval);
    interval = null;
    timer = [0,0,0,0];
    timerRunning = false;

    textArea.value = "";
    textArea.readOnly = false;
    domTime.innerHTML = "00:00:00";
    textWrapper.style.borderColor = "grey";
    await fetchRandonPhrase();
}

// URL da API (achei essa API na internet que retorna frases aleatorias de braking bad)
const apiUrl = 'https://api.breakingbadquotes.xyz/v1/quotes';

// Função para buscar uma frase aleatória
async function fetchRandonPhrase() {
  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Error');
      }
    //   console.log(response.json());
      return response.json();
    })
    .then(data => {
        console.log(data);
        console.log(data[0].quote);
        console.log(data[0].author);
        textGabarito.innerText = data[0].quote; // Suponha que a resposta contém um campo "frase"

    })
    .catch(error => {
      return "The fun’s over. From here on out, I’m Mr. Low Profile. Just another douche bag with a job and three pairs of Dockers. If I’m lucky, month from now, best-case scenario, I’m managing a Cinnabon in Omaha."; // frase padrão, caso algum erro ocorra.
    });
}

window.addEventListener('load', async (event) => {

    console.log('The page has fully loaded');
    await fetchRandonPhrase();
    
});


async function loadPhrase() {
    await fetchRandonPhrase();
}

