import asyncio
import websockets
import json


# Lista de clientes conectados:
connected = set()

    
# Comportamento principal do Servidor:
async def server(ws, path):
    # Registrar cliente:
    connected.add(ws)
    print(f"Novo Cliente Conectado: {ws.remote_address}")

    # Controlar mensagens recebidas:
    try:
        # Enviar mensagem para todos os clientes conectados:
        async for msg in ws:
            print("MSG DO CLIENTE: " + str(msg))
            for conn in connected:
                if conn != ws:
                    print("Enviada para o cliente: " + str(conn.remote_address))
                    await conn.send(msg)

                    # Obter tipo de Pacote:
                    # data = json.loads(str(msg))
    finally:
        # Unregister:
        connected.remove(ws)
        print(f"Cliente Desconectado: {ws.remote_address}")


def main():
    start_server = websockets.serve(server, "", 4999)
    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()


if __name__ == "__main__":
    main()