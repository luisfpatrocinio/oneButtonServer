import asyncio
import websockets
import json

# Lista de clientes conectados e contagem de jogadores:
connected = {}
player_count = 0

async def server(ws, path):
    global player_count

    try:
        async for msg in ws:
            print("MSG DO CLIENTE: " + str(msg))
            message = json.loads(msg)

            if message['type'] == 'join':
                # Atribuir um identificador único ao jogador:
                player_count += 1
                player_id = player_count
                connected[ws] = player_id

                print(f"Novo Cliente Conectado: {ws.remote_address} como Jogador {player_id}")
                await ws.send(json.dumps({"type": "welcome", "playerId": player_id, "connectedPlayers": len(connected)}))

                # Notificar todos os clientes sobre a nova conexão
                update_message = json.dumps({"type": "update", "connectedPlayers": len(connected)})
                await asyncio.wait([conn.send(update_message) for conn in connected])

            elif message['type'] == 'signal':
                for conn in connected:
                    if conn != ws:
                        try:
                            print("Enviada para o cliente: " + str(conn.remote_address))
                            await conn.send(msg)
                        except Exception as e:
                            print(f"Erro ao enviar mensagem para {conn.remote_address}: {e}")
    except Exception as e:
        print(f"Erro na conexão com {ws.remote_address}: {e}")
    finally:
        if ws in connected:
            del connected[ws]
            player_count -= 1
            print(f"Cliente Desconectado: {ws.remote_address}")
            # Notificar outros clientes sobre a desconexão:
            update_message = json.dumps({"type": "update", "connectedPlayers": len(connected)})
            await asyncio.wait([conn.send(update_message) for conn in connected])

def main():
    start_server = websockets.serve(server, "0.0.0.0", 10000)
    # start_server = websockets.serve(server, "localhost", 10000)
    loop = asyncio.get_event_loop()
    loop.run_until_complete(start_server)
    print("Servidor iniciado em ws://0.0.0.0:10000")
    loop.run_forever()

if __name__ == "__main__":
    main()