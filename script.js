document.addEventListener('DOMContentLoaded', (event) => {
    const connectButton = document.getElementById('connectButton');

    const ws = new WebSocket("ws://onebuttonserver.onrender.com:5569");

    ws.onopen = () => {
        console.log('Connected to WebSocket server');
        connectButton.classList.remove('hidden');
    };

    ws.onmessage = (event) => {
        console.log('Message from server:', event.data);
    };

    ws.onclose = () => {
        console.log('Disconnected from WebSocket server');
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };
});
