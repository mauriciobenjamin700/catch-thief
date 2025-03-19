import asyncio
import websockets

async def send_image_via_websocket(image_path: str, websocket_url: str):
    async with websockets.connect(websocket_url) as websocket:
        # Ler a imagem como bytes
        with open(image_path, "rb") as image_file:
            image_data = image_file.read()
        
        # Enviar a imagem via WebSocket
        await websocket.send(image_data)
        
        # Receber a resposta
        response = await websocket.recv()
        print(f"Response from server: {response}")

if __name__ == "__main__":
    image_path = "xand.jpeg"  # Substitua pelo caminho da sua imagem
    websocket_url = "ws://localhost:9000/images/ws"  # Substitua pela URL do seu WebSocket

    asyncio.run(send_image_via_websocket(image_path, websocket_url))