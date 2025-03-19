from fastapi import (
    APIRouter,
    WebSocket
)
from fastapi.responses import HTMLResponse


from app.api.html.pages import (
    html,
    websocket_html_content
)


router = APIRouter(prefix="/messages", tags=["Messages"])


@router.get("")
async def get():
    return HTMLResponse(html, 200)

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"Message text was: {data}")
        
@router.get("/ws-docs")
async def websocket_docs():
    return HTMLResponse(websocket_html_content, 200)