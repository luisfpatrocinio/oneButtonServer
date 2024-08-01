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
                try:
                    if conn != ws:
                        print("Enviada para o cliente: " + str(conn.remote_address))
                        await conn.send(msg)

                        # Obter tipo de Pacote:
                        # data = json.loads(str(msg))
                except Exception as e:
                        print(f"Erro ao enviar mensagem para {conn.remote_address}: {e}")
                        
    except Exception as e:
        print(f"Erro na conexão com {ws.remote_address}: {e}")

    finally:
        # Unregister:
        connected.remove(ws)
        print(f"Cliente Desconectado: {ws.remote_address}")


def main():
    start_server = websockets.serve(server, "0.0.0.0", 10000)
    loop = asyncio.get_event_loop()
    loop.run_until_complete(start_server)
    print("Servidor iniciado em ws://0.0.0.0:10000")
    loop.run_forever()


if __name__ == "__main__":
    main()