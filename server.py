import asyncio
import websockets
import json


# Lista de clientes conectados:
connected = {}
playerCount = 0

    
# Comportamento principal do Servidor:
async def server(ws, path):
    global playerCount

    # Atribuir um identificador unico ao jogador:
    playerCount += 1
    playerId = playerCount
    connected[ws] = playerId
    print(f"Novo Cliente Conectado: {ws.remote_address} como Jogador {playerId}")

    # Enviar informações iniciais ao cliente:
    await ws.send(json.dumps({"type": "welcome", "playerId": playerId, "connectedPlayers": len(connected)}))

    # Controlar mensagens recebidas:
    try:
        # Enviar mensagem para todos os clientes conectados:
        async for msg in ws:
            print("MSG DO CLIENTE: " + str(msg))
            for conn in connected:
                try:
                    if conn != ws:
                        print("Enviada para o cliente: " + str(conn.remote_address))
                        await conn.send(msg)
                except Exception as e:
                        print(f"Erro ao enviar mensagem para {conn.remote_address}: {e}")
                        
    except Exception as e:
        print(f"Erro na conexão com {ws.remote_address}: {e}")

    finally:
        # Unregister:
        del connected[ws]
        playerCount -= 1
        print(f"Cliente Desconectado: {ws.remote_address}")
        # Notificar outros clientes sobre a desconexão:
        for conn in connected:
            await conn.send(json.dumps({"type": "update", "connectedPlayers": len(connected)}))


def main():
    start_server = websockets.serve(server, "0.0.0.0", 10000)
    # start_server = websockets.serve(server, "localhost", 10000)
    loop = asyncio.get_event_loop()
    loop.run_until_complete(start_server)
    print("Servidor iniciado em ws://0.0.0.0:10000")
    loop.run_forever()


if __name__ == "__main__":
    main()