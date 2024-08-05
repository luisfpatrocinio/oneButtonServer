import asyncio
import websockets
import json

# Lista de clientes conectados e contagem de jogadores:
connected_clients = set()
player_count = 0

async def server(ws, path):
    global player_count

    # Registrar cliente:
    connected_clients.add(ws)
    print(f"Novo Cliente Conectado: {ws.remote_address}")

    try:
        async for msg in ws:
            message = json.loads(msg)
            print("Mensagem recebida: ", message)
            if message['type'] == 'join':
                player_count += 1
                player_id = player_count
                print(f"Um jogador deu join: {message['playerName']} ({ws.remote_address}) como Jogador {player_id}")

                # await ws.send()

                for conn in connected_clients:
                    # Mandar essa mensagem apenas para quem mandou o join
                    # if conn == ws:
                    await conn.send(json.dumps({"type": "joined", "playerName": message['playerName'], "playerId": player_id}))

                # if len(connected_clients) >= N:
                #     start_guessing_message = json.dumps({"type": "startGuessing"})
                #     await asyncio.wait([conn.send(start_guessing_message) for conn in connected_clients])

            # Jogador mandou um palpite
            elif message['type'] == 'guess':
                # connected_clients[ws]['guess'] = message['guess']
                # if all('guess' in client for client in connected_clients.values()):
                #     results = process_guesses()
                #     result_message = json.dumps({"type": "gameResult", "result": results})
                #     await asyncio.wait([conn.send(result_message) for conn in connected_clients])
                
                _resultMessage = message
                print("Palpite recebido que será ecoado: ", _resultMessage)
                # Mandar para todos o json com o palpite.
                for conn in connected_clients:
                    await conn.send(json.dumps(_resultMessage))

            # Momento em que os jogadores devem palpitar.
            elif message['type'] == 'startGuessing':
                for conn in connected_clients:
                    await conn.send(json.dumps({"type": "startGuessing"}))

            # Jogo permitirá que os jogadores enviem seus palpites.
            elif message['type'] == 'enableGuessing':
                for conn in connected_clients:
                    await conn.send(json.dumps({"type": "enableGuessing"}))

            # Jogo avisará quando a sessão acabar;.
            elif message['type'] == 'gameResult':
                for conn in connected_clients:
                    await conn.send(json.dumps({"type": "gameResult", "result": message['result']}))

    except Exception as e:
        print(f"Erro na conexão com {ws.remote_address}: {e}")
    finally:
        if ws in connected_clients:
            connected_clients.remove(ws)
            player_count -= 1
            print(f"Cliente Desconectado: {ws.remote_address}")
            

def process_guesses():
    correct_number = 42  # Exemplo
    winners = [client['playerName'] for client in connected_clients.values() if int(client.get('guess', 0)) == correct_number]
    if winners:
        return f"Os vencedores são: {', '.join(winners)}"
    else:
        return "Nenhum vencedor desta vez!"

def main():
    start_server = websockets.serve(server, "0.0.0.0", 10000)
    # start_server = websockets.serve(server, "", 10000)
    loop = asyncio.get_event_loop()
    loop.run_until_complete(start_server)
    print("Servidor iniciado em ws://0.0.0.0:10000")
    loop.run_forever()

if __name__ == "__main__":
    main()
