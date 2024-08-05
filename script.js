const nameScreen = document.getElementById('nameScreen');
const waitForStartScreen = document.getElementById('waitForStartScreen');
const waitingScreen = document.getElementById('waitingScreen');
const guessScreen = document.getElementById('guessScreen');
const endScreen = document.getElementById('endScreen');
const loadingScreen = document.getElementById('loadingScreen');

const playerNameInput = document.getElementById('playerName');
const joinButton = document.getElementById('joinButton');
const guessInput = document.getElementById('guess');
const incrementGuessButton = document.getElementById('incrementGuessButton');
const submitGuessButton = document.getElementById('submitGuessButton');
const resultMessage = document.getElementById('resultMessage');
const restartButton = document.getElementById('restartButton');

const incrementSound = document.getElementById('incrementSound');
const submitSound = document.getElementById('submitSound');


let playerId = null;
let playerName = "";
let pointsNumber = 0;

const ws = new WebSocket('wss://onebuttonserver.onrender.com/:10000');
// const ws = new WebSocket('ws://localhost:10000');

ws.onopen = () => {
    console.log('Conectado ao servidor');
    showScreen(nameScreen);
    var _joinButton = document.getElementById("joinButton");
    _joinButton.disabled = true;
};

ws.onerror = (error) => {
    console.error('Erro de conexão WebSocket:', error);
};

ws.onclose = () => {
    console.log('Conexão WebSocket fechada');
};

ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    console.log("Mensagem recebida", message);
    if (message.type === 'joined') {
        playerId = message.playerId;
        // showScreen(waitForStartScreen);
    } else if (message.type === 'startGuessing') {
        console.log("STARTING GUESSING");
        showScreen(waitingScreen);
        setTimeout(() => {
            showScreen(guessScreen);
        }, 5000); // Ajuste o tempo conforme necessário
    } else if (message.type === 'enableGuessing') {
        submitGuessButton.classList.remove('hidden');
    } else if (message.type === 'gameResult') {
        resultMessage.textContent = message.result;
        showScreen(endScreen);
        footer.classList.remove('hidden');
    }
};

joinButton.onclick = () => {
    playerName = playerNameInput.value.trim();
    if (playerName) {
        const joinMessage = {
            type: 'join',
            playerName: playerName
        };
        
        console.log('Enviando mensagem:', joinMessage);
        ws.send(JSON.stringify(joinMessage));
    
        nameScreen.classList.add('hidden');
        waitForStartScreen.classList.remove('hidden');
        footer.classList.add('hidden');
    }
};

incrementGuessButton.onclick = () => {
    const currentGuess = parseInt(guessInput.value, 10) || 0;
    guessInput.value = currentGuess + 1;
    incrementSound.play();
};

submitGuessButton.onclick = () => {
    const guess = guessInput.value.trim();
    if (guess) {
        const guessMessage = {
            type: 'guess',
            playerName: playerName,
            guess: guess
        };
        ws.send(JSON.stringify(guessMessage));
        showScreen(waitingScreen); // Volta para a tela de espera após enviar o palpite
        submitSound.play();
    }
};

restartButton.onclick = () => {
    location.reload();
};

function showScreen(screen) {
    nameScreen.classList.add('hidden');
    waitForStartScreen.classList.add('hidden');
    waitingScreen.classList.add('hidden');
    guessScreen.classList.add('hidden');
    endScreen.classList.add('hidden');
    loadingScreen.classList.add('hidden');
    screen.classList.remove('hidden');
}

setInterval(function() {
    pointsNumber = (pointsNumber + 1) % 4;
    var _msg = document.getElementById("connectingMsg");
    _msg.textContent = "Conectando outros jogadores" + ".".repeat(pointsNumber);

    var _loading = document.getElementById("loadingMsg");
    _loading.textContent = "CONECTANDO-SE AO SERVIDOR" + ".".repeat(pointsNumber);

    var _waitMsg = document.getElementById("waitMsg");
    _waitMsg.textContent = "Aguarde" + ".".repeat(pointsNumber);
}, 500);

var _playerName = document.getElementById("playerName");
var _joinButton = document.getElementById("joinButton");
// Mudar estilo do botão se não houver texto   
_playerName.oninput = function() {
    if (_playerName.value.trim() === "") {
        // Botão ficará desativado
        _joinButton.disabled = true;
    } else {
        _joinButton.disabled = false;
    }
}