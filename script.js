document.addEventListener('DOMContentLoaded', (event) => {
    const sendButton = document.getElementById('sendButton');
    const statusMessage = document.getElementById('statusMessage');

    const ws = new WebSocket('wss://onebuttonserver.onrender.com:10000');
    // const ws = new WebSocket('ws://localhost:5569');

    ws.onopen = () => {
        console.log('Connected to WebSocket server');
        statusMessage.textContent = "Conectado!";
        sendButton.classList.remove('hidden');
        sendButton.style.display = 'block'; // Garante que o botão será exibido
    };

    ws.onmessage = (event) => {
        console.log('Message from server:', event.data);
    };

    ws.onclose = (event) => {
        console.log('Disconnected from WebSocket server');
        console.log('Code:', event.code, 'Reason:', event.reason);
        statusMessage.textContent = "Desconectado.";
        connectButton.classList.add('hidden');
        connectButton.style.display = 'none'; // Oculta o botão
        sendButton.classList.add('hidden');
        sendButton.style.display = 'none'; // Oculta o botão
    };

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
});
