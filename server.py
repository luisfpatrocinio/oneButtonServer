import asyncio
import json
import websockets

connected_clients = set()

async def handler(websocket, path):
    connected_clients.add(websocket)
    try:
        async for message in websocket:
            # Sinalizar que uma mensagem foi recebida
            print(f"Received message: {message}")
            
            # Enviar uma confirmação de volta ao cliente
            response = {"status": "received", "message": message}
            await websocket.send(json.dumps(response))

            # Distribuir a mensagem para todos os clientes conectados
            await asyncio.gather(
                *[client.send(message) for client in connected_clients]
            )
    except websockets.exceptions.ConnectionClosed as e:
        print(f"Client disconnected: {e}")
    finally:
        connected_clients.remove(websocket)
        print("É impressão minha ou foi removido o cliente?")

async def main():
    async with websockets.serve(handler, "0.0.0.0", 10000):
        await asyncio.Future()  # Run forever

if __name__ == "__main__":
    asyncio.run(main())
