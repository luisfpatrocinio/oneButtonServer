import asyncio
import websockets

# Lista para armazenar as conexões dos clientes
connected_clients = set()

async def handler(websocket, path):
    # Adiciona o cliente à lista de conexões
    connected_clients.add(websocket)
    try:
        async for message in websocket:
            # Quando uma mensagem é recebida, envie para todos os clientes conectados
            await asyncio.wait([client.send(message) for client in connected_clients])
    except websockets.exceptions.ConnectionClosed as e:
        print(f"Cliente desconectado: {e}")
    finally:
        # Remove o cliente da lista de conexões
        connected_clients.remove(websocket)

async def main():
    async with websockets.serve(handler, "0.0.0.0", 10000):
        await asyncio.Future()  # Run forever

if __name__ == "__main__":
    asyncio.run(main())
