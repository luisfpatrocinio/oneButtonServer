document.addEventListener('DOMContentLoaded', (event) => {

}
);

const sendButton = document.getElementById('sendButton');
const statusMessage = document.getElementById('statusMessage');

const ws = new WebSocket('wss://onebuttonserver.onrender.com:4999');
// const ws = new WebSocket('ws://localhost:5569');

// Conexão Aberta
ws.addEventListener('open', function (event) {
    console.log('Connected to WebSocket server');
    statusMessage.textContent = "Conectado!";
    sendButton.classList.remove('hidden');
    sendButton.style.display = 'block'; // Garante que o botão será exibido
});

ws.onmessage = (event) => {
    console.log('Message from server:', event.data);
};

// Conexão Fechada
ws.addEventListener('close', function (event) {
    console.log('Disconnected from WebSocket server');
    console.log('Code:', event.code, 'Reason:', event.reason);
    statusMessage.textContent = "Desconectado.";
    sendButton.classList.add('hidden');
    sendButton.style.display = 'none'; // Oculta o botão
});

ws.onerror = (error) => {
    console.error('WebSocket error:', error);
    statusMessage.textContent = "Erro de conexão.";
};

sendButton.addEventListener('click', () => {
    const message = {
        userId: 'your_user_id', // Substitua 'your_user_id' pelo ID do usuário apropriado
        commandType: 'signal'
    };
    ws.send(JSON.stringify(message));
    console.log('Sent:', message);
});
