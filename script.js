document.addEventListener('DOMContentLoaded', (event) => {
    const connectButton = document.getElementById('connectButton');
    const statusMessage = document.getElementById('statusMessage');

    const ws = new WebSocket('wss://onebuttonserver.onrender.com:10000');

    ws.onopen = () => {
        console.log('Connected to WebSocket server');
        statusMessage.textContent = "Conectado!";
        connectButton.classList.remove('hidden');
    };

    ws.onmessage = (event) => {
        console.log('Message from server:', event.data);
    };

    ws.onclose = (event) => {
        console.log('Disconnected from WebSocket server');
        console.log('Code:', event.code, 'Reason:', event.reason);
        statusMessage.textContent = "Desconectado.";
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        statusMessage.textContent = "Erro de conexão.";
    };
});
