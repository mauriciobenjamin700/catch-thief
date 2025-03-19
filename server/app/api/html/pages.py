html = """
<!DOCTYPE html>
<html>
    <head>
        <title>Chat</title>
    </head>
    <body>
        <h1>WebSocket Chat</h1>
        <form action="" onsubmit="sendMessage(event)">
            <input type="text" id="messageText" autocomplete="off"/>
            <button>Send</button>
        </form>
        <ul id='messages'>
        </ul>
        <script>
            var ws = new WebSocket("ws://localhost:9000/messages/ws");
            ws.onmessage = function(event) {
                var messages = document.getElementById('messages')
                var message = document.createElement('li')
                var content = document.createTextNode(event.data)
                message.appendChild(content)
                messages.appendChild(message)
            };
            function sendMessage(event) {
                var input = document.getElementById("messageText")
                ws.send(input.value)
                input.value = ''
                event.preventDefault()
            }
        </script>
    </body>
</html>
"""

websocket_html_content = """
    <!DOCTYPE html>
    <html>
        <head>
            <title>WebSocket Documentation</title>
        </head>
        <body>
            <h1>WebSocket Endpoint</h1>
            <p>Connect to the WebSocket endpoint at <code>ws://localhost:9000/images/ws</code></p>
            <p>Send image data as binary and receive a JSON response with the image path.</p>
        </body>
    </html>
    """