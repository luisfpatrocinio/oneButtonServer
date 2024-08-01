const statusMessage = document.getElementById('statusMessage');
const playerIdElement = document.getElementById('playerId');
const connectedPlayersElement = document.getElementById('connectedPlayers');
const sendButton = document.getElementById('sendButton');
const ws = new WebSocket('wss://onebuttonserver.onrender.com/:10000');
// const ws = new WebSocket('ws://localhost:10000');

ws.onopen = () => {
    statusMessage.textContent = 'Conectado!';
};

ws.onerror = (error) => {
    statusMessage.textContent = 'Erro de conexão';
    console.error('WebSocket error:', error);
};

ws.onclose = () => {
    statusMessage.textContent = 'Conexão fechada';
    sendButton.classList.add('hidden');
    playerIdElement.classList.add('hidden');
    connectedPlayersElement.classList.add('hidden');
};

ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.type === 'welcome') {
        playerIdElement.textContent = `Seu ID: ${message.playerId}`;
        connectedPlayersElement.textContent = `Jogadores Conectados: ${message.connectedPlayers}`;
        playerIdElement.classList.remove('hidden');
        connectedPlayersElement.classList.remove('hidden');
        sendButton.classList.remove('hidden');
    } else if (message.type === 'update') {
        connectedPlayersElement.textContent = `Jogadores Conectados: ${message.connectedPlayers}`;
    }
};

sendButton.onclick = () => {
    const message = {
        userId: playerIdElement.textContent.split(' ')[2],
        type: 'signal'
    };
    ws.send(JSON.stringify(message));
};
