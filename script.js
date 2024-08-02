const nameScreen = document.getElementById('nameScreen');
const waitForStartScreen = document.getElementById('waitForStartScreen');
const waitingScreen = document.getElementById('waitingScreen');
const guessScreen = document.getElementById('guessScreen');
const endScreen = document.getElementById('endScreen');

const playerNameInput = document.getElementById('playerName');
const joinButton = document.getElementById('joinButton');
const guessInput = document.getElementById('guess');
const submitGuessButton = document.getElementById('submitGuessButton');
const resultMessage = document.getElementById('resultMessage');
const restartButton = document.getElementById('restartButton');

let playerId = null;
let playerName = "";

// const ws = new WebSocket('wss://onebuttonserver.onrender.com:10000');
const ws = new WebSocket('ws://localhost:10000');

ws.onopen = () => {
    console.log('Conectado ao servidor');
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
        showScreen(waitForStartScreen);
    } else if (message.type === 'startGuessing') {
        console.log("STARTING GUESSING");
        showScreen(waitingScreen);
        setTimeout(() => {
            showScreen(guessScreen);
        }, 5000); // Ajuste o tempo conforme necessário
    } else if (message.type === 'gameResult') {
        resultMessage.textContent = message.result;
        showScreen(endScreen);
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
    }
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
    screen.classList.remove('hidden');
}
